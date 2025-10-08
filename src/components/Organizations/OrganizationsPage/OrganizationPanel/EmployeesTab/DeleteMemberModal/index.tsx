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
import { IOrganizationMemberType } from '@/interfaces/organization';

const DeleteMemberModal = ({
  openDeleteMemberModal,
  setOpenDeleteMemberModal,
}: {
  openDeleteMemberModal: IOrganizationMemberType | null;
  setOpenDeleteMemberModal: (param: null) => void;
}) => {
  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  const queryClient = useQueryClient();

  // delete member
  const {
    mutate: deleteUserFromOrganization,
    isPending: isPerndingDeleteMember,
  } = useMutation({
    mutationFn: (userToDelete: string) =>
      organizationsApi.deleteUserFromOrganization({
        organizationId,
        userToDelete,
      }),
    mutationKey: ['deleteUserFromOrganization'],
    onSuccess: async (response) => {
      if (response) {
        await queryClient.invalidateQueries({
          queryKey: ['getOrganizationsMembers', organizationId],
        });
        await successToast('Member successfully deleted');
      }
    },
    onError: (error: { error: string }) => {
      errorToast(error.error ? error.error : 'Error while deleting member');
    },
    onSettled: () => setOpenDeleteMemberModal(null),
  });

  return (
    <Modal
      open={!!openDeleteMemberModal}
      onOpenChange={() => setOpenDeleteMemberModal(null)}
      title='Delete employer'
      dialogContentClassName='!overflow-visible'
      acceptButtonText='Delete'
      onAccept={() =>
        deleteUserFromOrganization(openDeleteMemberModal?.user || '')
      }
      isCloseOnAccept={false}
      isActionLoading={isPerndingDeleteMember}
    >
      <div className='pt-2 text-[14px] font-medium text-primary/70'>
        <div className='flex items-center'>
          <span className='mr-2 min-w-fit'>Member: </span>
          <img
            src={openDeleteMemberModal?.userProfile?.avatar || ''}
            alt='Avatar'
            className='size-6 mr-1'
          />
          <span className={'text-primary/90'}>
            {openDeleteMemberModal?.userProfile?.firstName +
              ' ' +
              openDeleteMemberModal?.userProfile?.lastName}
          </span>
        </div>
        <div className=''>
          Position:{' '}
          <span className='text-primary/90'>
            {openDeleteMemberModal?.position}
          </span>
        </div>

        <div>
          Role:{' '}
          <span className='text-primary/90'>{openDeleteMemberModal?.role}</span>
        </div>

        <div>
          Type:{' '}
          <span className='text-primary/90'>
            {openDeleteMemberModal?.type}
            {', $' + openDeleteMemberModal?.salary}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteMemberModal;
