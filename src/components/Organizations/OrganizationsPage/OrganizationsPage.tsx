'use client';

// react
import React, { FC } from 'react';

// types
import { IOrganizationType } from '@/interfaces/organization';
import OrganizationsHeader from './OrganizationHeader';
import OrganizationPanel from './OrganizationPanel';

interface IOrganizationPageProps {
  organization: IOrganizationType;
}

const OrganizationsPage: FC<IOrganizationPageProps> = ({ organization }) => {
  return (
    <>
      <OrganizationsHeader organization={organization} />
      <OrganizationPanel />
    </>
  );
};

export default OrganizationsPage;
