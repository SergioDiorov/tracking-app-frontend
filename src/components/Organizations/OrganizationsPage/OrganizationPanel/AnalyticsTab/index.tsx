// react
import React, { useState } from 'react';

// redux
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';

// api
import { useQuery } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';

// components
import { Loader } from '@/components/ui/loader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SalaryChart from './MembersCharts/Salary';
import AgeChart from './MembersCharts/Age';
import ExperienceChart from './MembersCharts/Experience';
import MonthsLoggedTime from './TasksCharts/MonthsLoggedTime';
import Priority from './TasksCharts/Priority';
import WorkStatus from './TasksCharts/WorkStatus';

// helpers
import {
  AnalyticsChildTabsEnum,
  analyticsChildTabsItems,
  AnalyticsChildTabsType,
} from '../constants';

const Analytics = () => {
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  const [activeTab, setActiveTab] = useState<AnalyticsChildTabsType>(
    AnalyticsChildTabsEnum.MEMBERS,
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
    enabled: !!organizationId && activeTab === AnalyticsChildTabsEnum.MEMBERS,
  });

  // Fetch tasks analytics data
  const {
    data: tasksAnalyticsData,
    isLoading: tasksAnalyticsLoading,
    isFetching: tasksAnalyticsFetching,
  } = useQuery({
    queryKey: ['getOrganizationTasksAnalytics', organizationId],
    queryFn: () =>
      organizationsApi.getOrganizationTasksAnalytics({ organizationId }),
    select: (res) => res.data,
    enabled: !!organizationId && activeTab === AnalyticsChildTabsEnum.TASKS,
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

  return (
    <Tabs
      defaultValue={AnalyticsChildTabsEnum.MEMBERS}
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as AnalyticsChildTabsType)}
    >
      <TabsList className='!w-full flex`'>
        {analyticsChildTabsItems.map((item) => (
          <TabsTrigger
            key={item}
            value={item}
            className='font-medium text-card-foreground/70 flex w-full'
          >
            {item}
          </TabsTrigger>
        ))}
      </TabsList>

      {isLoadingApi ? (
        <div className='w-full flex justify-center items-center h-[370px]'>
          <Loader className='p-2' />
        </div>
      ) : (
        <>
          <TabsContent value={AnalyticsChildTabsEnum.MEMBERS}>
            <div className='flex flex-wrap lg:flex-nowrap gap-4'>
              {!!salaryData && <SalaryChart salaryData={salaryData} />}
              {!!ageData && <AgeChart ageData={ageData} />}
              {!!experienceData && (
                <ExperienceChart experienceData={experienceData} />
              )}
            </div>
          </TabsContent>
          <TabsContent value={AnalyticsChildTabsEnum.TASKS}>
            <div className='flex flex-wrap gap-4'>
              <MonthsLoggedTime tasksAnalyticsData={loggedTimeData || []} />
              {!!tasksByPriorityData && (
                <Priority tasksByPriorityData={tasksByPriorityData} />
              )}
              {!!tasksByWorkStatusData && (
                <WorkStatus tasksByWorkStatusData={tasksByWorkStatusData} />
              )}
            </div>
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default Analytics;
