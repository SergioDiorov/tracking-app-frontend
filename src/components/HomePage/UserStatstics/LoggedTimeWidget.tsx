'use client';

// react
import React, { useEffect, useMemo } from 'react';

// components
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Loader } from '@/components/ui/loader';
import { Label, Pie, PieChart } from 'recharts';

// api
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { useQuery } from '@tanstack/react-query';

// redux
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';
import userSelectors from '@/redux/user/userSelectors';

const chartConfig = {
  logged: {
    label: 'Logged',
    color: '#7c97d1',
  },
  remaining: {
    label: 'Remaining',
    color: '#E5E7EB',
  },
} satisfies ChartConfig;

const LoggedTimeWidget = () => {
  //context
  const { isTaskLogAdded, setIsTaskLogAdded } = useMyProgressContext();

  // selectors
  const userId = useAppSelector(userSelectors.getUserId);
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );
  const organizationMemberData = useAppSelector(
    organizationSelectors.getOrganizationMemberData,
  );
  const userWorkHours = organizationMemberData?.workHours || 0;

  // Fetch tasks analytics data
  const {
    data: tasksAnalyticsData,
    isLoading: tasksAnalyticsLoading,
    refetch: tasksAnalyticsRefetch,
  } = useQuery({
    queryKey: ['getOrganizationTasksAnalytics', organizationId],
    queryFn: () =>
      organizationsApi.getOrganizationTasksAnalytics({
        organizationId,
        userToSearch: userId,
      }),
    select: (res) => res.data,
    enabled: !!organizationId,
  });

  const loggedTimeData = tasksAnalyticsData?.data?.loggedTime;

  // collect data for current month
  const chartData = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthData = loggedTimeData?.find(
      (item: { month: string }) => item.month === currentMonth,
    );

    const loggedHours = currentMonthData?.hours || 0;
    const remainingHours = Math.max(userWorkHours - loggedHours, 0);

    return [
      { name: 'logged', value: loggedHours, fill: '#7c97d1' },
      { name: 'remaining', value: remainingHours, fill: '#E5E7EB' },
    ];
  }, [loggedTimeData]);

  useEffect(() => {
    if (isTaskLogAdded) {
      tasksAnalyticsRefetch();
      setIsTaskLogAdded(false);
    }
  }, [isTaskLogAdded]);

  return (
    <div className='flex flex-col items-center'>
      <div className=' relative h-[45px] flex items-center justify-center -mb-4'>
        <h6 className='tracking-tight text-xl font-semibold text-card-foreground/70'>
          Logged Hours
        </h6>
        <span className='absolute text-[11px] -bottom-2 font-semibold text-card-foreground/60'>
          (per month)
        </span>
      </div>

      <ChartContainer
        config={chartConfig}
        className='mx-auto aspect-square max-h-[250px] w-full sm:w-[300px] md:max-h-[300px] md:w-[350px]'
      >
        {tasksAnalyticsLoading && !tasksAnalyticsData ? (
          <Loader className='h-fit' />
        ) : (
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              innerRadius={60}
              strokeWidth={5}
              startAngle={90}
              endAngle={-270}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    const logged = chartData[0]?.value || 0;

                    return (
                      <text
                        textAnchor='middle'
                        className='w-full flex text-xl font-semibold'
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 6}
                      >
                        <tspan>{logged}</tspan>
                        <tspan> of </tspan>
                        <tspan>{userWorkHours}</tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        )}
      </ChartContainer>
    </div>
  );
};

export default LoggedTimeWidget;
