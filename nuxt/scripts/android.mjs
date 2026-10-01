import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { connect } from 'node:net';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const android = path.join(root, 'android');
const isWindows = process.platform === 'win32';

const args = process.argv.slice(2);
const apkOnly = args.includes('--apk');
const live = args.includes('--live');

const DEV_PORT = 3000;
const API_PORT = 4000;
const APP_ID = 'com.susiair.pilot';
const apkPath = path.join(android, 'app/build/outputs/apk/debug/app-debug.apk');

function fail(message, hint) {
  console.error(`\n✖ ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

function quote(value) {
  return isWindows && value.includes(' ') ? `"${value}"` : value;
}

function run(command, commandArgs, options = {}) {
  const base = {
    stdio: options.capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
    cwd: options.cwd ?? root,
    env: { ...process.env, ...options.env },
  };
  const result = isWindows
    ? spawnSync([command, ...commandArgs].join(' '), { ...base, shell: true })
    : spawnSync(command, commandArgs, base);

  if (result.status !== 0 && !options.allowFailure) {
    fail(`Command failed: ${command} ${commandArgs.join(' ')}`);
  }
  return result;
}

function javaMajor(home) {
  const binary = path.join(home, 'bin', isWindows ? 'java.exe' : 'java');
  if (!existsSync(binary)) return null;
  const probe = spawnSync(binary, ['-version'], { encoding: 'utf8' });
  const match = `${probe.stderr ?? ''}${probe.stdout ?? ''}`.match(/version "(\d+)/);
  return match ? Number(match[1]) : null;
}

function findJdk() {
  const candidates = [
    process.env.JAVA_HOME,
    'C:/Program Files/Android/Android Studio/jbr',
    process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}/Programs/Android Studio/jbr`,
    '/Applications/Android Studio.app/Contents/jbr/Contents/Home',
    '/opt/android-studio/jbr',
  ].filter(Boolean);

  for (const candidate of candidates) {
    const home = path.normalize(candidate);
    const major = javaMajor(home);
    if (major !== null && major >= 21) return { home, major };
  }
  return null;
}

function findAdb() {
  const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
  const inSdk = sdk && path.join(sdk, 'platform-tools', isWindows ? 'adb.exe' : 'adb');
  return inSdk && existsSync(inSdk) ? inSdk : 'adb';
}

function connectedDevices(adb) {
  const result = run(quote(adb), ['devices'], { capture: true, allowFailure: true });
  return (result.stdout ?? '')
    .split('\n')
    .slice(1)
    .filter(line => line.trim().endsWith('device')).length;
}

function reversePort(adb, port) {
  run(quote(adb), ['reverse', `tcp:${port}`, `tcp:${port}`], { allowFailure: true });
}

function isListening(port) {
  return new Promise(resolve => {
    const socket = connect({ host: '127.0.0.1', port });
    const done = result => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(2000);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

const jdk = findJdk();
if (!jdk) {
  fail('JDK 21 or newer not found.', 'Install Android Studio, or point JAVA_HOME at a JDK 21.');
}
console.log(`→ JDK ${jdk.major}: ${jdk.home}`);

const adb = findAdb();
const usesLocalApi = !existsSync(path.join(root, '.env.production'));

if (live) {
  if (!(await isListening(DEV_PORT))) {
    fail(
      `No dev server on 127.0.0.1:${DEV_PORT}.`,
      'Run `pnpm dev:host` in another terminal first.',
    );
  }
  if (!(await isListening(API_PORT))) {
    console.log(
      `! Nothing on 127.0.0.1:${API_PORT}. Start the API (../nest) or the app will show connection errors.`,
    );
  }
  if (connectedDevices(adb) === 0) {
    fail('No Android device connected.', 'Enable USB debugging, or start an emulator.');
  }

  reversePort(adb, API_PORT);
  run(
    'pnpm',
    [
      'exec',
      'cap',
      'run',
      'android',
      '--live-reload',
      '--host',
      'localhost',
      '--port',
      String(DEV_PORT),
      '--forwardPorts',
      `${DEV_PORT}:${DEV_PORT}`,
    ],
    { env: { JAVA_HOME: jdk.home } },
  );
  console.log(
    '\n✔ Installed in live-reload mode. Run `pnpm android` to go back to the standalone build.',
  );
  process.exit(0);
}

if (usesLocalApi) {
  console.log('\n! No .env.production found: the APK will call http://localhost:4000.');
  console.log(
    '  That works over USB (adb reverse), not on its own. Create .env.production for a real build.',
  );
}

console.log('\n→ Building the web app');
run('pnpm', [usesLocalApi ? 'generate' : 'build:prod']);

console.log('\n→ Syncing into the Android project');
run('pnpm', ['exec', 'cap', 'sync', 'android'], {
  env: { CAP_LOCAL_HTTP_API: usesLocalApi ? 'true' : 'false' },
});

console.log('\n→ Gradle assembleDebug');
const gradlew = path.join(android, isWindows ? 'gradlew.bat' : 'gradlew');
run(quote(gradlew), ['assembleDebug'], { cwd: android, env: { JAVA_HOME: jdk.home } });

if (!existsSync(apkPath)) {
  fail(`Gradle finished but no APK at ${apkPath}`);
}
console.log(`\n✔ APK: ${path.relative(root, apkPath)}`);

if (apkOnly) {
  process.exit(0);
}

if (connectedDevices(adb) === 0) {
  console.log(
    '\n! No device connected, skipping install. Copy the APK to the phone and open it there.',
  );
  process.exit(0);
}

console.log('\n→ Installing on the device');
run(quote(adb), ['install', '-r', quote(apkPath)]);
if (usesLocalApi) {
  reversePort(adb, API_PORT);
}
run(quote(adb), ['shell', 'monkey', '-p', APP_ID, '-c', 'android.intent.category.LAUNCHER', '1'], {
  capture: true,
  allowFailure: true,
});
console.log('\n✔ Done. "Susi Air Pilot" is open on the device.');
