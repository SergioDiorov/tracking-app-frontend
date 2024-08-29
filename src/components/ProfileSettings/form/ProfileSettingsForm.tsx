'use client';

import React, { useEffect, useRef, useState } from 'react';

// ui components
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Card } from '@/components/ui/card';

// redux
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout } from '@/redux/auth/authSlice';
import { setUserData, userLogout } from '@/redux/user/userSlice';
import userSelectors from '@/redux/user/userSelectors';

// constants
import { countriesList } from '@/constants/location.constants';
import { setUserPartialData } from '@/redux/user/userSlice';

// helpers
import { profileSettingsSchema, ProfileSchemaType } from './schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { errorToast, successToast } from '@/helpers/toastActions';
import { usersApi } from '@/api/users/usersApi';

const ProfileSettingsForm = () => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector(userSelectors.getUserData);

  const [file, setFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | null>(userData.avatar);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ageOptions = Array.from({ length: 70 - 18 + 1 }, (_, i) => i + 18);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      email: userData.email,
      oldPassword: '',
      newPassword: '',
      firstName: userData.firstName,
      lastName: userData.lastName,
      city: userData.city,
      age: userData.age,
      country: userData.country,
      workPreference: userData.workPreference,
    },
  });

  const { mutate: updateProfileMutate, isPending } = useMutation({
    mutationFn: ({
      changedValues,
      userId,
    }: {
      changedValues: Partial<ProfileSchemaType>;
      userId: string;
    }) =>
      usersApi.updateProfileById({
        updateProfileData: changedValues,
        userId,
      }),
    mutationKey: ['editProfile'],
    onSuccess: (response) => {
      if (response?.data) {
        dispatch(setUserData(response.data.data.profile));
        successToast('Profile successfully updated');
      }
    },
    onError: () => {
      errorToast('Error while updating profile');
    },
  });

  const { mutate: uploadAvatarRequest, isPending: uploadAvatarIsFetching } =
    useMutation({
      mutationFn: (data: { file: File; userId: string }) =>
        usersApi.uploadAvatar(data),
      mutationKey: ['uploadAvatar'],
      onSuccess: (response) => {
        if (response.data.data.avatarUrl) {
          dispatch(
            setUserPartialData({ avatar: response.data.data.avatarUrl }),
          );
        }
      },
    });

  const { mutate: deleteAvatarRequest, isPending: deleteAvatarIsFetching } =
    useMutation({
      mutationFn: ({ userId }: { userId: string }) =>
        usersApi.deleteAvatar({ userId }),
      mutationKey: ['deleteAvatar'],
      onSuccess: (response) => {
        if (response) {
          setAvatar('');
          setFile(null);
          dispatch(setUserPartialData({ avatar: null }));
        }
      },
    });

  const onSubmit = async (values: ProfileSchemaType) => {
    const changedValues: Partial<ProfileSchemaType> = {};

    if (values.email !== userData.email) changedValues.email = values.email;
    if (values.firstName !== userData.firstName)
      changedValues.firstName = values.firstName;
    if (values.lastName !== userData.lastName)
      changedValues.lastName = values.lastName;
    if (values.city !== userData.city) changedValues.city = values.city;
    if (values.age !== userData.age) changedValues.age = values.age;
    if (values.country !== userData.country)
      changedValues.country = values.country;
    if (values.workPreference !== userData.workPreference)
      changedValues.workPreference = values.workPreference;

    if (values.oldPassword || values.newPassword) {
      if (!values.oldPassword || !values.newPassword) {
        errorToast('Both old and new passwords must be provided');
        return;
      }
      if (values.oldPassword === values.newPassword) {
        errorToast('New password must be different from old password');
        return;
      }
      changedValues.oldPassword = values.oldPassword;
      changedValues.newPassword = values.newPassword;
    }

    if (Object.keys(changedValues).length === 0) {
      successToast('No changes detected');
      return;
    }

    updateProfileMutate({ changedValues, userId: userData.id });
  };

  const handleDeleteAvatar = () => {
    deleteAvatarRequest({ userId: userData.id });
  };

  const handleLoadAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      uploadAvatarRequest({ file: selectedFile, userId: userData.id });
    }
  };

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(userLogout());
    successToast('Successful sign out');
  };

  const handleResetChanges = () => {
    form.reset({
      email: userData.email,
      oldPassword: '',
      newPassword: '',
      firstName: userData.firstName,
      lastName: userData.lastName,
      city: userData.city,
      age: userData.age,
      country: userData.country,
      workPreference: userData.workPreference,
    });
  };

  useEffect(() => {
    setAvatar(userData.avatar);
  }, [userData.avatar]);

  useEffect(() => {
    handleResetChanges();
  }, [userData]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className='w-full h-fit flex items-center justify-between gap-4 p-4 mb-4'>
          <div className='flex items-center gap-3'>
            {avatar ? (
              <img
                src={avatar}
                alt='Avatar'
                className={`w-[80px] h-[80px] rounded-full bg-secondary object-cover ${
                  (uploadAvatarIsFetching || deleteAvatarIsFetching) &&
                  'opacity-20'
                } transition`}
              />
            ) : (
              <div
                className={`w-[80px] h-[80px] rounded-full bg-secondary flex justify-center items-center text-[18px] font-bold text-primary/50 ${
                  (uploadAvatarIsFetching || deleteAvatarIsFetching) &&
                  'opacity-20'
                }`}
              >
                {userData.firstName[0] + userData.lastName[0]}
              </div>
            )}
            <div className='flex flex-col justify-center gap-1'>
              <p className='text-base text-primary font-medium'>
                Profile picture
              </p>
              <p className='text-xs text-primary/80 font-normal'>
                PNG, JPEG, JPG under 4MB
              </p>
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <Button
              className='h-[40px] md:h-[32px]'
              variant='outline'
              type='button'
              onClick={handleLoadAvatarClick}
              disabled={uploadAvatarIsFetching || deleteAvatarIsFetching}
            >
              Load new
            </Button>
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
            />
            <Button
              className='h-[40px] md:h-[32px]'
              variant='secondary'
              onClick={handleDeleteAvatar}
              type='button'
              disabled={
                (!file && !avatar) ||
                uploadAvatarIsFetching ||
                deleteAvatarIsFetching
              }
            >
              Delete
            </Button>
          </div>
        </Card>

        <Card className='w-full h-fit p-4'>
          <div className='grid w-full items-center gap-4 mb-4 border-b border-solid border-primary/10 pb-4'>
            <div className='border-b border-solid border-primary/10 pb-4'>
              <h6 className='text-base font-medium text-primary/90'>
                Contact email
              </h6>
              <p className='text-xs font-medium text-primary/70 mb-3'>
                Manage your account email address.
              </p>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Your email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <h6 className='text-base font-medium text-primary/90'>
                Password
              </h6>
              <p className='text-xs font-medium text-primary/70 mb-3'>
                Modify your current password.
              </p>
              <div className='flex flex-col md:flex-row gap-4 md:gap-3 w-full'>
                <FormField
                  control={form.control}
                  name='oldPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Set current password'
                          type='password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='newPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='New password'
                          type='password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className='grid w-full items-center gap-4'>
            <div>
              <h6 className='text-base font-medium text-primary/90 mb-3'>
                Personal credentials
              </h6>
              <div className='flex flex-col md:flex-row gap-4 md:gap-3'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input placeholder='First name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input placeholder='Last name' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex flex-col space-y-1.5 md:max-w-[100px] w-full'>
                  <FormField
                    control={form.control}
                    name='age'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Age' />
                            </SelectTrigger>
                            <SelectContent className='max-h-[200px] h-full'>
                              <SelectGroup>
                                {ageOptions.map((age) => (
                                  <SelectItem key={age} value={age.toString()}>
                                    {age}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4 md:gap-3'>
              <div className='flex flex-col space-y-1.5 w-full'>
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Controller
                          name='country'
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(value) => field.onChange(value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder='Country' />
                              </SelectTrigger>
                              <SelectContent className='max-h-[300px] h-full'>
                                <SelectGroup>
                                  {countriesList.map((country) => (
                                    <SelectItem key={country} value={country}>
                                      {country}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='city'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder='City' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex flex-col md:flex-row gap-4'>
              <div className='space-y-1.5 w-full'>
                <FormField
                  control={form.control}
                  name='workPreference'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work preference</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Work preference' />
                          </SelectTrigger>
                          <SelectContent className='max-h-[200px] h-full'>
                            <SelectGroup>
                              <SelectItem value='office'>Office</SelectItem>
                              <SelectItem value='remote'>Remote</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-between flex-wrap'>
            <div>
              <Button
                type='submit'
                className='h-[40px] md:h-[32px] mr-4'
                disabled={
                  isPending ||
                  !form.formState.isDirty ||
                  Object.keys(form.formState.errors).length > 0
                }
                variant='secondary'
              >
                {isPending ? 'Loading' : 'Save changes'}
                {isPending && (
                  <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />
                )}
              </Button>
              <Button
                type='button'
                className='h-[40px] md:h-[32px]'
                disabled={
                  isPending ||
                  !form.formState.isDirty ||
                  Object.keys(form.formState.errors).length > 0
                }
                onClick={handleResetChanges}
                variant='outline'
              >
                Reset changes
              </Button>
            </div>
            <Button
              type='button'
              className='h-[40px] md:h-[32px]'
              disabled={isPending}
              variant='destructive'
              onClick={handleLogOut}
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default ProfileSettingsForm;
