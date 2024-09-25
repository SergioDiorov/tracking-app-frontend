'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface IDataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  currentPage: number;
  totalPages: number;
  isFetching: boolean;
  setPreviousPage: () => void;
  setNextPage: () => void;
}

export function DataTable<TData>({
  columns,
  data,
  currentPage,
  totalPages,
  isFetching,
  setPreviousPage,
  setNextPage,
}: IDataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader className='bg-muted/50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='whitespace-nowrap'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-end space-x-2 pt-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {currentPage} of {totalPages} pages.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={setPreviousPage}
            disabled={currentPage === 1 || isFetching}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={setNextPage}
            disabled={currentPage === totalPages || isFetching}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
