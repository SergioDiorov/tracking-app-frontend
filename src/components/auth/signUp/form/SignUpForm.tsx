import React, { useEffect, useState } from 'react';

// ui components
import { Input } from '@/components/ui/input';
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
import Select from '@/components/ui/custom/select';

// redux
import { useAppDispatch } from '@/redux/hooks';

// constants
import { countriesList } from '@/constants/location.constants';
import { setUserLoginData, setUserPartialData } from '@/redux/user/userSlice';
import { setLoginData } from '@/redux/auth/authSlice';

// actions
import { signUpUser } from './action';
import { useMutation } from '@tanstack/react-query';

// helpers
import { z } from 'zod';
import { signUpSchema } from './schema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { errorToast, successToast } from '@/helpers/toastActions';
import { usersApi } from '@/api/users/usersApi';
import { workPreferenceList } from '../../constants';

const SignUpForm = () => {
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();

  const ageOptions = Array.from({ length: 70 - 18 + 1 }, (_, i) => ({
    value: (i + 18).toString(),
    label: (i + 18).toString(),
  }));

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      city: '',
      age: '',
      country: '',
      workPreference: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof signUpSchema>) => signUpUser(values),
    mutationKey: ['signUp'],
    onSuccess: (data: any) => {
      if (data?.data) {
        if (file) uploadAvatarRequest({ file, userId: data.data.user.id });
        successToast('Registration successfully passed');
        dispatch(setLoginData(data));
        dispatch(setUserLoginData(data));
      }
    },
    onError: () => {
      errorToast('Error while sign up');
    },
  });

  const { mutate: uploadAvatarRequest } = useMutation({
    mutationFn: (data: { file: File; userId: string }) =>
      usersApi.uploadAvatar(data),
    mutationKey: ['uploadAvatar'],
    onSuccess: (response) => {
      if (response.data.data.avatarUrl) {
        dispatch(setUserPartialData({ avatar: response.data.data.avatarUrl }));
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid w-full items-center gap-4 mb-10'>
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

          <div className='flex flex-col md:flex-row gap-4 md:gap-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Create a password'
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
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Confirm new password'
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

        <div className='grid w-full items-center gap-4 md:gap-5'>
          <div className='flex flex-col md:flex-row gap-4 md:gap-2'>
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

            <div className='flex flex-col space-y-1.5 md:max-w-[80px] w-full'>
              <FormField
                control={form.control}
                name='age'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        placeholder='Age'
                        options={ageOptions}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex flex-col md:flex-row gap-4 md:gap-2'>
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
                            onChange={(value) => field.onChange(value)}
                            placeholder='Country'
                            options={countriesList}
                            selectContentStyle={'max-h-[300px]'}
                          />
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

          <div className='flex flex-col md:flex-row gap-4 md:gap-2'>
            <FormField
              name='avatar'
              render={() => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Avatar'
                      type='file'
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setFile(e.target.files[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        onChange={(value) => field.onChange(value)}
                        placeholder='Work preference'
                        options={workPreferenceList}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <Button
          type='submit'
          className='w-full h-[40px] md:h-[32px] mt-10'
          disabled={isPending}
        >
          {isPending ? 'Loading' : 'Sign Up'}
          {isPending && <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
