import React from 'react';
import RoundedChart from '../../ChartsContainers/RoundedChart';

const generateYellowShades = (count: number) => {
  const hues = [15, 25, 35, 45, 55, 65, 75];
  return Array.from({ length: count }, (_, i) => {
    const hue = hues[i % hues.length];
    const lightness = 75 - (i % 4) * 10;
    const saturation = 70 + (i % 2) * 15;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

const AgeChart = ({ ageData }: { ageData: Record<string, number> }) => {
  const shades = generateYellowShades(Object.keys(ageData).length);

  return (
    <RoundedChart
      title='Age'
      data={ageData}
      shades={shades}
      cardClassName='w-full md:w-fit lg:w-full'
    />
  );
};

export default AgeChart;
