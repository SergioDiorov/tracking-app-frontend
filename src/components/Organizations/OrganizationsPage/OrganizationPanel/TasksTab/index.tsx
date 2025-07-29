import { organizationsApi } from '@/api/organizations/organizationsApi';
import { Loader } from '@/components/ui/loader';
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';
import { useQuery } from '@tanstack/react-query';
import React, { FC, useEffect, useState } from 'react';
import { DataTable } from '../EmployeesTab/table/DataTable';
import { columns } from './table/columns';
import { IOrganizationTaskType } from '@/interfaces/organization';
import {
  TaskOrderType,
  TaskSortByType,
} from '@/api/organizations/organizationsTypes';
import ExpandedTaskModal from './ExpandedTaskModal/ExpandedTaskModal';

interface ITasksTabProps {}

const TasksTab: FC<ITasksTabProps> = ({}) => {
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );
  const [organizationTasks, setOrganizationTasks] = useState<
    IOrganizationTaskType[]
  >([]);
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<TaskSortByType | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<TaskOrderType | undefined>(
    undefined,
  );
  const [rowDataSelected, setRowDataSelected] =
    useState<IOrganizationTaskType | null>(null);

  const {
    data: organizationTasksData,
    isLoading: organizationTasksIsLoading,
    isFetching: organizationTasksIsFetching,
    refetch: refetchOrganizationTasks,
  } = useQuery({
    queryKey: ['getOrganizationTasks', organizationId],
    queryFn: () =>
      organizationsApi.getOrganizationTasks({
        organizationId,
        page: paginationPage,
        limit: 10,
        sortBy,
        sortOrder,
      }),
    select: (res) => res.data,
    enabled: !!organizationId,
  });

  const handleSetPreviousPage = () => {
    setPaginationPage((prev) => (prev === 1 ? prev : --prev));
  };

  const handleRowClick = (rowData: IOrganizationTaskType) => {
    setRowDataSelected(rowData);
  };

  const handleSetNextPage = () => {
    setPaginationPage((prev) =>
      organizationTasksData &&
      organizationTasksData?.pagination.totalPages === prev
        ? prev
        : ++prev,
    );
  };

  useEffect(() => {
    organizationTasksData?.data?.tasks &&
      setOrganizationTasks(organizationTasksData.data?.tasks);
  }, [organizationTasksData]);

  useEffect(() => {
    refetchOrganizationTasks();
  }, [paginationPage]);

  useEffect(() => {
    if (sortBy && sortOrder) {
      refetchOrganizationTasks();
    }
  }, [sortBy, sortOrder]);

  if (organizationTasksIsLoading) {
    return (
      <div className='h-full flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {!!organizationTasksData && !!organizationTasksData.data.tasks.length ? (
        <div className='relative'>
          <div
            className={`absolute left-0 top-0 right-0 bottom-0 m-auto flex justify-center items-center transition ${
              organizationTasksIsFetching
                ? 'visible opacity-100'
                : 'hidden opacity-0'
            }`}
          >
            <Loader hideText />
          </div>
          <div
            className={`transition ${
              organizationTasksIsFetching
                ? 'blur-[3px] opacity-40 pointer-events-none rounded-md transition'
                : 'blur-[0px] opacity-100'
            }`}
          >
            <DataTable
              columns={columns({
                sortBy,
                sortOrder,
                setSortBy,
                setSortOrder,
              })}
              data={organizationTasks}
              currentPage={organizationTasksData.pagination.currentPage || 0}
              totalPages={organizationTasksData.pagination.totalPages || 0}
              isFetching={organizationTasksIsFetching}
              setNextPage={handleSetNextPage}
              setPreviousPage={handleSetPreviousPage}
              onRowClick={handleRowClick}
            />
          </div>
          {!!rowDataSelected && (
            <ExpandedTaskModal
              open={!!rowDataSelected}
              onOpenChange={() => setRowDataSelected(null)}
              taskData={rowDataSelected as IOrganizationTaskType}
            />
          )}
        </div>
      ) : (
        <div>The tasks haven&apos;t been created yet</div>
      )}
    </>
  );
};

export default TasksTab;
