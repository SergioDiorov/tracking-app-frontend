import TopBar from '@/components/assets/TopBar';
import { PrivateProvider } from '@/providers/PrivateProvider';
import { ReduxProvider } from '@/providers/ReduxProvider';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <title>Home</title>
      <ReduxProvider>
        <PrivateProvider>
          <div className='pt-[60px]'>
            <TopBar />
            <div className='py-6 px-4'>{children}</div>
          </div>
        </PrivateProvider>
      </ReduxProvider>
    </>
  );
};

export default Layout;
