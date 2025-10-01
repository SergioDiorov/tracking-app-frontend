// types
import { ColumnDef } from '@tanstack/react-table';
import { IOrganizationMemberType } from '@/interfaces/organization';

// helpers
import { formatDate } from '@/helpers/formatDate';
import { formatWorkExperience } from '@/helpers/formatWorkExperience';
import {
  OrganizationMembersOrderType,
  OrganizationMembersSortByType,
} from '@/api/organizations/organizationsTypes';
import {
  HeaderButton,
  HeaderButtonSettingsType,
} from '@/helpers/HeaderTableButton';
import { SquarePen, Trash } from 'lucide-react';

export const columns = ({
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
  setOpenEditMemberModal,
  setOpenDeleteMemberModal,
}: {
  sortBy: OrganizationMembersSortByType | undefined;
  sortOrder: OrganizationMembersOrderType | undefined;
  setSortBy: (param: OrganizationMembersSortByType) => void;
  setSortOrder: (param: OrganizationMembersOrderType) => void;
  setOpenEditMemberModal: (param: IOrganizationMemberType) => void;
  setOpenDeleteMemberModal: (param: IOrganizationMemberType) => void;
}): ColumnDef<IOrganizationMemberType>[] => {
  const settings: HeaderButtonSettingsType = {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  } as HeaderButtonSettingsType;

  return [
    {
      id: 'user',
      header: () => (
        <HeaderButton colKey='firstName' colTitle='Name' settings={settings} />
      ),
      cell: ({ row }) => {
        const userProfile = row.original.userProfile;
        const firstName = userProfile?.firstName || '';
        const lastName = userProfile?.lastName || '';
        const avatar = userProfile?.avatar || null;

        return (
          <div className='flex items-center'>
            {avatar ? (
              <img
                src={avatar}
                alt='Avatar'
                className={
                  'max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-secondary object-cover'
                }
              />
            ) : (
              <div
                className={
                  'max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-secondary flex justify-center items-center text-[10px] uppercase font-bold text-primary/50'
                }
              >
                {firstName[0] + lastName[0]}
              </div>
            )}
            <span className='ml-2'>{`${firstName} ${lastName}`}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'userProfile.age',
      header: () => (
        <HeaderButton colKey='age' colTitle='Age' settings={settings} />
      ),
    },
    {
      accessorKey: 'userProfile.country',
      header: () => (
        <HeaderButton colKey='country' colTitle='Country' settings={settings} />
      ),
    },
    {
      accessorKey: 'position',
      header: () => (
        <HeaderButton
          colKey='position'
          colTitle='Position'
          settings={settings}
        />
      ),
    },
    {
      accessorKey: 'workSchedule',
      header: () => (
        <HeaderButton
          colKey='workSchedule'
          colTitle='Schedule'
          settings={settings}
        />
      ),
    },
    {
      accessorKey: 'workHours',
      header: () => (
        <HeaderButton
          colKey='workHours'
          colTitle='Work Hours'
          settings={settings}
        />
      ),
    },
    {
      accessorKey: 'salary',
      header: () => (
        <HeaderButton colKey='salary' colTitle='Salary' settings={settings} />
      ),
      cell: ({ row }) => <span>${row.original.salary}</span>,
    },
    {
      accessorKey: 'workExperienceMonth',
      header: () => (
        <HeaderButton
          colKey='workExperienceMonth'
          colTitle='Work Experience'
          settings={settings}
        />
      ),
      cell: ({ row }) => formatWorkExperience(row.original.workExperienceMonth),
    },
    {
      accessorKey: 'role',
      header: () => (
        <HeaderButton colKey='role' colTitle='Role' settings={settings} />
      ),
    },
    {
      accessorKey: 'joined',
      header: () => (
        <HeaderButton colKey='joined' colTitle='Joined' settings={settings} />
      ),
      cell: ({ row }) => formatDate(row.getValue('joined')),
    },
    {
      accessorKey: 'edit',
      header: '',
      cell: ({ row }) => (
        <>
          <div className='flex items-center gap-1'>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenEditMemberModal(row.original);
              }}
            >
              <SquarePen className='relative top-px size-5 text-primary/50 hover:text-primary/40 active:text-primary/20 transition' />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteMemberModal(row.original);
              }}
            >
              <Trash className='size-5 text-primary/50 hover:text-primary/40 active:text-primary/20 transition' />
            </button>
          </div>
        </>
      ),
    },
  ];
};
