import React from 'react';
import {
  LabelList,
  RadialBar,
  RadialBarChart,
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

export const description = 'A radial chart with a label';

const RadialChart = ({
  title,
  description,
  footerDescription,
  chartData,
  chartConfig,
}: {
  title?: string;
  description?: string;
  footerDescription?: string;
  chartData: {
    priority: string;
    value: number;
    fill: string;
  }[];
  chartConfig: ChartConfig;
}) => {
  return (
    <Card className='flex flex-col bg-gray-100/40 h-[320px] pb-2'>
      <CardHeader className='items-center pb-4'>
        {!!title && (
          <CardTitle className='text-lg font-semibold text-card-foreground/70'>
            {title}
          </CardTitle>
        )}
        {!!description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className='flex-1 pb-0 m-auto h-full'>
        <ResponsiveContainer width='300px'>
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[250px]'
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={-270}
              innerRadius={30}
              outerRadius={110}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey='priority' />}
              />
              {/* <RadialBar minAngle={15} background clockWise dataKey='value' /> */}
              <RadialBar dataKey='value' background>
                <LabelList
                  position='insideStart'
                  dataKey='priority'
                  className='fill-white capitalize mix-blend-luminosity'
                  fontSize={11}
                />
              </RadialBar>
            </RadialBarChart>
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

export default RadialChart;
