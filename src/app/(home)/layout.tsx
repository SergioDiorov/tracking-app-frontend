'use client';

// react
import { useEffect, useState } from 'react';

// components
import TopBar from '@/components/assets/Navigation/TopBar';

// providers
import { PrivateProvider } from '@/providers/PrivateProvider';
import { ReduxProvider } from '@/providers/ReduxProvider';
import Sidebar from '@/components/assets/Navigation/Sidebar';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);
  return (
    <>
      <title>Home</title>
      <ReduxProvider>
        <PrivateProvider>
          <div
            className={`fixed top-0 left-0 w-auto h-full transform overflow-auto ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:hidden z-[64]`}
          >
            <Sidebar closeMenu={() => setMenuOpen(false)} />
          </div>
          {isMenuOpen && (
            <div
              className='fixed inset-0 bg-black opacity-50 z-[63]'
              onClick={() => setMenuOpen(false)}
            />
          )}
          <div className='w-full pt-[60px]'>
            <TopBar openMenu={() => setMenuOpen(true)} />
            <div className='py-6 px-4'>{children}</div>
          </div>
        </PrivateProvider>
      </ReduxProvider>
    </>
  );
};

export default Layout;
