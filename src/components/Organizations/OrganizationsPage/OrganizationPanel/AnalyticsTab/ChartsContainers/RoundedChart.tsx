import React from 'react';
import { Card } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart } from 'recharts';

const RoundedChart = ({
  title,
  data,
  shades,
  cardClassName = '',
}: {
  title: string;
  data: Record<string, number>;
  shades: string[];
  cardClassName?: string;
}) => {
  const chartData = Object.entries(data).map(([label, value], i) => ({
    range: label,
    count: value,
    fill: shades[i],
  }));

  const chartConfig = {
    count: {
      label: title + 'Chart',
    },
    ...Object.fromEntries(
      Object.keys(data).map((key, i) => [
        key,
        {
          label: `${key} (${data[key]})`,
          color: shades[i],
        },
      ]),
    ),
  } satisfies ChartConfig;

  return (
    <Card className={`w-fit pb-4 bg-gray-100/40 ${cardClassName}`}>
      <div className='text-center w-full mt-4 -mb-3'>
        <h3 className='text-lg font-semibold text-card-foreground/70'>
          {title}
        </h3>
      </div>

      <div className='flex-1 flex items-center justify-center min-h-0'>
        <ChartContainer
          config={chartConfig}
          className='aspect-square w-80 h-80'
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent nameKey='range' hideLabel hideValue />
              }
            />
            <Pie data={chartData} dataKey='count' nameKey='range' />
            <ChartLegend
              content={(props) => (
                <div className='!h-[70px]'>
                  <ChartLegendContent
                    payload={props.payload as any}
                    verticalAlign={props.verticalAlign}
                    nameKey='range'
                    className='flex flex-wrap gap-x-4 gap-y-2 px-4 pt-0'
                  />
                </div>
              )}
              className='-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center w-full'
            />
          </PieChart>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default RoundedChart;
