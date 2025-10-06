import React, { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  DownloadIcon,
  HamburgerMenuIcon,
  PlusIcon,
  FilePlusIcon,
} from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import Modal from '@/components/assets/Modal';
import AddOrganizationEmployerForm from '../../AddOrganizationEmployerForm/AddOrganizationEmployerForm';
import AddNewTaskForm from '../../AddNewTaskForm/AddNewTaskForm';
import { useQuery } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { exportToCSV } from '@/helpers/exportToCSV';

const MenuButton = ({
  onClick,
  disabled,
  text,
  icon: Icon,
}: {
  onClick: () => void;
  disabled?: boolean;
  text: string;
  icon: React.ElementType;
}) => {
  return (
    <Button
      variant='outline'
      size='sm'
      className='text-primary/70 text-left justify-start'
      onClick={onClick}
      disabled={!!disabled}
    >
      {Icon && <Icon className='mr-2 h-4 w-4' />}
      <span className=''>{text}</span>
    </Button>
  );
};

const OrganizationHeaderMenu = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const [openAddEmployerModal, setOpenAddEmployerModal] =
    useState<boolean>(false);
  const [openAddTaskModal, setOpenAddTaskModal] = useState<boolean>(false);

  // Fetch all organization members data
  const {
    data: allOrganizationMembersData,
    isLoading: allOrganizationMembersLoading,
    isFetching: allOrganizationMembersFetching,
  } = useQuery({
    queryKey: ['getAllOrganizationMembersForExport', organizationId],
    queryFn: () =>
      organizationsApi.getAllOrganizationMembersForExport(organizationId),
    select: (res) => res.data,
    enabled: !!organizationId,
  });

  const allOrganizationMembers = allOrganizationMembersData?.data.members || [];

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='text-primary/70'>
            <HamburgerMenuIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className='mr-8 p-2'>
          <DropdownMenuLabel className='font-medium px-3 py-1'>
            Organization actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className='mt-2 flex flex-col gap-2'>
            <MenuButton
              text='Add employer'
              onClick={() => setOpenAddEmployerModal(true)}
              icon={PlusIcon}
            />

            <MenuButton
              text='Add task'
              onClick={() => setOpenAddTaskModal(true)}
              icon={FilePlusIcon}
            />

            <MenuButton
              text='Employees CSV'
              onClick={() => exportToCSV(allOrganizationMembers || [])}
              icon={DownloadIcon}
              disabled={
                allOrganizationMembersLoading ||
                allOrganizationMembersFetching ||
                !allOrganizationMembers.length
              }
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        open={openAddEmployerModal}
        onOpenChange={setOpenAddEmployerModal}
        title='Add new employer'
        disableCancelButton
        disableAcceptButton
      >
        <AddOrganizationEmployerForm
          organizationId={organizationId}
          closeModal={() => setOpenAddEmployerModal(false)}
        />
      </Modal>

      <Modal
        open={openAddTaskModal}
        onOpenChange={setOpenAddTaskModal}
        title='Add new task'
        disableCancelButton
        disableAcceptButton
        dialogContentClassName='!overflow-visible'
      >
        <AddNewTaskForm
          organizationId={organizationId}
          closeModal={() => setOpenAddTaskModal(false)}
        />
      </Modal>
    </>
  );
};

export default OrganizationHeaderMenu;
