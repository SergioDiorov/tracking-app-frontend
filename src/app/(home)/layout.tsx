import { PrivateProvider } from '@/providers/PrivateProvider';
import { ReduxProvider } from '@/providers/ReduxProvider';

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <title>Home</title>
      <ReduxProvider>
        <PrivateProvider>{children}</PrivateProvider>
      </ReduxProvider>
    </>
  );
};

export default Layout;
