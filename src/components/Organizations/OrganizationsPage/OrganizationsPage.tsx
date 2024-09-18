'use client';

// react
import React, { FC } from 'react';

// types
import { OrganizationType } from '@/interfaces/organization';
import OrganizationsHeader from './OrganizationHeader';
import OrganizationPanel from './OrganizationPanel';

interface IOrganizationPageProps {
  organization: OrganizationType;
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
