import React from 'react';
import RadialChart from '../../ChartsContainers/RadialChart';
import { OrganizationTaskPriorityEnum } from '@/interfaces/organization';
import { ChartConfig } from '@/components/ui/chart';

const Priority = ({
  tasksByPriorityData,
}: {
  tasksByPriorityData: { [key in OrganizationTaskPriorityEnum]: number };
}) => {
  const getPriorityColor = (priority: OrganizationTaskPriorityEnum) => {
    switch (priority) {
      case OrganizationTaskPriorityEnum.HIGH:
        return '#FF8A8C';
      case OrganizationTaskPriorityEnum.MEDIUM:
        return '#FFD65C';
      case OrganizationTaskPriorityEnum.LOW:
        return '#8ECD90';
      default:
        return '#D1D1D1';
    }
  };
  const priorityOrder = {
    HIGH: 1,
    MEDIUM: 2,
    LOW: 3,
  };

  const chartData = Object.entries(tasksByPriorityData)
    .map(([priority, count]) => ({
      priority,
      value: count,
      fill: getPriorityColor(priority as OrganizationTaskPriorityEnum),
    }))
    .sort((a, b) => {
      return (
        priorityOrder[b.priority as keyof typeof priorityOrder] -
        priorityOrder[a.priority as keyof typeof priorityOrder]
      );
    });

  const chartConfig = {
    value: {
      label: 'Tasks',
    },
    HIGH: {
      label: 'High Priority',
      color: '#FF8A8C',
    },
    MEDIUM: {
      label: 'Medium Priority',
      color: '#FFD65C',
    },
    LOW: {
      label: 'Low Priority',
      color: '#8ECD90',
    },
  } satisfies ChartConfig;

  return (
    <div className='w-full md:w-[calc(50%-8px)] min-w-[360px]'>
      <RadialChart
        title='Task Priority Distribution'
        chartData={chartData}
        chartConfig={chartConfig}
      />
    </div>
  );
};

export default Priority;
