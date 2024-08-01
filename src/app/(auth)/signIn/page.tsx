'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// components
import SignInForm from '@/components/auth/signIn/form/SignInForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SignIn = () => {
  const router = useRouter();

  return (
    <div className='flex justify-center items-center w-full min-h-screen p-3'>
      <Card className='max-w-[500px] w-full h-fit'>
        <CardHeader>
          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Hello, welcome back
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter>
          <p className='w-full text-s text-center text-gray-500'>
            Dont have account?{' '}
            <span
              onClick={() => router.push('/signUp')}
              className='underline text-sky-600 hover:text-sky-400 cursor-pointer font-medium'
            >
              Sign Up
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
