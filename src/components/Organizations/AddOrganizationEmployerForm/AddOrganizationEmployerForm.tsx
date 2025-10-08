'use client';

// react
import React, { FC, useEffect } from 'react';

// components
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

// icons
import { ReloadIcon } from '@radix-ui/react-icons';

// form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddOrganizationMemberSchemaType,
  addOrganizationMemberSchema,
} from './schema';

// types
import {
  IOrganizationMemberType,
  organizationUserPosition,
  OrganizationUserPositionType,
  organizationUserRole,
  OrganizationUserRoleType,
  organizationUserType,
  OrganizationUserTypeType,
} from '@/interfaces/organization';

// constants
import { organizationMemberConstants } from '@/constants/schemaConstants';

// api
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { errorToast, successToast } from '@/helpers/toastActions';
import { OrganizationMemberDataType } from '@/api/organizations/organizationsTypes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IAddOrganizationEmployerFormProps {
  organizationId: string;
  closeModal: () => void;
  isEditMode?: boolean;
  memberData?: IOrganizationMemberType;
}

const AddOrganizationEmployerForm: FC<IAddOrganizationEmployerFormProps> = ({
  organizationId,
  closeModal,
  isEditMode,
  memberData,
}) => {
  const queryClient = useQueryClient();

  const form = useForm<AddOrganizationMemberSchemaType>({
    resolver: zodResolver(addOrganizationMemberSchema),
    defaultValues: {
      email: '',
      position: '' as OrganizationUserPositionType,
      role: '' as OrganizationUserRoleType,
      workSchedule: '',
      workHours: undefined,
      type: '' as OrganizationUserTypeType,
      salary: undefined,
      experienceMonth: undefined,
      experienceYears: undefined,
    },
  });

  const {
    setValue,
    formState: { dirtyFields },
  } = form;

  const handleMutationFn = (
    values: Partial<AddOrganizationMemberSchemaType>,
    apiFn: Function,
  ) => {
    const { experienceMonth, experienceYears, ...restValues } = values;

    const payload = {
      ...restValues,
    } as OrganizationMemberDataType;

    if (experienceYears || experienceMonth) {
      const years =
        experienceYears ||
        Math.floor((memberData?.workExperienceMonth || 0) / 12) ||
        0;
      const months =
        experienceMonth || (memberData?.workExperienceMonth || 0) % 12 || 0;

      const totalExperience = years * 12 + months;

      payload.workExperienceMonth = totalExperience;
    }

    return apiFn({
      organizationId,
      userData: payload,
      ...(isEditMode && memberData?.user
        ? { userToUpdate: memberData?.user }
        : {}),
    });
  };

  const {
    mutate: addUserToOrganization,
    isPending: addUserToOrganizationIsPending,
  } = useMutation({
    mutationFn: (values: AddOrganizationMemberSchemaType) =>
      handleMutationFn(values, organizationsApi.addUserToOrganization),
    mutationKey: ['addUserToOrganization'],
    onSuccess: async (response) => {
      if (response) {
        await queryClient.invalidateQueries({
          queryKey: ['getOrganizationsMembers', organizationId],
        });
        successToast('User successfully added');
        closeModal();
      }
    },
    onError: (error: { error: string }) => {
      errorToast(
        error.error ? error.error : 'Error while adding user to organization',
      );
    },
  });

  // edit user
  const {
    mutate: updateUserFromOrganization,
    isPending: isPendingUserFromOrganization,
  } = useMutation({
    mutationFn: (values: AddOrganizationMemberSchemaType) => {
      const filterValues = Object.keys(dirtyFields).reduce((acc, key) => {
        acc[key] = values[key as keyof AddOrganizationMemberSchemaType];
        return acc;
      }, {} as Record<string, any>);

      return handleMutationFn(
        filterValues,
        organizationsApi.updateUserFromOrganization,
      );
    },
    mutationKey: ['updateUserFromOrganization'],
    onSuccess: async (response) => {
      if (response) {
        await queryClient.invalidateQueries({
          queryKey: ['getOrganizationsMembers', organizationId],
        });
        successToast('User successfully updated');
        closeModal();
      }
    },
    onError: (error: { error: string }) => {
      errorToast(
        error.error
          ? error.error
          : 'Error while updating user from organization',
      );
    },
  });

  const onSubmit = (values: AddOrganizationMemberSchemaType) => {
    isEditMode
      ? updateUserFromOrganization(values)
      : addUserToOrganization(values);
  };

  useEffect(() => {
    if (isEditMode && memberData) {
      const years = Math.floor(memberData.workExperienceMonth / 12);
      const months = memberData.workExperienceMonth % 12;

      setValue('email', memberData.email);
      setValue('position', memberData.position);
      setValue('role', memberData.role);
      setValue('workSchedule', memberData.workSchedule);
      setValue('workHours', memberData.workHours);
      setValue('type', memberData.type);
      setValue('salary', memberData.salary);
      setValue('experienceMonth', months);
      setValue('experienceYears', years);
    }
  }, [isEditMode, memberData]);

  const isPending =
    addUserToOrganizationIsPending || isPendingUserFromOrganization;

  return (
    <Form {...form}>
      <form
        className='mt-4 flex flex-col gap-4 w-full'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='w-full'>
          {isEditMode && memberData ? (
            <div className='flex items-center gap-1.5'>
              <Avatar>
                <AvatarImage
                  src={memberData.userProfile?.avatar || ''}
                  alt='Avatar'
                  className='opacity-100 hover:opacity-80 transition w-full size-8 max-w-8 max-h-8 rounded-full'
                />
                <AvatarFallback>
                  {memberData?.userProfile?.firstName[0] ||
                    '' + memberData?.userProfile?.lastName[0] ||
                    ''}
                </AvatarFallback>
              </Avatar>
              <p className='text-primary/90 font-medium'>
                {memberData.userProfile?.firstName}{' '}
                {memberData.userProfile?.lastName}
              </p>
            </div>
          ) : (
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User email</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter user email to add' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className='w-full'>
          <FormField
            control={form.control}
            name='position'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Select
                    value={
                      field.value
                        ? field.value
                        : memberData?.position && isEditMode
                        ? memberData?.position
                        : ''
                    }
                    onChange={(value) => field.onChange(value)}
                    placeholder='Position'
                    options={organizationUserPosition}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col xs:flex-row gap-3 justify-between w-full'>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    value={
                      field.value
                        ? field.value
                        : memberData?.role && isEditMode
                        ? memberData?.role
                        : ''
                    }
                    onChange={(value) => field.onChange(value)}
                    placeholder='Role'
                    options={organizationUserRole}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select
                    value={
                      field.value
                        ? field.value
                        : memberData?.type && isEditMode
                        ? memberData?.type
                        : ''
                    }
                    onChange={(value) => field.onChange(value)}
                    placeholder='Type'
                    options={organizationUserType}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='workSchedule'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work schedule</FormLabel>
                <FormControl>
                  <Select
                    value={
                      field.value
                        ? field.value
                        : memberData?.workSchedule && isEditMode
                        ? memberData?.workSchedule
                        : ''
                    }
                    onChange={(value) => field.onChange(value)}
                    placeholder='Work schedule'
                    options={['5/2', '4/3', '3/3', '2/2', '1/1', '3/2', '6/1']}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex gap-3 justify-between w-full'>
          <FormField
            control={form.control}
            name='workHours'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work hours</FormLabel>
                <FormControl>
                  <Input
                    placeholder='User work hours'
                    type='number'
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={organizationMemberConstants.workHours.min}
                    max={organizationMemberConstants.workHours.max}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='salary'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Salary'
                    type='number'
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <p className='mb-2 mt-3'>Work experience</p>

          <div className='flex gap-3 justify-between w-full'>
            <FormField
              control={form.control}
              name='experienceYears'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Years'
                      type='number'
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      min={0}
                      max={organizationMemberConstants.experienceYears.max}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='experienceMonth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Months</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Months'
                      type='number'
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      min={0}
                      max={organizationMemberConstants.experienceMonth.max}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className='flex gap-4 mt-4'>
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
            {isPending ? 'Loading' : isEditMode ? 'Edit' : 'Create'}
            {isPending && <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOrganizationEmployerForm;
