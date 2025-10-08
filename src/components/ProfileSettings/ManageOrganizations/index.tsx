// react
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// components
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Modal from '@/components/assets/Modal';
import { ArrowBigRightDash } from 'lucide-react';

// redux
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';
import { clearOrganizationData } from '@/redux/organization/organizationSlice';
import userSelectors from '@/redux/user/userSelectors';

// helpers
import { useIsUserOwnerOrAdmin } from '@/hooks/useOrganizationMemberOwnerOrAdmin';
import { OrganizationUserRoleEnum } from '@/interfaces/organization';
import { errorToast, successToast } from '@/helpers/toastActions';

// api
import { AxiosResponseHeaders } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';

const ManageOrganizations = () => {
  // redux
  const router = useRouter();
  const dispatch = useAppDispatch();

  // hooks
  const isUserOwnerOrAdmin = useIsUserOwnerOrAdmin();
  const organization = useAppSelector(
    organizationSelectors.getOrganizationData,
  );
  const userId = useAppSelector(userSelectors.getUserId);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);

  const {
    avatar,
    name,
    id: organizationId,
    industry,
    corporateEmail,
  } = organization;

  // delete member mutation
  const {
    mutate: deleteUserFromOrganization,
    isPending: isPerndingDeleteMember,
  } = useMutation({
    mutationFn: () =>
      organizationsApi.deleteUserFromOrganization({
        organizationId,
        userToDelete: userId,
      }),
    mutationKey: ['deleteUserFromOrganization'],
    onSuccess: async (response) => {
      if (response) {
        await successToast(`You successfully leaved ${name} compan`);
        dispatch(clearOrganizationData());
      }
    },
    onError: (error: AxiosResponseHeaders) => {
      errorToast(
        error.response.data.error
          ? error.response.data.error
          : 'Error while leaving company',
      );
    },
    onSettled: () => setOpenConfirmModal(false),
  });

  const handleRedirectToCompany = () => router.push('/organizations');

  return (
    <Card className='w-full h-fit p-4'>
      <div className='grid w-full items-center gap-4'>
        <div>
          <h6 className='text-base font-medium text-primary/90'>
            Manage your organization
          </h6>
          <p className='text-xs font-medium text-primary/70'>
            You can leave the organization you belong to.
          </p>
        </div>

        {organizationId ? (
          <div className='flex gap-4 w-full bg-[#f3f4f6] p-2.5 rounded-lg'>
            <Avatar
              className='hidden lg:block size-16 cursor-pointer'
              onClick={handleRedirectToCompany}
            >
              <AvatarImage src={avatar || ''} alt='Avatar' />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p
                className='text-sm xl:text-base font-semibold text-card-foreground/60 hover:text-card-foreground/80 cursor-pointer transition'
                onClick={handleRedirectToCompany}
              >
                {name}
              </p>
              <p className='text-xs font-semibold text-card-foreground/40'>
                {industry}, {corporateEmail}
              </p>
              <p className='text-xs font-semibold text-card-foreground/40'>
                Role:{' '}
                {isUserOwnerOrAdmin
                  ? OrganizationUserRoleEnum.ADMIN
                  : OrganizationUserRoleEnum.WORKER}
              </p>
            </div>

            <Button
              className='ml-auto self-center mr-2 h-[40px] md:h-[32px] flex items-center gap-1'
              variant={'destructive'}
              onClick={() => setOpenConfirmModal(true)}
            >
              Leave
              <ArrowBigRightDash className='font-normal size-5' />
            </Button>
          </div>
        ) : (
          <div className='py-4 w-full text-center'>
            <p className='text-sm font-semibold text-primary/70'>
              You’re not a participant of any organization
            </p>
          </div>
        )}
      </div>

      <Modal
        open={openConfirmModal}
        onOpenChange={setOpenConfirmModal}
        acceptButtonText='Leave'
        onAccept={deleteUserFromOrganization}
        isCloseOnAccept={false}
        dialogFooterClassName='w-full !justify-center'
        isActionLoading={isPerndingDeleteMember}
      >
        <p className='w-full text-center text-card-foreground/80 pt-2 pb-5 text-lg font-semibold leading-none tracking-tight'>
          Are you sure you want to leave the {name} company?
        </p>
      </Modal>
    </Card>
  );
};

export default ManageOrganizations;
