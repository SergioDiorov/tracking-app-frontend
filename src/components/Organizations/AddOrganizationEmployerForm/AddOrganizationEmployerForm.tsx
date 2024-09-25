'use client';

// react
import React, { FC } from 'react';

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
import { useMutation } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { errorToast, successToast } from '@/helpers/toastActions';

interface IAddOrganizationEmployerFormProps {
  organizationId: string;
  closeModal: () => void;
  setEmployeesChanged: () => void;
}

const AddOrganizationEmployerForm: FC<IAddOrganizationEmployerFormProps> = ({
  organizationId,
  closeModal,
  setEmployeesChanged,
}) => {
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

  const { mutate: addUserToOrganization, isPending } = useMutation({
    mutationFn: (values: AddOrganizationMemberSchemaType) => {
      const { experienceMonth, experienceYears, ...restValues } = values;
      const totalExperience =
        (experienceYears || 0) * 12 + (experienceMonth || 0);

      return organizationsApi.addUserToOrganization({
        organizationId,
        userData: { ...restValues, workExperienceMonth: totalExperience },
      });
    },
    mutationKey: ['addUserToOrganization'],
    onSuccess: (response) => {
      if (response) {
        setEmployeesChanged();
        successToast('User successfully added');
        closeModal();
      }
    },
    onError: (error: { error: string }) => {
      errorToast(
        error.error ? error.error : 'Error while creating organization',
      );
    },
  });

  const onSubmit = (values: AddOrganizationMemberSchemaType) => {
    addUserToOrganization(values);
  };

  return (
    <Form {...form}>
      <form
        className='mt-4 flex flex-col gap-4 w-full'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='w-full'>
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
                    value={field.value}
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
                    value={field.value}
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
                    value={field.value}
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
                    value={field.value}
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
            {isPending ? 'Loading' : 'Create'}
            {isPending && <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOrganizationEmployerForm;
