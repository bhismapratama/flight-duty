<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
  type Plugin,
  type ScriptableContext,
  type ScriptableLineSegmentContext,
  type ScriptableScaleContext,
  type TooltipItem,
} from 'chart.js';
import { Line } from 'vue-chartjs';
import type { ChartPoint, RollingChart } from '~/types/entities/flight-hours';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const props = defineProps<{ chart: RollingChart; loading?: boolean }>();

const theme = useThemeColors();
ChartJS.defaults.font.family = theme.fontFamily;

const points = computed<ChartPoint[]>(() => props.chart.points);
const todayIndex = computed(() => points.value.findIndex(point => point.isToday));

const labels = computed(() => points.value.map(point => String(dayOfMonth(point.date))));

const pointAt = (index: number): ChartPoint | undefined => points.value[index];

const todayMarker: Plugin<'line'> = {
  id: 'todayMarker',
  beforeDatasetsDraw(chart) {
    const index = todayIndex.value;
    if (index < 0) {
      return;
    }
    const x = chart.scales.x!.getPixelForValue(index);
    const { top, bottom } = chart.chartArea;
    const { ctx } = chart;

    ctx.save();
    ctx.strokeStyle = theme.navy;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, top + 14);
    ctx.lineTo(x, bottom);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = `700 10px ${theme.fontFamily}`;
    const label = 'Today';
    const width = ctx.measureText(label).width + 12;
    ctx.fillStyle = theme.navy;
    ctx.beginPath();
    ctx.roundRect(x - width / 2, top - 4, width, 16, 8);
    ctx.fill();
    ctx.fillStyle = theme.surface;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, top + 4);
    ctx.restore();
  },
};

const plugins = [todayMarker];

const data = computed<ChartData<'line'>>(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Rolling sum',
      data: points.value.map(point => point.value),
      borderColor: theme.chart,
      borderWidth: 2.5,
      backgroundColor: `${theme.chart}26`,
      fill: 'origin',
      tension: 0.35,
      pointRadius: (context: ScriptableContext<'line'>) =>
        pointAt(context.dataIndex)?.isToday ? 6 : 3.5,
      pointHoverRadius: 7,
      pointBorderWidth: 2,
      pointBorderColor: theme.surface,
      pointBackgroundColor: (context: ScriptableContext<'line'>) =>
        pointAt(context.dataIndex)?.isOverLimit ? theme.danger : theme.chart,
      segment: {
        borderDash: (context: ScriptableLineSegmentContext) =>
          pointAt(context.p1DataIndex)?.isFuture ? [6, 5] : undefined,
      },
    },
    {
      label: 'Limit',
      data: points.value.map(() => props.chart.limit),
      borderColor: theme.red,
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 0,
      fill: false,
    },
  ],
}));

const options = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 350 },
  interaction: { mode: 'index', intersect: false },
  layout: { padding: { top: 16 } },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: theme.navy,
      padding: 10,
      displayColors: false,
      filter: (item: TooltipItem<'line'>) => item.datasetIndex === 0,
      callbacks: {
        title: (items: TooltipItem<'line'>[]) => {
          const point = pointAt(items[0]?.dataIndex ?? -1);
          if (!point) {
            return '';
          }
          return `${formatShortDate(point.date)}${point.isFuture ? ' · projected' : ''}`;
        },
        label: (item: TooltipItem<'line'>) => {
          const point = pointAt(item.dataIndex);
          const suffix = point?.isOverLimit ? ' (over limit)' : '';
          return `${formatHours(Number(item.raw))} h of ${props.chart.limit} h${suffix}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        autoSkip: false,
        maxRotation: 0,
        font: (context: ScriptableScaleContext) => ({
          size: 10,
          weight: context.index === todayIndex.value ? 800 : 500,
        }),
        color: (context: ScriptableScaleContext) =>
          context.index === todayIndex.value ? theme.navy : theme.textSecondary,
      },
    },
    y: {
      min: 0,
      max: props.chart.yAxisMax,
      border: { display: false },
      grid: { color: theme.border },
      ticks: {
        maxTicksLimit: 5,
        color: theme.textSecondary,
        font: { size: 10 },
        callback: (value: string | number) => `${value}h`,
      },
    },
  },
}));

const summaryLabel = computed(() => {
  const today = pointAt(todayIndex.value);
  const over = points.value.filter(point => point.isOverLimit).length;
  const base = today
    ? `Rolling ${props.chart.windowDays}-day flight hours. Today ${formatHours(today.value)} of ${props.chart.limit} hour limit.`
    : 'Rolling flight hours chart.';
  return over > 0 ? `${base} ${over} days above the limit.` : base;
});
</script>

<template>
  <div class="rolling-chart" :class="{ 'is-loading': loading }">
    <div class="canvas" role="img" :aria-label="summaryLabel">
      <Line :data="data" :options="options" :plugins="plugins" />
    </div>
    <ul class="legend">
      <li class="legend-item">
        <span class="swatch is-actual" />
        Flown
      </li>
      <li class="legend-item">
        <span class="swatch is-projected" />
        Projected
      </li>
      <li class="legend-item">
        <span class="swatch is-limit" />
        Limit {{ chart.limit.toLocaleString('en-US') }} h
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.rolling-chart {
  transition: opacity $transition-fast;

  &.is-loading {
    opacity: 0.5;
  }

  .canvas {
    position: relative;
    height: 220px;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $space-2 $space-4;
    margin-top: $space-3;
    font-size: 0.75rem;
    color: $color-text-secondary;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .swatch {
    width: 18px;
    height: 0;
    border-top: 2.5px solid $color-chart;

    &.is-projected {
      border-top-style: dashed;
    }

    &.is-limit {
      border-top: 2px solid $color-red;
    }
  }
}
</style>
