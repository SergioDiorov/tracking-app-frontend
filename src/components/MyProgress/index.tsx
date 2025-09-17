'use client';

import React from 'react';

import TrackerBar from './TrackerBar';
import LogsContainer from './LogsContainer';
import AssignedUserTasks from './AssignedUserTasksContainer';

const MyProgress = () => {
  return (
    <div className='flex flex-col gap-4'>
      <TrackerBar />
      <AssignedUserTasks />
      <LogsContainer />
    </div>
  );
};

export default MyProgress;
