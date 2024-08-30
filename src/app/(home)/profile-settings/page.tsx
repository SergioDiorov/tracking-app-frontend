'use client';

import React from 'react';

import ProfileSettingsForm from '@/components/ProfileSettings/form/ProfileSettingsForm';

const ProfileSettings = () => {
  return (
    <div className='max-w-[700px] m-auto'>
      <h1 className='font-semibold text-[28px] mb-4'>
         Edit profile information
      </h1>
      <ProfileSettingsForm />
    </div>
  );
};

export default ProfileSettings;
