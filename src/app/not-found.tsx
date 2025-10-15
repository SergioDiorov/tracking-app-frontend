'use client';

import React from 'react';
import { ReduxProvider } from '@/providers/ReduxProvider';
import NotFound from '@/components/NotFound';

const Index = () => {
  return (
    <ReduxProvider>
      <div className='absolute top-0 left-0 right-0 bottom-0 m-auto flex items-center justify-center'>
        <NotFound />
      </div>
    </ReduxProvider>
  );
};

export default Index;
