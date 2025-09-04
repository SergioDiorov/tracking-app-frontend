import React from 'react';
import RadarChart from '../../ChartsContainers/RadarChart';
import { taskWorkStatus, TaskWorkStatusEnum } from '@/interfaces/organization';
import { ChartConfig } from '@/components/ui/chart';
import { handleFormatWorkStatus } from '../../../constants';

const WorkStatus = ({
  tasksByWorkStatusData,
}: {
  tasksByWorkStatusData: { [key in TaskWorkStatusEnum]: number };
}) => {
  const chartData = Object.entries(tasksByWorkStatusData).map(
    ([status, count]) => ({
      status: handleFormatWorkStatus(status as TaskWorkStatusEnum),
      value: count,
      fill: '#00b6ff',
    }),
  );

  const chartConfig = taskWorkStatus.reduce(
    (config, status) => {
      config[handleFormatWorkStatus(status)] = {
        label: handleFormatWorkStatus(status),
        color: '#00b6ff',
      };
      return config;
    },
    {
      value: {
        label: 'Status',
      },
    } as ChartConfig,
  );

  return (
    <div className='w-full md:w-[calc(50%-8px)] min-w-[360px]'>
      <RadarChart
        title='Work Status'
        chartData={chartData}
        chartConfig={chartConfig}
      />
    </div>
  );
};

export default WorkStatus;
