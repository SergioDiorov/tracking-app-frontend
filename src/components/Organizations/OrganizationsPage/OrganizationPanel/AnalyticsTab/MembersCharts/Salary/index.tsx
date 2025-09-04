import React from 'react';
import RoundedChart from '../../ChartsContainers/RoundedChart';

const generateBlueShades = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const hue = 190 + i * ((240 - 190) / Math.max(count - 1, 1));
    const lightness = 70 - i * (30 / Math.max(count - 1, 1));
    const saturation = 75;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

const SalaryChart = ({
  salaryData,
}: {
  salaryData: Record<string, number>;
}) => {
  const shades = generateBlueShades(Object.keys(salaryData).length);

  return (
    <RoundedChart
      title='Salary'
      data={salaryData}
      shades={shades}
      cardClassName='w-full md:w-fit lg:w-full'
    />
  );
};

export default SalaryChart;
