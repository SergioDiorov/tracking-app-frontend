// types
import { ColumnDef } from '@tanstack/react-table';
import {
  IOrganizationTaskType,
  OrganizationTaskPriorityEnum,
} from '@/interfaces/organization';

// helpers
import { formatDate } from '@/helpers/formatDate';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  TaskOrderType,
  TaskSortByType,
} from '@/api/organizations/organizationsTypes';

export const columns = ({
  expandedRowId,
  toggleRow,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}: {
  expandedRowId: string | null;
  toggleRow: (id: string) => void;
  sortBy: TaskSortByType | undefined;
  sortOrder: TaskOrderType | undefined;
  setSortBy: (param: TaskSortByType) => void;
  setSortOrder: (param: TaskOrderType) => void;
}): ColumnDef<IOrganizationTaskType>[] => {
  const HeaderButton = ({
    colKey,
    colTitle,
  }: {
    colKey: TaskSortByType;
    colTitle: string;
  }) => {
    const isAsc = sortBy === colKey && sortOrder === 'asc';

    return (
      <Button
        variant='ghost'
        className='relative -left-1 !p-1'
        onClick={() => {
          setSortBy(colKey);
          setSortOrder(isAsc ? 'desc' : 'asc');
        }}
      >
        {colTitle}
        {sortBy !== colKey ? (
          <ArrowUpDown className='ml-2 h-4 w-4 opacity-40' />
        ) : isAsc ? (
          <ArrowUp className='ml-2 h-4 w-4' />
        ) : (
          <ArrowDown className='ml-2 h-4 w-4' />
        )}
      </Button>
    );
  };

  return [
    {
      id: 'assignee',
      header: () => <HeaderButton colKey='assignee' colTitle='Assignee' />,
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
      header: () => <HeaderButton colKey='title' colTitle='Title' />,
      cell: ({ row }) => {
        return <p className='whitespace-nowrap'>{row.getValue('title')}</p>;
      },
    },
    {
      accessorKey: 'descriptopn',
      header: 'Description',
      cell: ({ row }) => {
        const isExpanded = expandedRowId === row.original.id;
        return (
          <button
            onClick={() => toggleRow(row.original.id)}
            className={`w-full max-w-72 xl:max-w-96 text-left ${
              !isExpanded && 'truncate'
            }`}
          >
            {row.getValue('descriptopn')}
          </button>
        );
      },
    },
    {
      accessorKey: 'priority',
      header: () => <HeaderButton colKey='priority' colTitle='Priority' />,
      cell: ({ row }) => {
        const colorBg = () => {
          switch (row.getValue('priority')) {
            case OrganizationTaskPriorityEnum.HIGH:
              return 'bg-[#FFE5E5]';
            case OrganizationTaskPriorityEnum.MEDIUM:
              return 'bg-[#FFF8E1]';
            case OrganizationTaskPriorityEnum.LOW:
              return 'bg-[#E8F5E9]';
            default:
              return '';
          }
        };
        return (
          <Badge
            variant='secondary'
            className={`text-primary-text/80 block w-full text-center max-w-20 ${colorBg()}`}
          >
            {row.getValue('priority')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      cell: ({ row }) => formatDate(row.getValue('createdAt')),
      header: () => <HeaderButton colKey='createdAt' colTitle='Added' />,
    },
    {
      accessorKey: 'deadline',
      header: () => <HeaderButton colKey='deadline' colTitle='Deadline' />,
      cell: ({ row }) => formatDate(row.getValue('deadline')),
    },
  ];
};
