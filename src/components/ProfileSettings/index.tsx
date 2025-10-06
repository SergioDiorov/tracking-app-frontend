import React from 'react';

import ProfileSettingsForm from './ProfileSettingsForm';
import ChangePasswordForm from './ChangePasswordForm/inedx';
import ManageOrganizations from './ManageOrganizations';

const ProfileSettingsContainer = () => {
  return (
    <div className='space-y-4'>
      <ProfileSettingsForm />
      <ChangePasswordForm />
      <ManageOrganizations />
    </div>
  );
};

export default ProfileSettingsContainer;
