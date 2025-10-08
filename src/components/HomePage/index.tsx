// react
import React from 'react';

// components
import TrackerBar from '../MyProgress/TrackerBar';
import UserStatstics from './UserStatstics';
import LogsContainer from '../MyProgress/LogsContainer';
import UserInfo from './UserInfo';
import { useIsUserOrganizationOwner } from '@/hooks/useIsUserOrganizationOwner';

const HomePage = () => {
  const isUserOrganizationOwner = useIsUserOrganizationOwner();
  return (
    <div className='flex flex-col gap-4'>
      <UserInfo />
      <TrackerBar />
      {!isUserOrganizationOwner && <UserStatstics />}
      <LogsContainer
        containerClassName=' md:!max-h-[50vh]'
        cardTitle='Logs'
        showLinkButton
      />
    </div>
  );
};

export default HomePage;
