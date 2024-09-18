import { ColumnDef } from '@tanstack/react-table';
import { OrganizationMemberType } from '@/interfaces/organization';
import { formatDate } from '@/helpers/formatDate';

export const columns: ColumnDef<OrganizationMemberType>[] = [
  {
    id: 'user',
    header: 'Name',
    cell: ({ row }) => {
      const { firstName, lastName, avatar } = row.original.userProfile;
      return (
        <div className='flex items-center'>
          {avatar ? (
            <img
              src={avatar}
              alt='Avatar'
              className={
                'w-[30px] h-[30px] rounded-full bg-secondary object-cover'
              }
            />
          ) : (
            <div
              className={
                'w-[30px] h-[30px] rounded-full bg-secondary flex justify-center items-center text-[10px] uppercase font-bold text-primary/50'
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
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'joined',
    header: 'Joined',
    cell: ({ row }) => formatDate(row.getValue('joined')),
  },
];
