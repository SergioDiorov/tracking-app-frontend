// types
import { ColumnDef } from '@tanstack/react-table';
import { IOrganizationTaskType } from '@/interfaces/organization';

// helpers
import { formatDate } from '@/helpers/formatDate';
import {
  TaskOrderType,
  TaskSortByType,
} from '@/api/organizations/organizationsTypes';
import { PriorityBadge } from '../../constants';
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
  setOpenEditTaskModal,
  setOpenDeleteTaskModal,
}: {
  sortBy: TaskSortByType | undefined;
  sortOrder: TaskOrderType | undefined;
  setSortBy: (param: TaskSortByType) => void;
  setSortOrder: (param: TaskOrderType) => void;
  setOpenEditTaskModal: (param: IOrganizationTaskType) => void;
  setOpenDeleteTaskModal: (param: IOrganizationTaskType) => void;
}): ColumnDef<IOrganizationTaskType>[] => {
  const settings: HeaderButtonSettingsType = {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  } as HeaderButtonSettingsType;

  return [
    {
      id: 'assignee',
      header: () => (
        <HeaderButton
          colKey='assignee'
          colTitle='Assignee'
          settings={settings}
        />
      ),
      cell: ({ row }) => {
        const userProfile = row.original.assignedMember.userProfile;
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
      accessorKey: 'title',
      header: () => (
        <HeaderButton colKey='title' colTitle='Title' settings={settings} />
      ),
      cell: ({ row }) => {
        return (
          <p className='whitespace-nowrap max-w-64 w-full truncate'>
            {row.getValue('title')}
          </p>
        );
      },
    },
    // {
    //   accessorKey: 'descriptopn',
    //   header: 'Description',
    //   cell: ({ row }) => {
    //     const isExpanded = expandedRowId === row.original.id;
    //     return (
    //       <button
    //         onClick={() => toggleRow(row.original.id)}
    //         className={`w-full max-w-72 xl:max-w-96 text-left ${
    //           !isExpanded && 'truncate'
    //         }`}
    //       >
    //         {row.getValue('descriptopn')}
    //       </button>
    //     );
    //   },
    // },
    {
      accessorKey: 'priority',
      header: () => (
        <HeaderButton
          colKey='priority'
          colTitle='Priority'
          settings={settings}
        />
      ),
      cell: ({ row }) => {
        return <PriorityBadge value={row.getValue('priority')} />;
      },
    },
    {
      accessorKey: 'createdAt',
      cell: ({ row }) => formatDate(row.getValue('createdAt')),
      header: () => (
        <HeaderButton colKey='createdAt' colTitle='Added' settings={settings} />
      ),
    },
    {
      accessorKey: 'deadline',
      header: () => (
        <HeaderButton
          colKey='deadline'
          colTitle='Deadline'
          settings={settings}
        />
      ),
      cell: ({ row }) => formatDate(row.getValue('deadline')),
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
                setOpenEditTaskModal(row.original);
              }}
              className='hidden md:block'
              disabled={false}
            >
              <SquarePen className='relative top-px size-5 text-primary/50 hover:text-primary/40 active:text-primary/20 transition' />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteTaskModal(row.original);
              }}
              className='hidden md:block'
              disabled={false}
            >
              <Trash className='size-5 text-primary/50 hover:text-primary/40 active:text-primary/20 transition' />
            </button>
          </div>
        </>
      ),
    },
  ];
};
