import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/redux/hooks';

import { organizationsApi } from '@/api/organizations/organizationsApi';
import organizationSelectors from '@/redux/organization/organizationSelectors';

import { Loader } from '@/components/ui/loader';
import { AnalyticsChildTabsEnum, AnalyticsChildTabsType } from '../constants';
import SalaryChart from './MembersCharts/Salary';
import AgeChart from './MembersCharts/Age';
import ExperienceChart from './MembersCharts/Experience';
import MonthsLoggedTime from './TasksCharts/MonthsLoggedTime';
import Priority from './TasksCharts/Priority';
import WorkStatus from './TasksCharts/WorkStatus';

const Analytics = ({
  activeAnalyticsChildTab,
}: {
  activeAnalyticsChildTab: AnalyticsChildTabsType;
}) => {
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  // Fetch employers analytics data
  const {
    data: employersAnalyticsData,
    isLoading: employersAnalyticsLoading,
    isFetching: employersAnalyticsFetching,
  } = useQuery({
    queryKey: ['getOrganizationEmployersAnalytics', organizationId],
    queryFn: () =>
      organizationsApi.getOrganizationEmployersAnalytics(organizationId),
    select: (res) => res.data,
    enabled:
      !!organizationId &&
      activeAnalyticsChildTab === AnalyticsChildTabsEnum.MEMBERS,
  });

  // Fetch tasks analytics data
  const {
    data: tasksAnalyticsData,
    isLoading: tasksAnalyticsLoading,
    isFetching: tasksAnalyticsFetching,
  } = useQuery({
    queryKey: ['getOrganizationTasksAnalytics', organizationId],
    queryFn: () =>
      organizationsApi.getOrganizationTasksAnalytics(organizationId),
    select: (res) => res.data,
    enabled:
      !!organizationId &&
      activeAnalyticsChildTab === AnalyticsChildTabsEnum.TASKS,
  });

  // Determine if any API calls are loading
  const isLoadingApi =
    employersAnalyticsLoading ||
    employersAnalyticsFetching ||
    tasksAnalyticsLoading ||
    tasksAnalyticsFetching;

  // Extract relevant data from the API responses
  const salaryData = employersAnalyticsData?.data?.salary;
  const ageData = employersAnalyticsData?.data?.age;
  const experienceData = employersAnalyticsData?.data?.experience;
  const loggedTimeData = tasksAnalyticsData?.data?.loggedTime;
  const tasksByPriorityData = tasksAnalyticsData?.data?.tasksByPriority;
  const tasksByWorkStatusData = tasksAnalyticsData?.data?.tasksByWorkStatus;

  // Show loader if any API call is loading
  if (isLoadingApi) {
    return (
      <div className='w-full flex justify-center items-center h-[370px]'>
        <Loader className='p-2' />
      </div>
    );
  }

  return (
    <div>
      {activeAnalyticsChildTab === AnalyticsChildTabsEnum.MEMBERS ? (
        <div className='flex flex-wrap lg:flex-nowrap gap-4'>
          {!!salaryData && <SalaryChart salaryData={salaryData} />}
          {!!ageData && <AgeChart ageData={ageData} />}
          {!!experienceData && (
            <ExperienceChart experienceData={experienceData} />
          )}
        </div>
      ) : (
        <div className='flex flex-wrap gap-4'>
          <MonthsLoggedTime tasksAnalyticsData={loggedTimeData || []} />
          {!!tasksByPriorityData && (
            <Priority tasksByPriorityData={tasksByPriorityData} />
          )}
          {!!tasksByWorkStatusData && (
            <WorkStatus tasksByWorkStatusData={tasksByWorkStatusData} />
          )}
        </div>
      )}
    </div>
  );
};

export default Analytics;
