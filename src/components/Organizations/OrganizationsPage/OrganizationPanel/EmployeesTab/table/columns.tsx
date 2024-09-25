// types
import { ColumnDef } from '@tanstack/react-table';
import { IOrganizationMemberType } from '@/interfaces/organization';

// helpers
import { formatDate } from '@/helpers/formatDate';
import { formatWorkExperience } from '@/helpers/formatWorkExperience';

export const columns: ColumnDef<IOrganizationMemberType>[] = [
  {
    id: 'user',
    header: 'Name',
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
    header: 'Age',
  },
  {
    accessorKey: 'userProfile.country',
    header: 'Country',
  },
  {
    accessorKey: 'position',
    header: 'Position',
  },
  {
    accessorKey: 'workSchedule',
    header: 'Schedule',
  },
  {
    accessorKey: 'workHours',
    header: 'Work Hours',
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cell: ({ row }) => <span>${row.original.salary}</span>,
  },
  {
    accessorKey: 'workExperienceMonth',
    header: 'Work Experience',
    cell: ({ row }) => formatWorkExperience(row.original.workExperienceMonth),
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'joined',
    header: 'Joined',
    cell: ({ row }) => formatDate(row.getValue('joined')),
  },
];
