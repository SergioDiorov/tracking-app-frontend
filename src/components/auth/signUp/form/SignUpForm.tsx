import React from 'react';

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

// redux
import { useAppDispatch } from '@/redux/hooks';

// constants
import { countriesList } from '@/constants/location.constants';
import { setUserLoginData } from '@/redux/user/userSlice';
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

const SignUpForm = () => {
  const dispatch = useAppDispatch();

  const ageOptions = Array.from({ length: 70 - 18 + 1 }, (_, i) => i + 18);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      city: '',
      avatar: '',
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
        successToast('Registration successfully passed');
        dispatch(setLoginData(data));
        dispatch(setUserLoginData(data));
      }
    },
    onError: () => {
      errorToast('Error while sign up');
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
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder='Country' />
                            </SelectTrigger>
                            <SelectContent className='max-h-[500px] h-full'>
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

          <div className='flex flex-col md:flex-row gap-4 md:gap-2'>
            <FormField
              control={form.control}
              name='avatar'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input placeholder='Avatar' type='file' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-1.5 md:w-[50%]'>
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
