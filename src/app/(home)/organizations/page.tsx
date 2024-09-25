'use client';

// react
import React, { useState } from 'react';

// components
import Modal from '@/components/assets/Modal';
import { Button } from '@/components/ui/button';
import CreateOrganizationForm from '@/components/Organizations/CreateOrganizationForm/CreateOrganizationForm';
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';
import OrganizationsPage from '@/components/Organizations/OrganizationsPage/OrganizationsPage';

const Organizations = () => {
  const organizationData = useAppSelector(
    organizationSelectors.getOrganizationData,
  );

  const [isCreateOrganizationModalOpen, setIsCreateOrganizationModalOpen] =
    useState(false);

  return (
    <>
      {!!organizationData?.id ? (
        <OrganizationsPage organization={organizationData} />
      ) : (
        <div className='flex flex-col justify-center items-center gap-5 mt-10'>
          <p className='text-xl font-semibold'>
            You’re not a participant of any organization
          </p>
          <Button
            onClick={() => setIsCreateOrganizationModalOpen(true)}
            className='w-fit'
          >
            Create organization
          </Button>
          <Modal
            open={isCreateOrganizationModalOpen}
            onOpenChange={setIsCreateOrganizationModalOpen}
            title='Create organization'
            disableCancelButton
            disableAcceptButton
          >
            <CreateOrganizationForm
              closeModal={() => setIsCreateOrganizationModalOpen(false)}
            />
          </Modal>
        </div>
      )}
    </>
  );
};

export default Organizations;
