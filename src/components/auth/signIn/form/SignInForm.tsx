import React from 'react';

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

// redux
import { useAppDispatch } from '@/redux/hooks';
import { setUserLoginData } from '@/redux/user/userSlice';
import { setLoginData } from '@/redux/auth/authSlice';

// actions
import { signInUser } from './action';
import { useMutation } from '@tanstack/react-query';

// helpers
import { z } from 'zod';
import { signInSchema } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { errorToast, successToast } from '@/helpers/toastActions';

const SignInForm = () => {
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: z.infer<typeof signInSchema>) => signInUser(values),
    mutationKey: ['signIn'],
    onSuccess: (data: any) => {
      if (data?.data) {
        successToast('Successful sign in');
        dispatch(setLoginData(data));
        dispatch(setUserLoginData(data));
      }
    },
    onError: () => {
      errorToast('Error while sign in');
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
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
        </div>

        <Button
          type='submit'
          className='w-full h-[40px] md:h-[32px]'
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? 'Loading' : 'Sign In'}
          {isPending && <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
