import React from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RadarChartRecharts,
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

const RadarChart = ({
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
    status: string;
    value: number;
    fill: string;
  }[];
  chartConfig: ChartConfig;
}) => {
  return (
    <Card className='bg-gray-100/40 h-[320px]'>
      <CardHeader className='items-center pb-4'>
        {!!title && (
          <CardTitle className='text-lg font-semibold text-card-foreground/70'>
            {title}
          </CardTitle>
        )}
        {!!description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className='pb-0 w-full'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px] w-full'
        >
          <RadarChartRecharts data={chartData}>
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel nameKey='status' />}
            />
            <PolarGrid gridType='circle' radialLines={false} />
            <PolarAngleAxis dataKey='status' />
            <Radar
              dataKey='value'
              fill='#8ec5ff'
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChartRecharts>
        </ChartContainer>
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

export default RadarChart;
