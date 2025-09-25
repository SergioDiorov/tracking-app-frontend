import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type HeaderButtonSettingsType = {
  sortBy: string;
  sortOrder: string;
  setSortBy: (param: string) => void;
  setSortOrder: (param: string) => void;
};

export const HeaderButton = ({
  colKey,
  colTitle,
  settings,
}: {
  colKey: string;
  colTitle: string;
  settings: HeaderButtonSettingsType;
}) => {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = settings;

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
