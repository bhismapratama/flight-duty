module.exports = {
  'nest/{src,test}/**/*.ts': [
    'pnpm --dir nest exec prettier --write',
    'pnpm --dir nest exec oxlint --type-aware',
  ],
  'nuxt/**/*.{ts,mjs,vue,scss}': 'pnpm --dir nuxt exec prettier --write',
};
