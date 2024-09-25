'use client';

import React, { FC, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import Select from '@/components/ui/custom/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Card } from '@/components/ui/card';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createOrganizationSchema,
  CreateOrganizationSchemaType,
} from './schema';
import { countriesList } from '@/constants/location.constants';
import { industry, IndustryType } from '@/interfaces/organization';
import { useMutation } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { errorToast, successToast } from '@/helpers/toastActions';
import { useAppDispatch } from '@/redux/hooks';
import { setOrganizationData } from '@/redux/organization/organizationSlice';

interface ICreateOrganizationFormProps {
  closeModal: () => void;
}

const CreateOrganizationForm: FC<ICreateOrganizationFormProps> = ({
  closeModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dispatch = useAppDispatch();

  const form = useForm<CreateOrganizationSchemaType>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: '',
      industry: '' as IndustryType | undefined,
      registrationCountry: '',
      website: '',
      corporateEmail: '',
      description: '',
    },
  });

  const [avatar, setAvatar] = useState<File | null>(null);

  const { mutate: createOrganizationMutate, isPending } = useMutation({
    mutationFn: (values: CreateOrganizationSchemaType) =>
      organizationsApi.createOrganization({
        data: values,
        file: avatar,
      }),
    mutationKey: ['createOrganization'],
    onSuccess: (response) => {
      if (response?.data) {
        dispatch(setOrganizationData(response.data.data.organization));
        successToast('Organization successfully created');
        closeModal();
      }
    },
    onError: () => {
      errorToast('Error while creating organization');
      closeModal();
    },
  });

  const onSubmit = (values: CreateOrganizationSchemaType) => {
    createOrganizationMutate(values);
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
  };

  const handleLoadAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setAvatar(selectedFile);
    }
  };

  return (
    <Form {...form}>
      <form className='mt-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col mobile:flex-row justify-between mb-6 gap-4'>
          <div className='flex items-center gap-3'>
            {avatar ? (
              <img
                src={URL.createObjectURL(avatar) || ''}
                alt='Avatar'
                className={`w-[80px] h-[80px] rounded-full bg-secondary object-cover`}
              />
            ) : (
              <div
                className={`w-[80px] h-[80px] rounded-full bg-secondary flex justify-center items-center text-[18px] font-bold text-primary/50`}
              ></div>
            )}
            <div className='flex flex-col justify-center gap-1'>
              <p className='text-base text-primary font-medium'>
                Organization avatar
              </p>
              <p className='text-xs text-primary/80 font-normal'>
                PNG, JPEG, JPG under 4MB
              </p>
            </div>
          </div>
          <div className='flex mobile:flex-col gap-3 w-full mobile:w-auto'>
            <Button
              className='h-[40px] md:h-[32px] w-full mobile:w-auto'
              variant='outline'
              type='button'
              onClick={handleLoadAvatarClick}
            >
              Add avatar
            </Button>
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
            />
            <Button
              className='h-[40px] md:h-[32px] w-full mobile:w-auto'
              variant='secondary'
              onClick={handleDeleteAvatar}
              type='button'
              disabled={!avatar}
            >
              Remove
            </Button>
          </div>
        </div>

        <div className='grid w-full items-center gap-4 mb-4'>
          <div className='flex flex-col md:flex-row gap-4 md:gap-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Compnay name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='industry'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      placeholder='Organization industry'
                      options={industry}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='grid w-full items-center gap-4 md:gap-5 mb-4'>
          <div className='flex flex-col space-y-1.5 w-full'>
            <FormField
              control={form.control}
              name='registrationCountry'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration country</FormLabel>
                  <FormControl>
                    <Controller
                      name='registrationCountry'
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          placeholder='Registration country'
                          options={countriesList}
                          selectContentStyle={'max-h-[300px]'}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-4 md:gap-2 mb-4'>
          <FormField
            control={form.control}
            name='website'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder='Website (url)' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='corporateEmail'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Corporate email</FormLabel>
                <FormControl>
                  <Input placeholder='Corporate email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col md:flex-row gap-4 md:gap-2 mb-8'>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder='Description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex gap-4'>
          <Button
            type='button'
            variant='outline'
            className='w-full h-[40px] md:h-[32px]'
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='w-full h-[40px] md:h-[32px]'
            disabled={isPending}
          >
            {isPending ? 'Loading' : 'Create'}
            {isPending && <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOrganizationForm;
