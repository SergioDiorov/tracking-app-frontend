import * as XLSX from 'xlsx';

export const exportToCSV = (members: any[]) => {
  const workbook = XLSX.utils.book_new();

  const worksheet = XLSX.utils.json_to_sheet(members);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Members');

  XLSX.writeFile(workbook, 'organization_members.csv', { bookType: 'csv' });
};