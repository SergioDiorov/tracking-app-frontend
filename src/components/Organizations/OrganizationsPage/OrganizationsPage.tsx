'use client';

// react
import React, { FC, useState } from 'react';

// types
import { IOrganizationType } from '@/interfaces/organization';
import OrganizationsHeader from './OrganizationHeader';
import OrganizationPanel from './OrganizationPanel';

interface IOrganizationPageProps {
  organization: IOrganizationType;
}

const OrganizationsPage: FC<IOrganizationPageProps> = ({ organization }) => {
  const [isEmployeesChanged, setEmployeesChanged] = useState<boolean>(false);
  return (
    <>
      <OrganizationsHeader
        organization={organization}
        setEmployeesChanged={() => setEmployeesChanged(true)}
      />
      <OrganizationPanel
        isEmployeesChanged={isEmployeesChanged}
        resetEmployeesChanged={() => setEmployeesChanged(false)}
      />
    </>
  );
};

export default OrganizationsPage;
