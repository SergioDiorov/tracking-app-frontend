'use client';

// next
import { useRouter } from 'next/navigation';

// components
import { Button } from '@/components/ui/button';

// redux
import { logout } from '@/redux/auth/authSlice';
import { userLogout } from '@/redux/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';

// helpers
import { successToast } from '@/helpers/toastActions';

const Home = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const userData = useAppSelector(userSelectors.getUserData);

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

      <div className='flex flex-col gap-2 mt-3'>
        <p className='font-semibold text-left text-sm text-gray-600'>
          User: {userData.firstName} {userData.lastName}
        </p>
        <p className='font-semibold text-left text-sm text-gray-600'>
          Age: {userData.age}
        </p>
        <p className='font-semibold text-left text-sm text-gray-600'>
          Location: {userData.country}, {userData.city}
        </p>
      </div>
    </div>
  );
};

export default Home;
