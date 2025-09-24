// react
import React from 'react';

// components
import { Card } from '@/components/ui/card';
import LoggedTimeWidget from './LoggedTimeWidget';
import TasksWidget from './TasksWidget';

const UserStatstics = () => {
  return (
    <Card className='p-4 w-full flex border-l pl-4 flex-col sm:flex-row'>
      <LoggedTimeWidget />
      <TasksWidget />
    </Card>
  );
};

export default UserStatstics;
