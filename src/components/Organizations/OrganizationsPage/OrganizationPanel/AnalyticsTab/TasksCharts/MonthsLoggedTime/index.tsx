import React from 'react';
import BarChart from '../../ChartsContainers/BarChart';
import { ChartConfig } from '@/components/ui/chart';

const MonthsLoggedTime = ({
  tasksAnalyticsData,
}: {
  tasksAnalyticsData: { month: string; hours: number }[];
}) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dataMap = tasksAnalyticsData.reduce<Record<string, number>>(
    (acc, item) => {
      const [, month] = item.month.split('-');
      const monthIndex = parseInt(month, 10) - 1;
      acc[monthIndex] = item.hours;
      return acc;
    },
    {},
  );

  const generateBlueShades = (count: number) => {
    return Array.from({ length: count }, (_, i) => {
      const hue = 200 + ((i * 10) % 360);
      const saturation = 40;
      const lightness = 80 - (i % 3) * 10;
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    });
  };

  const colors = generateBlueShades(months.length);

  const chartData = months.map((m, i) => ({
    month: m,
    hours: dataMap[i] ?? 0,
    fill: colors[i],
  }));

  const chartConfig = {
    hours: {
      label: 'Hours',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <BarChart
      chartData={chartData}
      chartConfig={chartConfig}
      title='Logged Hours'
      footerDescription='Showing logged time for the year'
    />
  );
};

export default MonthsLoggedTime;
