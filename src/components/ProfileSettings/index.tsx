import React from 'react';

import ProfileSettingsForm from './ProfileSettingsForm';
import ChangePasswordForm from './ChangePasswordForm/inedx';

const ProfileSettingsContainer = () => {
  return (
    <div>
      <ProfileSettingsForm />
      <ChangePasswordForm />
    </div>
  );
};

export default ProfileSettingsContainer;
