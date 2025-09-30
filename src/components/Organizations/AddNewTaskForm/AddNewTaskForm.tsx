'use client';

// react
import React, { FC, useEffect, useState } from 'react';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// icons
import { ReloadIcon } from '@radix-ui/react-icons';

// form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddNewTaskSchemaType, addNewTaskSchema } from './schema';
import { format } from 'date-fns';

// types
import {
  IOrganizationTaskType,
  organizationTaskPriority,
} from '@/interfaces/organization';

// api
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { errorToast, successToast } from '@/helpers/toastActions';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { CreateOrganizationTaskParamsType } from '@/api/organizations/organizationsTypes';

interface IAddNewTaskFormProps {
  organizationId: string;
  closeModal: () => void;
  isEditMode?: boolean;
  taskData?: IOrganizationTaskType;
}

const AddNewTaskForm: FC<IAddNewTaskFormProps> = ({
  organizationId,
  closeModal,
  isEditMode,
  taskData,
}) => {
  const [isAssigneeListOpen, setAssigneeListOpen] = useState<boolean>(false);
  const [isMouseOverAssigneeList, setMouseOverAssigneeList] =
    useState<boolean>(false);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<AddNewTaskSchemaType>({
    resolver: zodResolver(addNewTaskSchema),
    defaultValues: {
      title: '',
      descriptopn: '',
      assignee: '',
      priority: undefined,
      deadline: undefined,
    },
  });
  const assignee = form.watch('assignee');

  const {
    setValue,
    formState: { dirtyFields },
  } = form;

  const {
    data: organizationsMembersData,
    isLoading: isLoadingOrganizationsMembers,
    isPending: isPendingOrganizationsMembers,
  } = useQuery({
    queryKey: ['getOrganizationsMembersSearch', assignee],
    queryFn: () =>
      organizationsApi.getOrganizationMembers({
        organizationId,
        page: 1,
        limit: 5,
        search: assignee || '',
      }),
    select: (res) => res.data,
    enabled: !!organizationId && !!assignee.length,
  });

  const handleMutationFn = (
    values: Partial<AddNewTaskSchemaType>,
    apiFn: Function,
  ) => {
    const { deadline, assignee, ...data } = values;

    const payload = {
      ...data,
    } as CreateOrganizationTaskParamsType;

    if (deadline) {
      const isoDeadline = format(deadline, 'yyyy-MM-dd');
      const normalizedDeadline = new Date(isoDeadline).toISOString();

      payload.deadline = normalizedDeadline;
    }

    if (assignee) {
      payload.assignee = assigneeId || '';
    }

    return apiFn({
      taskData: payload,
      organizationId,
      ...(isEditMode && taskData?.id ? { taskId: taskData.id } : {}),
    });
  };

  // create task
  const { mutate: createOrganizationTask, isPending: isPerndingCreateTask } =
    useMutation({
      mutationFn: (values: AddNewTaskSchemaType) =>
        handleMutationFn(values, organizationsApi.createOrganizationTask),
      mutationKey: ['createOrganizationTask'],
      onSuccess: async (response) => {
        if (response) {
          await queryClient.invalidateQueries({
            queryKey: ['getOrganizationTasks', organizationId],
          });
          await successToast('Task successfully created');
          closeModal();
        }
      },
      onError: (error: { error: string }) => {
        errorToast(error.error ? error.error : 'Error while creating task');
      },
    });

  // update task
  const { mutate: updateOrganizationTask, isPending: isPerndingUpdateTask } =
    useMutation({
      mutationFn: (values: AddNewTaskSchemaType) => {
        const filterValues = Object.keys(dirtyFields).reduce((acc, key) => {
          acc[key] = values[key as keyof AddNewTaskSchemaType];
          return acc;
        }, {} as Record<string, any>);

        return handleMutationFn(
          filterValues,
          organizationsApi.updateOrganizationTask,
        );
      },
      mutationKey: ['updateOrganizationTask'],
      onSuccess: async (response) => {
        if (response) {
          await queryClient.invalidateQueries({
            queryKey: ['getOrganizationTasks', organizationId],
          });
          await successToast('Task successfully updated');
          closeModal();
        }
      },
      onError: (error: { error: string }) => {
        errorToast(error.error ? error.error : 'Error while updating task');
      },
    });

  const onSubmit = (values: AddNewTaskSchemaType) => {
    isEditMode && taskData
      ? updateOrganizationTask(values)
      : createOrganizationTask(values);
  };

  useEffect(() => {
    if (isEditMode && taskData) {
      setValue('title', taskData.title);
      setValue('descriptopn', taskData.descriptopn);
      setValue(
        'assignee',
        taskData.assignedMember.userProfile.firstName +
          ' ' +
          taskData.assignedMember.userProfile.lastName,
      );
      setValue('priority', taskData.priority);
      setValue('deadline', new Date(taskData.deadline));
      setAssigneeId(taskData.assignee);
    }
  }, [isEditMode, taskData]);

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className='mt-4 flex flex-col gap-4 w-full'
      >
        <div className='w-full'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Enter new task title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full relative'>
          <FormField
            control={form.control}
            name='descriptopn'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Add task description'
                    className='resize-none h-28'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='-bottom-4 !top-auto' />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full z-[51]'>
          {/* <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                role='combobox'
                aria-expanded={open}
                className='w-[200px] justify-between'
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)
                      ?.label
                  : 'Select framework...'}
                <ChevronsUpDown className='opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
              <Command>
                <CommandInput
                  placeholder='Search framework...'
                  className='h-9'
                />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {organizationsMembersResponse?.data?.data.members.map(
                      (framework) => (
                        <CommandItem
                          key={framework.id}
                          value={framework.id}
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? '' : currentValue,
                            );
                            setOpen(false);
                          }}
                        >
                          {framework.label}
                          <Check
                            className={cn(
                              'ml-auto',
                              value === framework.value
                                ? 'opacity-100'
                                : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ),
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover> */}
          <div className='relative'>
            <FormField
              control={form.control}
              name='assignee'
              render={({ field }) => (
                <FormItem className='z-50'>
                  <p className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-left'>
                    Assignee
                  </p>
                  <FormControl
                    onFocus={() => setAssigneeListOpen(true)}
                    onBlur={() =>
                      !isMouseOverAssigneeList && setAssigneeListOpen(false)
                    }
                  >
                    <Input placeholder='Search for assignee user' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div
              className={`absolute top-16 left-0 z-50 w-full ${
                !isAssigneeListOpen && 'hidden'
              }`}
              onMouseOver={() => setMouseOverAssigneeList(true)}
              onMouseOut={() => setMouseOverAssigneeList(false)}
            >
              <Card className='shadow-xl'>
                {isLoadingOrganizationsMembers &&
                isPendingOrganizationsMembers ? (
                  <Loader hideText className='p-2' />
                ) : organizationsMembersData?.data.members.length ? (
                  organizationsMembersData?.data.members.map((member) => (
                    <button
                      className='w-full flex items-center py-1 px-[6px] text-[14px] font-medium text-primary-text/80 rounded-[4px] hover:bg-secondary/40 active:bg-secondary/20 cursor-pointer transition'
                      key={member.id}
                      onClick={() => {
                        setAssigneeId(member.user);
                        form.setValue(
                          'assignee',
                          member.userProfile?.firstName +
                            ' ' +
                            member.userProfile?.lastName,
                          { shouldDirty: true },
                        );
                        setAssigneeListOpen(false);
                      }}
                    >
                      {member.userProfile?.avatar ? (
                        <img
                          src={member.userProfile?.avatar}
                          alt='Avatar'
                          className={
                            'max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-secondary object-cover'
                          }
                        />
                      ) : (
                        <div
                          className={
                            'max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-secondary flex justify-center items-center text-[10px] uppercase font-bold text-primary/50'
                          }
                        >
                          {member.userProfile?.firstName[0] ||
                            '' + member.userProfile?.lastName[0] ||
                            ''}
                        </div>
                      )}
                      <p className='ml-2'>
                        {member.userProfile?.firstName +
                          ' ' +
                          member.userProfile?.lastName}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className='w-full text-center my-[17px] py-1 px-[6px] text-[14px] font-medium text-primary-text/80'>
                    No members found
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        <div className='flex flex-col xs:flex-row gap-3 justify-between w-full'>
          <FormField
            control={form.control}
            name='priority'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <Select
                    value={
                      field.value
                        ? field.value
                        : taskData?.priority && isEditMode
                        ? taskData?.priority
                        : ''
                    }
                    onChange={(value) => field.onChange(value)}
                    placeholder='Priority'
                    options={organizationTaskPriority}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='deadline'
            render={({ field }) => (
              <FormItem className='z-50'>
                <p className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-left'>
                  Deadline
                </p>
                <Popover>
                  <PopoverTrigger>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && 'text-muted-foreground'
                        }`}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick deadline date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0 z-[9999]' align='end'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      fromYear={new Date().getFullYear()}
                      toYear={new Date().getFullYear() + 10}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      captionLayout='dropdown'
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex gap-4 mt-4'>
          <Button
            type='button'
            variant='outline'
            className='w-full h-[40px] md:h-[32px]'
            disabled={isPerndingCreateTask || isPerndingUpdateTask}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='w-full h-[40px] md:h-[32px]'
            disabled={isPerndingCreateTask || isPerndingUpdateTask}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPerndingCreateTask || isPerndingUpdateTask
              ? 'Loading'
              : isEditMode
              ? 'Update'
              : 'Create'}
            {isPerndingCreateTask ||
              (isPerndingUpdateTask && (
                <ReloadIcon className='ml-2 h-4 w-4 animate-spin' />
              ))}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNewTaskForm;
