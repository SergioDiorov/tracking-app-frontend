'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// components
import SignUpForm from '@/components/auth/signUp/form/SignUpForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SignUp = () => {
  const router = useRouter();

  return (
    <div className='flex justify-center items-center w-full min-h-screen p-3'>
      <Card className='max-w-[500px] h-fit'>
        <CardHeader>
          <CardTitle className='text-center'>Sign Up</CardTitle>
          <CardDescription className='text-center'>
            Just a few quick things to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter>
          <p className='w-full text-s text-center text-gray-500'>
            Already a user?{' '}
            <span
              onClick={() => router.push('/signIn')}
              className='underline text-sky-600 hover:text-sky-400 cursor-pointer font-medium'
            >
              Sign In
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
