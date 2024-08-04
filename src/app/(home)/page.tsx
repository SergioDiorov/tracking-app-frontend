'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { logout } from '@/redux/auth/authSlice';
import { userLogout } from '@/redux/user/userSlice';
import { useAppDispatch } from '@/redux/hooks';
import { successToast } from '@/helpers/toastActions';

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(userLogout());
    successToast('Successful sign out');
  };
  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen bg-gray-300 gap-3'>
      <h1 className='text-center text-gray-800 text-[40px] font-semibold'>
        Home page
      </h1>
      <div className='flex justify-center items-center w-full max-w-[200px] bg-gray-300 gap-3'>
        <Button onClick={() => router.push('/signUp')}>Go to SignUp</Button>
        <Button onClick={() => router.push('/signIn')}>Go to SignIn</Button>
      </div>
      <Button className='w-[100px]' onClick={handleLogOut}>
        Sign Out
      </Button>
    </div>
  );
};

export default Home;
