'use client';

// react
import React, { FC, useState } from 'react';

// types
import { IOrganizationType } from '@/interfaces/organization';

// components
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

//iocns
import { PlusIcon } from '@radix-ui/react-icons';

// helpers
import { formatDate } from '@/helpers/formatDate';
import Modal from '@/components/assets/Modal';
import AddOrganizationEmployerForm from '../../AddOrganizationEmployerForm/AddOrganizationEmployerForm';
import { useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';

interface IOrganizationsHeaderProps {
  organization: IOrganizationType;
  setEmployeesChanged: () => void;
}

const OrganizationsHeader: FC<IOrganizationsHeaderProps> = ({
  organization,
  setEmployeesChanged,
}) => {
  const [openAddEmployerModal, setOpenAddEmployerModal] =
    useState<boolean>(false);

  const userId = useAppSelector(userSelectors.getUserId);

  const {
    name,
    industry,
    registrationCountry,
    website,
    corporateEmail,
    avatar,
    description,
    createdAt,
    id,
  } = organization;
  return (
    <>
      <Card className='w-full p-4'>
        <div className='flex justify-start items-start gap-5'>
          {avatar ? (
            <img
              src={avatar}
              alt='Avatar'
              className={`w-[120px] h-[120px] rounded-full bg-secondary object-cover`}
            />
          ) : (
            <div
              className={`w-[120px] h-[120px] rounded-full bg-secondary flex justify-center items-center text-[18px] font-bold text-primary/50`}
            >
              {name.slice(0, 2)}
            </div>
          )}
          <div className='flex flex-col justify-between items-start gap-3'>
            <p className='text-[24px] font-semibold text-primary'>{name}</p>

            <div className='flex justify-start items-start gap-5'>
              <div>
                <p className='text-[14px] font-medium text-primary/70'>
                  industry:{' '}
                  <span className='text-base font-medium text-primary/90'>
                    {industry}
                  </span>
                </p>
                <p className='text-[14px] font-medium text-primary/70'>
                  location:{' '}
                  <span className='text-base font-medium text-primary/90'>
                    {registrationCountry}
                  </span>
                </p>
                <p className='text-[14px] font-medium text-primary/70'>
                  created:{' '}
                  <span className='text-base font-medium text-primary/90'>
                    {formatDate(createdAt)}
                  </span>
                </p>
              </div>
              <div className='border-l border-primary/5 pl-4'>
                <p className='text-[14px] font-medium text-primary/70'>
                  email:{' '}
                  <span className='text-base font-medium text-primary/90'>
                    {corporateEmail}
                  </span>
                </p>
                <p className='text-[14px] font-medium text-primary/70'>
                  website:{' '}
                  <a
                    href={website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-base font-medium text-primary/90 underline hover:text-primary/70 transition'
                  >
                    {name[0].toLowerCase() + name.slice(1).replaceAll(' ', '')}
                    .com
                  </a>
                </p>
              </div>
            </div>
          </div>
          {userId === organization.ownerId && (
            <div className='ml-auto'>
              <Button
                variant='outline'
                size='sm'
                className='text-primary/70'
                onClick={() => setOpenAddEmployerModal(true)}
              >
                <PlusIcon className='mr-2 h-4 w-4' />{' '}
                <span className=''>Add employer</span>
              </Button>
            </div>
          )}{' '}
        </div>
        {!!description && (
          <p className='text-[14px] font-medium text-primary/80 border-t border-primary/5 mt-4 pt-4 '>
            {description}
          </p>
        )}
      </Card>

      <Modal
        open={openAddEmployerModal}
        onOpenChange={setOpenAddEmployerModal}
        title='Add new employer'
        disableCancelButton
        disableAcceptButton
      >
        <AddOrganizationEmployerForm
          organizationId={id}
          closeModal={() => setOpenAddEmployerModal(false)}
          setEmployeesChanged={setEmployeesChanged}
        />
      </Modal>
    </>
  );
};

export default OrganizationsHeader;
