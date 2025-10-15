import { useAuth } from '@/redux/hooks';
import React from 'react';
import { menuList } from '../assets/Navigation/constants';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const Index = () => {
  const isAuth = useAuth();

  return (
    <Card className='w-[50%] h-[50%] relative flex'>
      <div className='flex items-center justify-center gap-5 flex-col z-10 relative m-auto'>
        <p className='text-9xl font-semibold bg-gradient-to-r from-blue-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent scale-[1.2]'>
          404
        </p>

        <div className='bg-card-foreground/20 w-1/2 h-px' />

        <div className='text-center'>
          <h1 className='text-base font-semibold text-card-foreground/70'>
            The page you’re looking for doesn’t exist
          </h1>

          <p className='tracking-tight text-[15px] font-medium text-card-foreground/60'>
            You may navigate to the following pages
          </p>
        </div>

        <div className='bg-card-foreground/20 w-1/2 h-px' />

        <div className='flex items-center justify-center gap-2'>
          {isAuth ? (
            <>
              <Link
                href={'/'}
                className='hover:bg-secondary/20 active:bg-secondary/10 text-[14px] transition rounded-[4px]'
              >
                <Button variant='default'>Home</Button>
              </Link>
              {menuList.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className='hover:bg-secondary/20 active:bg-secondary/10 text-[14px] transition rounded-[4px]'
                >
                  <Button variant='default'>{item.text}</Button>
                </Link>
              ))}
            </>
          ) : (
            <>
              <Link
                href={'/signIn'}
                className='hover:bg-secondary/20 active:bg-secondary/10 text-[14px] transition rounded-[4px]'
              >
                <Button variant='default'>Sign In</Button>
              </Link>
              <Link
                href={'/signUp'}
                className='hover:bg-secondary/20 active:bg-secondary/10 text-[14px] transition rounded-[4px]'
              >
                <Button variant='default'>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className='bg-[radial-gradient(circle,rgba(90,93,129,0.3)_0%,rgba(255,255,255,0)60%,rgba(255,255,255,0)_100%)] absolute top-0 left-0 right-0 bottom-0 m-auto w-full h-full z-0 p-1' />
    </Card>
  );
};

export default Index;
