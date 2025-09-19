'use client';

import React from 'react';
import MyProgressContainer from '@/components/MyProgress';
import { MyProgressProvider } from '@/context/MyProgress/MyProgressContext';

const MyProgress = () => {
  return (
    <MyProgressProvider>
      <MyProgressContainer />
    </MyProgressProvider>
  );
};

export default MyProgress;
