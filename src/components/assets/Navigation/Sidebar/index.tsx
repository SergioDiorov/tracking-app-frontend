'use client';

// react
import React, { FC } from 'react';

// next
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// constants
import { sidebarMenuList } from '@/components/assets/Navigation/constants';

// icons
import { Cross2Icon } from '@radix-ui/react-icons';

// components
import { Button } from '@/components/ui/button';

interface ISIdebarProps {
  closeMenu: () => void;
}

const Sidebar: FC<ISIdebarProps> = ({ closeMenu }) => {
  const path = usePathname();

  return (
    <div className='w-screen max-w-[287px] pt-0 p-3 bg-primary min-h-screen gap-5 z-[65] shadow-sm'>
      <div className='flex h-[60px] items-center justify-between mb-[10px]'>
        <h3 className='text-secondary-text'>Tracking App</h3>
        <Button
          variant='default'
          className='w-10 h-10 bg-secondary/10 rounded-[8px] p-0 hover:bg-secondary/20 active:bg-secondary/10'
          onClick={closeMenu}
        >
          <Cross2Icon width={18} height={18} fill='#b7c0cd' />
        </Button>
      </div>

      <div className='flex flex-col items-center gap-2'>
        {sidebarMenuList.map((item) => (
          <React.Fragment key={item.path}>
            <Link
              href={item.path}
              onClick={closeMenu}
              className={`w-full p-2 py-[6px] flex gap-2 items-center hover:bg-secondary/20 active:bg-secondary/10 text-[14px] text-secondary-text text-left transition rounded-[4px] ${
                path === item.path && '!bg-secondary/20'
              }`}
            >
              {item.icon}
              {item.text}
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
