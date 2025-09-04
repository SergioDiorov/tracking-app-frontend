'use client';

// react
import React, { FC, useState } from 'react';

// types
import { IOrganizationType } from '@/interfaces/organization';

// components
import { Card } from '@/components/ui/card';

// helpers
import { formatDate } from '@/helpers/formatDate';
import { useIsUserOwnerOrAdmin } from '@/hooks/useOrganizationMemberOwnerOrAdmin';
import OrganizationHeaderMenu from './OrganizationHeaderMenu';

interface IOrganizationsHeaderProps {
  organization: IOrganizationType;
}

const OrganizationsHeader: FC<IOrganizationsHeaderProps> = ({
  organization,
}) => {
  const isUserOwnerOrAdmin = useIsUserOwnerOrAdmin();

  const [openAvatarModal, setOpenAvatarModal] = useState<boolean>(false);

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
        <div className='flex items-start justify-start gap-5'>
          {avatar ? (
            <div>
              <img
                src={avatar}
                alt='Avatar'
                className={`w-[100px] h-[100px] min-w-[100px] min-h-[100px] rounded-full bg-secondary object-cover md:w-[120px] md:h-[120px] md:min-w-[120px] md:min-h-[120px] cursor-pointer m-auto`}
                onClick={() => setOpenAvatarModal(true)}
              />
            </div>
          ) : (
            <div
              className={`w-[100px] h-[100px] min-w-[100px] min-h-[100px] rounded-full bg-secondary flex justify-center items-center text-[18px] font-bold text-primary/50 md:w-[120px] md:h-[120px] md:min-w-[120px] md:min-h-[120px]`}
            >
              {name.slice(0, 2)}
            </div>
          )}
          <div className='flex flex-col justify-between items-start gap-3'>
            <p className='text-[24px] font-semibold text-primary'>{name}</p>

            <div className='flex justify-start items-start flex-col md:flex-row  md:gap-5'>
              <div className='md:border-r border-primary/5 md:pr-4'>
                <p className='text-[14px] font-medium text-primary/70'>
                  industry:{' '}
                  <span className='text-[14px] font-medium text-primary/90'>
                    {industry}
                  </span>
                </p>
                <p className='text-[14px] font-medium text-primary/70'>
                  location:{' '}
                  <span className='text-[14px] font-medium text-primary/90'>
                    {registrationCountry}
                  </span>
                </p>
                <p className='text-[14px] font-medium text-primary/70'>
                  created:{' '}
                  <span className='text-[14px] font-medium text-primary/90'>
                    {formatDate(createdAt)}
                  </span>
                </p>
              </div>
              <div>
                <p className='text-[14px] font-medium text-primary/70'>
                  email:{' '}
                  <span className='text-[14px] font-medium text-primary/90'>
                    {corporateEmail}
                  </span>
                </p>
                <p className='text-[14px] font-medium text-primary/70'>
                  website:{' '}
                  <a
                    href={website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-[14px] font-medium text-primary/90 underline hover:text-primary/70 transition'
                  >
                    {name[0].toLowerCase() + name.slice(1).replaceAll(' ', '')}
                    .com
                  </a>
                </p>
              </div>
            </div>
          </div>
          {isUserOwnerOrAdmin && (
            <div className='ml-auto'>
              <OrganizationHeaderMenu organizationId={id} />
            </div>
          )}
        </div>
        {!!description && (
          <p className='text-[14px] font-medium text-primary/80 border-t border-primary/5 mt-4 pt-4 '>
            {description}
          </p>
        )}
      </Card>

      {avatar && (
        <div
          className={`fixed inset-0 items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm z-[45] transition-opacity duration-300 ease-in-out hidden ${
            openAvatarModal
              ? '!flex transition-opacity duration-300 ease-in-out'
              : ''
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpenAvatarModal(false);
            }
          }}
        >
          <div className='relative'>
            <img
              src={avatar || ''}
              alt='Avatar'
              className='w-[400px] h-[400px] max-[440px]:w-[250px] max-[440px]:h-[250px] rounded-full object-cover'
            />
            <button
              className='absolute top-2 right-2 text-secondary bg-primary hover:bg-primary/70 rounded-full w-[26px] h-[26px] transition'
              onClick={() => setOpenAvatarModal(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationsHeader;
