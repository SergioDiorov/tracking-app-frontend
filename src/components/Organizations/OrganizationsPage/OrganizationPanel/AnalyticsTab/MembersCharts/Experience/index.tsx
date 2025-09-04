import React from 'react';
import RoundedChart from '../../ChartsContainers/RoundedChart';

const generateGreenShades = (count: number) => {
  const hues = [90, 100, 110, 120, 130, 140, 150, 160];
  return Array.from({ length: count }, (_, i) => {
    const hue = hues[i % hues.length];
    const lightness = 85 - (i % 4) * 12;
    const saturation = 35 + (i % 3) * 15;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

const ExperienceChart = ({
  experienceData,
}: {
  experienceData: Record<string, number>;
}) => {
  const shades = generateGreenShades(Object.keys(experienceData).length);

  return (
    <RoundedChart
      title='Experience'
      data={experienceData}
      shades={shades}
      cardClassName='w-full md:w-fit lg:w-full'
    />
  );
};

export default ExperienceChart;
