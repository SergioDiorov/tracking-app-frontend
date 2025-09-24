// react
import React, { Fragment, useEffect, useState } from 'react';

// redux
import { useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';
import organizationSelectors from '@/redux/organization/organizationSelectors';

// components
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { PriorityBadge } from '@/components/Organizations/OrganizationsPage/OrganizationPanel/constants';
import { Loader2Icon } from 'lucide-react';

// helpers
import { formatDate } from '@/helpers/formatDate';
import {
  IOrganizationTaskType,
  taskWorkStatus,
  TaskWorkStatusEnum,
  TaskWorkStatusType,
} from '@/interfaces/organization';

// api
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { useQuery } from '@tanstack/react-query';
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';

const TasksWidget = () => {
  const { isTaskLogAdded, setIsTaskLogAdded } = useMyProgressContext();

  // selectors
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );
  const { id } = useAppSelector(userSelectors.getUserData);

  // state
  const [userTasks, setUserTasks] = useState<IOrganizationTaskType[]>([]);
  const [taskStatusTab, setTaskStatusTab] = useState<TaskWorkStatusType>(
    TaskWorkStatusEnum.TODO,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tasksLimit, setTasksLimit] = useState<number>(10);

  // fetch tasks
  const {
    data: organizationTasksData,
    isSuccess: organizationTasksIsSuccess,
    refetch: refetchOrganizationTasks,
    isFetching: organizationTasksIsFetching,
    isPending: organizationTasksIsPending,
  } = useQuery({
    queryKey: ['getOrganizationTasks', organizationId],
    queryFn: () =>
      organizationsApi.getOrganizationTasks({
        organizationId,
        page: currentPage,
        limit: tasksLimit || 10,
        userId: id,
        filterByWorkStatus: taskStatusTab,
      }),
    select: (res) => res.data,
    enabled: !!organizationId,
  });

  // handler for changing task tab
  const handleChangeTab = (taskStatusTab: string) => {
    setCurrentPage(1);
    setTasksLimit(10);
    setUserTasks([]);
    setTaskStatusTab(taskStatusTab as TaskWorkStatusType);
  };

  const handleRefetchLogs = () => {
    if (organizationTasksData) {
      if (organizationTasksData.pagination.pageSize === 10) {
        setCurrentPage(organizationTasksData.pagination.currentPage + 1);
      } else {
        const totalLoaded = organizationTasksData.data.tasks.length;
        const calculatedPage = Math.ceil(totalLoaded / 10);

        setCurrentPage(calculatedPage + 1);
      }
      setTasksLimit(10);
    }
  };

  // save tasks paginated data
  useEffect(() => {
    if (organizationTasksData && organizationTasksIsSuccess) {
      if (organizationTasksData.pagination.currentPage === 1) {
        setUserTasks(organizationTasksData.data.tasks);
      } else {
        setUserTasks((prevTasks) => [
          ...prevTasks,
          ...organizationTasksData.data.tasks,
        ]);
      }

      // Reset isTaskLogAdded to false after fetching new tasks
      setIsTaskLogAdded(false);
    }
  }, [organizationTasksData, organizationTasksIsSuccess]);

  useEffect(() => {
    if (isTaskLogAdded) {
      const calculatedLimit = Math.ceil(userTasks.length / 10) * 10;

      setCurrentPage(1);
      if (calculatedLimit === tasksLimit) {
        refetchOrganizationTasks();
      } else {
        setTasksLimit(calculatedLimit);
      }
    }
  }, [isTaskLogAdded, userTasks, tasksLimit]);

  // refetch tasks on tab or page change
  useEffect(() => {
    if (taskStatusTab && currentPage) {
      refetchOrganizationTasks();
    }
  }, [taskStatusTab, currentPage]);

  return (
    <div className='w-full sm:w-[calc(100%-300px)] md:w-[calc(100%-350px)]'>
      <Tabs
        defaultValue='account'
        className='w-full overflow-auto rounded-md bg-muted'
        value={taskStatusTab}
        onValueChange={handleChangeTab}
      >
        <TabsList className='w-full sm:w-fit md:w-full justify-start px-2 py-[23px]'>
          {taskWorkStatus.map((item) => (
            <TabsTrigger
              key={item}
              value={item}
              className='font-medium text-card-foreground/70'
            >
              {item}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className='w-full h-[275px] sm:h-[calc(100%-70px)] md:h-[calc(100%-54px)] max-h-[275px] overflow-auto scrollbar-medim bg-[#f3f4f6] rounded-md mt-2 px-2.5 pb-2.5'>
        {organizationTasksIsFetching && currentPage === 1 && (
          <div className='h-full flex items-center justify-center'>
            <Loader className='h-fit' />
          </div>
        )}
        {userTasks?.length === 0 &&
          !organizationTasksIsFetching &&
          !organizationTasksIsPending &&
          organizationTasksIsSuccess && (
            <div className='h-full flex items-center justify-center'>
              <p className='w-full text-center text-sm font-semibold text-card-foreground/70'>
                No tasks found in this tab
              </p>
            </div>
          )}
        {!!userTasks?.length && (
          <div>
            {userTasks.map((item, index) => (
              <Fragment key={item.id}>
                <div className='py-4'>
                  <div className='flex justify-between items-center mb-1'>
                    <p className='tracking-tight text-sm font-semibold text-card-foreground/70'>
                      {item.title}
                    </p>
                    <PriorityBadge value={item.priority} />
                  </div>
                  <div className='flex justify-between items-center mb-1 font-medium text-card-foreground/60 text-sm'>
                    <p>Deadline:</p>
                    <p>{formatDate(item.deadline)}</p>
                  </div>
                </div>
                {index < userTasks.length - 1 && <Separator />}
              </Fragment>
            ))}
            {organizationTasksData &&
              organizationTasksData?.pagination.totalItems >
                userTasks?.length && (
                <Button
                  variant='secondary'
                  className='mt-4 w-full'
                  onClick={handleRefetchLogs}
                  disabled={organizationTasksIsFetching}
                >
                  Load more
                  {organizationTasksIsFetching && (
                    <Loader2Icon className='ml-2 h-4 w-4 animate-spin' />
                  )}
                </Button>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksWidget;
