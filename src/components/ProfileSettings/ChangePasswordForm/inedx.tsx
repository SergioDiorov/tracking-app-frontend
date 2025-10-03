// react
import React from 'react';

// components
import { Form } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FormFieldPassword from '@/components/ui/custom/password-input';
import { useForm } from 'react-hook-form';
import { LoaderIcon } from 'lucide-react';

// api
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth/authApi';

// healpers
import { errorToast, successToast } from '@/helpers/toastActions';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordSchemaType } from './schema';

const ChangePasswordForm = () => {
  // form
  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const {
    reset,
    formState: { isDirty, errors },
    handleSubmit,
    control,
  } = form;

  // reset password mutation
  const { mutate: resetPasswordMutate, isPending: isResetPasswordPending } =
    useMutation({
      mutationFn: (passwordsData: ChangePasswordSchemaType) =>
        authApi.resetPassword(passwordsData),
      mutationKey: ['resetPassword'],
      onSuccess: (response) => {
        if (response?.data) successToast('Password successfully updated');
      },
      onError: (error) => {
        errorToast(error.message ?? 'Error while updating password');
      },
      onSettled: () => reset({}),
    });

  // submit handler
  const onSubmit = async (values: ChangePasswordSchemaType) => {
    if (!values.oldPassword || !values.newPassword) {
      errorToast('Both old and new passwords must be provided');
      return;
    }
    if (values.oldPassword === values.newPassword) {
      errorToast('New password must be different from old password');
      return;
    }

    resetPasswordMutate(values);
  };

  return (
    <Form {...form}>
      <form
        className='mt-4 flex flex-col gap-4 w-full'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Card className='w-full h-fit p-4'>
          <div className='grid w-full items-center gap-4'>
            <div>
              <h6 className='text-base font-medium text-primary/90'>
                Password
              </h6>
              <p className='text-xs font-medium text-primary/70 mb-3'>
                Modify your account password.
              </p>
              <div className='flex flex-col md:flex-row gap-4 md:gap-3 w-full'>
                <FormFieldPassword
                  control={control}
                  name='oldPassword'
                  label='Current password'
                  placeholder='Set current password'
                />
                <FormFieldPassword
                  control={control}
                  name='newPassword'
                  label='New password'
                  placeholder='Set new password'
                />
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-between flex-wrap gap-4'>
            <div className='w-full mobile:w-auto'>
              <Button
                type='submit'
                className='h-[40px] md:h-[32px] mr-4 mb-4 mobile:mb-0 w-full mobile:w-auto'
                disabled={
                  isResetPasswordPending ||
                  !isDirty ||
                  Object.keys(errors).length > 0
                }
                variant='secondary'
              >
                {isResetPasswordPending
                  ? 'Updating new password'
                  : 'Save new password'}
                {isResetPasswordPending && (
                  <LoaderIcon className='ml-2 h-4 w-4 animate-spin' />
                )}
              </Button>
              <Button
                type='button'
                className='h-[40px] md:h-[32px] w-full mobile:w-auto'
                disabled={
                  isResetPasswordPending ||
                  !isDirty ||
                  Object.keys(errors).length > 0
                }
                onClick={() => reset({})}
                variant='outline'
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;
