// react
import React from 'react';

// api
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// redux
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';

// components
import Modal from '@/components/assets/Modal';

// helpers
import { errorToast, successToast } from '@/helpers/toastActions';
import { IOrganizationTaskType } from '@/interfaces/organization';

const DeleteTaskModal = ({
  openDeleteTaskModal,
  setOpenDeleteTaskModal,
}: {
  openDeleteTaskModal: IOrganizationTaskType | null;
  setOpenDeleteTaskModal: (param: null) => void;
}) => {
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  const queryClient = useQueryClient();

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

  return (
    <Modal
      open={!!openDeleteTaskModal}
      onOpenChange={() => setOpenDeleteTaskModal(null)}
      title='Delete task'
      dialogContentClassName='!overflow-visible'
      acceptButtonText='Delete'
      onAccept={() => deleteOrganizationTask(openDeleteTaskModal?.id || '')}
      isCloseOnAccept={false}
      isActionLoading={isPerndingDeleteTask}
    >
      <div className='pt-2 text-[14px] font-medium text-primary/70'>
        <div className=''>
          Title:{' '}
          <span className='text-primary/90'>{openDeleteTaskModal?.title}</span>
        </div>
        <div className='flex items-center'>
          <span className='mr-2'>Assigned member: </span>
          <img
            src={openDeleteTaskModal?.assignedMember.userProfile.avatar || ''}
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
  );
};

export default DeleteTaskModal;
