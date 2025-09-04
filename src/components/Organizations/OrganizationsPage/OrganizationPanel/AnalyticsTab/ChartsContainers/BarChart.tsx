import React from 'react';

import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A bar chart with a label';

const BarChart = ({
  title,
  description,
  footerDescription,
  chartData,
  chartConfig,
}: {
  title?: string;
  description?: string;
  footerDescription?: string;
  chartData: Record<string, any>[];
  chartConfig: ChartConfig;
}) => {
  return (
    <Card className='w-full bg-gray-100/40'>
      <CardHeader>
        {!!title && (
          <CardTitle className='text-lg font-semibold text-card-foreground/70'>
            {title}
          </CardTitle>
        )}
        {!!description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className='w-full'>
        <ResponsiveContainer width={'100%'} height='300px'>
          <ChartContainer config={chartConfig}>
            <ReBarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='month'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='hours' fill='var(--color-hours)' radius={8}>
                <LabelList
                  position='top'
                  offset={12}
                  className='fill-foreground'
                  fontSize={12}
                />
              </Bar>
            </ReBarChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>

      {!!footerDescription && (
        <CardFooter className='flex-col items-start gap-2 text-sm'>
          <div className='text-muted-foreground leading-none'>
            {footerDescription}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default BarChart;
