// react
import React, { FC, useEffect, useState } from 'react';

// redux
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';

// api
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// components
import { Loader } from '@/components/ui/loader';
import Modal from '@/components/assets/Modal';
import AddNewTaskForm from '@/components/Organizations/AddNewTaskForm/AddNewTaskForm';
import ExpandedTaskModal from './ExpandedTaskModal/ExpandedTaskModal';
import { DataTable } from '../EmployeesTab/table/DataTable';
import { columns } from './table/columns';

// helpers
import { errorToast, successToast } from '@/helpers/toastActions';
import { IOrganizationTaskType } from '@/interfaces/organization';
import {
  TaskOrderType,
  TaskSortByType,
} from '@/api/organizations/organizationsTypes';

interface ITasksTabProps {}

const TasksTab: FC<ITasksTabProps> = ({}) => {
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  const queryClient = useQueryClient();

  // state
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
  const [openEditTaskModal, setOpenEditTaskModal] =
    useState<IOrganizationTaskType | null>(null);
  const [openDeleteTaskModal, setOpenDeleteTaskModal] =
    useState<IOrganizationTaskType | null>(null);

  // get tasks data
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

  // delete task
  const { mutate: deleteOrganizationTask, isPending: isPerndingDeleteTask } =
    useMutation({
      mutationFn: (taskId: string) =>
        organizationsApi.deleteOrganizationTask({ organizationId, taskId }),
      mutationKey: ['deleteOrganizationTask'],
      onSuccess: async (response) => {
        if (response) {
          await queryClient.invalidateQueries({
            queryKey: ['getOrganizationTasks', organizationId],
          });
          await successToast('Task successfully deleted');
        }
      },
      onError: (error: { error: string }) => {
        errorToast(error.error ? error.error : 'Error while deleting task');
      },
      onSettled: () => setOpenDeleteTaskModal(null),
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
                setOpenEditTaskModal,
                setOpenDeleteTaskModal,
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

          <Modal
            open={!!openEditTaskModal}
            onOpenChange={() => setOpenEditTaskModal(null)}
            title='Edit task'
            disableCancelButton
            disableAcceptButton
            dialogContentClassName='!overflow-visible'
          >
            <AddNewTaskForm
              organizationId={openEditTaskModal?.organizationId as string}
              closeModal={() => setOpenEditTaskModal(null)}
              isEditMode
              taskData={openEditTaskModal as IOrganizationTaskType}
            />
          </Modal>

          <Modal
            open={!!openDeleteTaskModal}
            onOpenChange={() => setOpenDeleteTaskModal(null)}
            title='Delete task'
            dialogContentClassName='!overflow-visible'
            acceptButtonText='Delete'
            onAccept={() =>
              deleteOrganizationTask(openDeleteTaskModal?.id || '')
            }
            isCloseOnAccept={false}
            isActionLoading={isPerndingDeleteTask}
          >
            <div className='pt-2 text-[14px] font-medium text-primary/70'>
              <div className=''>
                Title:{' '}
                <span className='text-primary/90'>
                  {openDeleteTaskModal?.title}
                </span>
              </div>
              <div className='flex items-center'>
                <span className='mr-2'>Assigned member: </span>
                <img
                  src={
                    openDeleteTaskModal?.assignedMember.userProfile.avatar || ''
                  }
                  alt='Avatar'
                  className='size-6 mr-1'
                />
                <span className='text-primary/90'>
                  {openDeleteTaskModal?.assignedMember.userProfile.firstName +
                    ' ' +
                    openDeleteTaskModal?.assignedMember.userProfile.lastName}
                </span>
              </div>
              {!!openDeleteTaskModal?.workStatus && (
                <div>
                  Work status:{' '}
                  <span className='text-primary/90'>
                    {openDeleteTaskModal?.workStatus}
                  </span>
                </div>
              )}
            </div>
          </Modal>
        </div>
      ) : (
        <div>The tasks haven&apos;t been created yet</div>
      )}
    </>
  );
};

export default TasksTab;
