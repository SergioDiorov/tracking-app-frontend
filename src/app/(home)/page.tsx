'use client';

// react
import { ChangeEvent, useState } from 'react';

// next
import { useRouter } from 'next/navigation';

// components
import { Button } from '@/components/ui/button';

// redux
import { logout } from '@/redux/auth/authSlice';
import { setUserPartialData, userLogout } from '@/redux/user/userSlice';
import { clearOrganizationData } from '@/redux/organization/organizationSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';

// helpers
import { errorToast, successToast } from '@/helpers/toastActions';

// api
import { usersApi } from '@/api/users/usersApi';
import { useMutation } from '@tanstack/react-query';

const Home = () => {
  const [file, setFile] = useState<null | File>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const userData = useAppSelector(userSelectors.getUserData);

  const { mutate } = useMutation({
    mutationFn: (data: { file: File; userId: string }) =>
      usersApi.uploadAvatar(data),
    mutationKey: ['uploadAvatar'],
    onSuccess: (response) => {
      if (response.data.data.avatarUrl) {
        dispatch(setUserPartialData({ avatar: response.data.data.avatarUrl }));
        successToast(response.data.message);
      }
    },
    onError: () => {
      errorToast('Error while Upload avatar');
    },
  });

  const handleLogOut = () => {
    dispatch(logout());
    dispatch(userLogout());
    dispatch(clearOrganizationData());
    successToast('Successful sign out');
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.length ? event.target.files[0] : null);
  };

  const handleUpload = () => {
    if (file) mutate({ file, userId: userData.id });
  };

  return (
    <div className='flex flex-col justify-center items-center h-full gap-3 mt-[100px]'>
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
        {userData.avatar ? (
          <img
            src={userData.avatar}
            alt='avatar'
            className='w-[100px] h-[100px] object-cover rounded-full m-auto bg-slate-200 border border-solid border-slate-300'
          />
        ) : (
          <div className='p-3 bg-gray-400 border border-solid border-gray-800 rounded-[10px]'>
            <input type='file' onChange={handleFileChange} />
            <Button variant='secondary' disabled={!file} onClick={handleUpload}>
              Upload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
