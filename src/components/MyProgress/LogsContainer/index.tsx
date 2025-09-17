'use client';

import React, { useEffect, useState } from 'react';

// redux
import { useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';

// api
import { useQuery } from '@tanstack/react-query';
import { tasksLogsApi } from '@/api/tasksLogs/tasksLogsApi';

// components
import { Card } from '@/components/ui/card';
import { ExtendedLogDataType } from '@/api/tasksLogs/tasksLogsTypes';
import { Loader } from '@/components/ui/loader';
import { Button } from '@/components/ui/button';
import LogItem from './LogItem';
import { Loader2Icon } from 'lucide-react';

// helpers
import { format } from 'date-fns';
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';

const LogsContainer = ({}: {}) => {
  // selectors
  const userId = useAppSelector(userSelectors.getUserId);

  // context
  const { isTaskLogAdded, setIsTaskLogAdded } = useMyProgressContext();

  // state
  const [tasksLogs, setTasksLogs] = useState<ExtendedLogDataType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // fetch logs
  const {
    data: tasksLogData,
    isSuccess: tasksLogSuccess,
    isLoading: tasksLogIsLoading,
    isFetching: tasksLogIsFetching,
    refetch: tasksLogRefetch,
  } = useQuery({
    queryKey: ['getTasksLog', userId, `currentPage:${currentPage}`],
    queryFn: () =>
      tasksLogsApi.getTasksLog({
        page: currentPage,
        limit: 10,
        userId: userId,
      }),
    select: (res) => res.data,
    enabled: !!userId && !!currentPage,
  });

  // Group logs by date
  const handleGroupLogsByDate = (logs: ExtendedLogDataType[]) => {
    return logs.reduce(
      (
        acc: { [x: string]: Partial<ExtendedLogDataType>[] },
        log: { date: string } | any,
      ) => {
        if (!acc[log.dateFormat]) {
          acc[log.dateFormat] = [];
        }
        acc[log.dateFormat].push(log);
        return acc;
      },
      {},
    );
  };

  useEffect(() => {
    if (tasksLogData && tasksLogSuccess && tasksLogData.data.logs.length) {
      const formatDateLogs = tasksLogData.data.logs.map((log) => {
        const dateFormat = format(new Date(log.date), 'MMM dd');

        return { ...log, dateFormat };
      });

      setTasksLogs(
        tasksLogData.pagination.currentPage === 1
          ? formatDateLogs
          : (prev) => [...prev, ...formatDateLogs],
      );

      // Reset isTaskLogAdded to false after fetching new logs
      setIsTaskLogAdded(false);
    }
  }, [tasksLogData, tasksLogSuccess]);

  useEffect(() => {
    tasksLogRefetch();
  }, [isTaskLogAdded]);

  // Group logs by date
  const groupedLogs = handleGroupLogsByDate(tasksLogs);

  // Check if all data is loaded
  const isAllDataLoaded =
    (tasksLogData?.pagination.totalItems || 0) <= tasksLogs.length &&
    !tasksLogIsFetching &&
    !tasksLogIsLoading;

  return (
    <Card className='p-4 space-y-4 md:max-h-[calc(100vh-355px)] overflow-auto'>
      {tasksLogIsLoading && !tasksLogs.length ? (
        <div className='py-7'>
          <Loader />
        </div>
      ) : tasksLogs.length ? (
        <>
          {Object.entries(groupedLogs).map(([date, logs]) => (
            <div key={date} className='space-y-4'>
              <div className='flex items-center'>
                <div className='flex-grow h-px bg-muted-foreground/20' />
                <span className='px-3 text-muted-foreground text-sm font-semibold'>
                  {date}
                </span>
                <div className='flex-grow h-px bg-muted-foreground/20' />
              </div>

              {logs.map((log) => (
                <LogItem key={log.id} log={log as ExtendedLogDataType} />
              ))}
            </div>
          ))}
          {isAllDataLoaded ? (
            <div className='w-full flex items-center justify-center py-4'>
              <p className='text-sm font-semibold text-card-foreground/70'>
                All data loaded
              </p>
            </div>
          ) : (
            <Button
              className='mx-auto w-full mt-2 text-primary/70 font-semibold'
              variant='secondary'
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    (tasksLogData
                      ? tasksLogData.pagination.currentPage
                      : prev) + 1,
                )
              }
            >
              Load more
              {tasksLogIsFetching && (
                <Loader2Icon className='ml-2 h-4 w-4 animate-spin' />
              )}
            </Button>
          )}
        </>
      ) : (
        <div className='h-[143px] flex items-center justify-center'>
          <p className='text-sm font-semibold text-card-foreground/70'>
            No logs found
          </p>
        </div>
      )}
    </Card>
  );
};

export default LogsContainer;
