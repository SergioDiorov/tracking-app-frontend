'use client';

// react
import React, { useEffect, useState } from 'react';

// redux
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';

// api
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { useQuery } from '@tanstack/react-query';

// types
import { OrganizationMemberType } from '@/interfaces/organization';

// constants
import { columns } from './table/columns';

// components
import { DataTable } from './table/DataTable';
import { Loader } from '@/components/ui/loader';

const EmployeesTab = () => {
  const [organizationsMembers, setOrganizationsMembers] = useState<
    OrganizationMemberType[]
  >([]);
  const [paginationPage, setPaginationPage] = useState<number>(1);

  const membersLimit = 10;

  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  const organizationsMembersResponse = useQuery({
    queryKey: ['getOrganizationsMembers'],
    queryFn: () =>
      organizationsApi.getOrganizationMembers({
        organizationId,
        page: paginationPage,
        limit: membersLimit,
      }),
    select: (res) => res.data,
    enabled: !!organizationId,
  });

  const handleSetPreviousPage = () => {
    setPaginationPage((prev) => {
      if (prev === 1) {
        return prev;
      }

      return --prev;
    });
  };

  const handleSetNextPage = () => {
    setPaginationPage((prev) => {
      if (
        organizationsMembersResponse &&
        organizationsMembersResponse.data?.pagination.totalPages === prev
      ) {
        return prev;
      }

      return ++prev;
    });
  };

  useEffect(() => {
    const members = organizationsMembersResponse.data?.data.members;
    members && setOrganizationsMembers(members);
  }, [organizationsMembersResponse]);

  useEffect(() => {
    organizationsMembersResponse.refetch();
  }, [paginationPage]);

  if (organizationsMembersResponse.isLoading) {
    return (
      <div className='h-full flex justify-center items-center'>
        <Loader />
      </div>
    );
  }
  return (
    <>
      {!!organizationsMembers.length ? (
        <DataTable
          columns={columns}
          data={organizationsMembers}
          currentPage={
            organizationsMembersResponse.data?.pagination.currentPage || 0
          }
          totalPages={
            organizationsMembersResponse.data?.pagination.totalPages || 0
          }
          isFetching={organizationsMembersResponse.isFetching}
          setNextPage={handleSetNextPage}
          setPreviousPage={handleSetPreviousPage}
        />
      ) : (
        <div>No employeers in company</div>
      )}
    </>
  );
};

export default EmployeesTab;
