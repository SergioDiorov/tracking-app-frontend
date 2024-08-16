'use client';

// react
import React from 'react';

// next
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// constants
import { menuList } from '@/components/assets/TopBar/constants';

// components
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// icons
import { HomeIcon } from '@radix-ui/react-icons';
import { ExitIcon } from '@radix-ui/react-icons';

// redux
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';
import { logout } from '@/redux/auth/authSlice';
import { userLogout } from '@/redux/user/userSlice';
import { successToast } from '@/helpers/toastActions';

const TopBar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const path = usePathname();

  const userData = useAppSelector(userSelectors.getUserData);

  const handleSignOut = () => {
    successToast('Successful sign out');
    dispatch(logout());
    dispatch(userLogout());
  };

  return (
    <div className='fixed top-0 left-0 w-full h-[60px] bg-primary text-secondary-text flex justify-between items-center px-3 shadow-sm'>
      <div className='min-[850px]:max-w-[205px] min-[850px]:w-full'>
        <Button
          variant='default'
          className='w-10 h-10 bg-secondary/10 rounded-[8px] p-0 hover:bg-secondary/20 active:bg-secondary/10'
          onClick={() => router.push('/')}
        >
          <HomeIcon width={18} height={18} fill='#b7c0cd' />
        </Button>
      </div>

      <div className='flex items-center'>
        {menuList.map((item, index) => (
          <React.Fragment key={item.path}>
            <Link
              href={item.path}
              className={`p-2 py-[6px] hover:bg-secondary/20 active:bg-secondary/10 text-[14px] transition rounded-[4px] ${
                path === item.path && '!bg-secondary/20'
              }`}
            >
              {item.text}
            </Link>
            {++index !== menuList.length && (
              <div className='w-[2px] h-10 rounded-[8px] bg-secondary-text/10 mx-2' />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className='flex items-center gap-2 min-[850px]:max-w-[205px] min-[850px]:w-full'>
        <div className='flex flex-col justify-center items-end'>
          <p className='text-[12px]'>
            {userData.firstName + ' ' + userData.lastName}
          </p>
          <p className='text-[12px]'>{userData.email}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={userData.avatar || ''} alt='Avatar' />
              <AvatarFallback>
                {userData.firstName[0] + userData.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mr-3'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Sign Out
              <DropdownMenuShortcut>
                <ExitIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopBar;
