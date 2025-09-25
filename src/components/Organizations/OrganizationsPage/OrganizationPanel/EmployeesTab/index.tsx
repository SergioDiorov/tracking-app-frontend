'use client';

// react
import React, { FC, useEffect, useState } from 'react';

// redux
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';

// api
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { useQuery } from '@tanstack/react-query';

// types
import { IOrganizationMemberType } from '@/interfaces/organization';

// constants
import { columns } from './table/columns';

// components
import { DataTable } from './table/DataTable';
import { Loader } from '@/components/ui/loader';
import {
  OrganizationMembersOrderType,
  OrganizationMembersSortByType,
} from '@/api/organizations/organizationsTypes';

interface IEmployeesTabProps {}

const EmployeesTab: FC<IEmployeesTabProps> = ({}) => {
  const [organizationsMembers, setOrganizationsMembers] = useState<
    IOrganizationMemberType[]
  >([]);
  const [paginationPage, setPaginationPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<
    OrganizationMembersSortByType | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<
    OrganizationMembersOrderType | undefined
  >(undefined);

  const membersLimit = 10;

  const organizationId = useAppSelector(
    organizationSelectors.getOrganizationId,
  );

  const organizationsMembersResponse = useQuery({
    queryKey: ['getOrganizationsMembers', organizationId],
    queryFn: () =>
      organizationsApi.getOrganizationMembers({
        organizationId,
        page: paginationPage,
        limit: membersLimit,
        sortBy,
        sortOrder,
      }),
    select: (res) => res.data,
    enabled: !!organizationId,
  });

  const handleSetPreviousPage = () => {
    setPaginationPage((prev) => (prev === 1 ? prev : --prev));
  };

  const handleSetNextPage = () => {
    setPaginationPage((prev) =>
      organizationsMembersResponse &&
      organizationsMembersResponse.data?.pagination.totalPages === prev
        ? prev
        : ++prev,
    );
  };

  useEffect(() => {
    organizationsMembersResponse.data?.data &&
      setOrganizationsMembers(organizationsMembersResponse.data?.data.members);
  }, [organizationsMembersResponse]);

  useEffect(() => {
    organizationsMembersResponse.refetch();
  }, [paginationPage]);

  useEffect(() => {
    if (sortBy && sortOrder) {
      organizationsMembersResponse.refetch();
    }
  }, [sortBy, sortOrder]);

  if (organizationsMembersResponse.isLoading) {
    return (
      <div className='h-full flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {!!organizationsMembers?.length ? (
        <div className='relative'>
          <div
            className={`absolute left-0 top-0 right-0 bottom-0 m-auto flex justify-center items-center transition ${
              organizationsMembersResponse.isRefetching
                ? 'visible opacity-100'
                : 'hidden opacity-0'
            }`}
          >
            <Loader hideText />
          </div>
          <div
            className={`transition ${
              organizationsMembersResponse.isRefetching
                ? 'blur-[3px] opacity-40 pointer-events-none rounded-md transition'
                : 'blur-[0px] opacity-100'
            }`}
          >
            <DataTable
              columns={columns({
                sortBy,
                sortOrder,
                setSortBy,
                setSortOrder,
              })}
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
          </div>
        </div>
      ) : (
        <div>No employeers in company</div>
      )}
    </>
  );
};

export default EmployeesTab;
