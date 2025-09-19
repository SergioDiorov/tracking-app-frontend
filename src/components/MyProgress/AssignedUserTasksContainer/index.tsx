import React, { useEffect, useState } from 'react';

// redux
import { useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';
import organizationSelectors from '@/redux/organization/organizationSelectors';

// api
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { useQuery } from '@tanstack/react-query';
import { IOrganizationTaskType } from '@/interfaces/organization';

// components
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import AssignedUserTaskItem from './AssignedUserTaskItem';
import { Loader2Icon } from 'lucide-react';

// helpers
import { HorizontalInfinityScrollWrapper } from '@/helpers/HorizontalInfinityScrollWrapper';

// context
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';

const AssignedUserTasks = () => {
  // context
  const { isTaskLogAdded, setIsTaskLogAdded } = useMyProgressContext();

  // selectors
  const userId = useAppSelector(userSelectors.getUserId);
  const { firstName } = useAppSelector(userSelectors.getUserData);
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  // state
  const [organizationMemberTasks, setOrganizationMemberTasks] = useState<
    IOrganizationTaskType[]
  >([]);
  const [organizationMemberTasksPage, setOrganizationMemberTasksPage] =
    useState<number>(1);
  const [tasksLimit, setTasksLimit] = useState<number>(10);

  // fetch tasks
  const {
    data: organizationTasksData,
    isSuccess: organizationTasksIsSuccess,
    isLoading: organizationTasksIsLoading,
    isFetching: organizationTasksIsFetching,
    refetch: organizationTasksRefetch,
  } = useQuery({
    queryKey: ['getOrganizationMemberTasks', organizationId, userId],
    queryFn: () =>
      organizationsApi.getOrganizationTasks({
        organizationId: organizationId,
        page: organizationMemberTasksPage,
        limit: tasksLimit || 10,
        userId: userId,
      }),
    select: (res) => res.data,
    enabled: !!organizationId && !!userId && !!organizationMemberTasksPage,
  });

  const handleLoadMoreTasks = () => {
    if (organizationTasksData) {
      if (organizationTasksData.pagination.pageSize === 10) {
        setOrganizationMemberTasksPage(
          organizationTasksData.pagination.currentPage + 1,
        );
      } else {
        const totalLoaded = organizationTasksData.data.tasks.length;
        const calculatedPage = Math.ceil(totalLoaded / 10);

        setOrganizationMemberTasksPage(calculatedPage + 1);
      }
      setTasksLimit(10);
    }
  };

  useEffect(() => {
    if (organizationTasksData && organizationTasksIsSuccess) {
      if (organizationTasksData.pagination.currentPage === 1) {
        setOrganizationMemberTasks(organizationTasksData.data.tasks);
      } else {
        setOrganizationMemberTasks((prev) => [
          ...prev,
          ...organizationTasksData.data.tasks,
        ]);
      }

      // Reset isTaskLogAdded to false after fetching new logs
      setIsTaskLogAdded(false);
    }
  }, [organizationTasksData, organizationTasksIsSuccess]);

  useEffect(() => {
    if (isTaskLogAdded) {
      const calculatedLimit =
        Math.ceil(organizationMemberTasks.length / 10) * 10;

      setOrganizationMemberTasksPage(1);
      if (calculatedLimit === tasksLimit) {
        organizationTasksRefetch();
      } else {
        setTasksLimit(calculatedLimit);
      }
    }
  }, [isTaskLogAdded, organizationMemberTasks, tasksLimit]);

  useEffect(() => {
    organizationTasksRefetch();
  }, [organizationMemberTasksPage, tasksLimit]);

  return (
    <Card
      className={`md:h-[140px] w-full p-4 ${
        !organizationMemberTasks.length && 'flex items-center justify-center'
      }`}
    >
      {organizationTasksIsLoading && !organizationMemberTasks.length ? (
        <div>
          <Loader />
        </div>
      ) : !!organizationMemberTasks.length ? (
        <>
          <h3 className='text-sm font-semibold text-muted-foreground mb-2'>
            All {firstName ? firstName + `'s` : `user's`} assigned tasks
          </h3>

          {/* Horizontal scroll wrapper to load more tasks */}
          <HorizontalInfinityScrollWrapper
            nextPage={organizationTasksData?.pagination.pageSize || 1}
            onLoad={handleLoadMoreTasks}
            additionConditions={
              (organizationTasksData?.pagination?.totalItems || 0) >
                organizationMemberTasks.length &&
              !organizationTasksIsLoading &&
              !organizationTasksIsFetching
            }
            containerClassName='flex gap-2 overflow-auto scrollbar-thin pb-[3px] md:pr-0.5'
          >
            {organizationMemberTasks.map((task) => (
              <AssignedUserTaskItem task={task} key={task.id} />
            ))}
            {organizationTasksIsFetching && (
              <div className='flex items-center'>
                <Loader2Icon className='size-7 animate-spin text-[#c3c3c3]' />
              </div>
            )}
          </HorizontalInfinityScrollWrapper>
        </>
      ) : (
        <div className='flex items-center justify-center'>
          <p className='text-sm font-semibold text-card-foreground/70'>
            No tasks found
          </p>
        </div>
      )}
    </Card>
  );
};

export default AssignedUserTasks;
