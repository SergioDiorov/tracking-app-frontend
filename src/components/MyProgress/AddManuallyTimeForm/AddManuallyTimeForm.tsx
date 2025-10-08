import React, { useEffect, useMemo, useState } from 'react';

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
import { workPreferenceList } from '@/components/auth/constants';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { formatloggedTimeDuration } from '@/components/Organizations/OrganizationsPage/OrganizationPanel/constants';
import { CalendarIcon } from '@radix-ui/react-icons';

// form
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddManuallyTimeSchemaType, getAddManuallyTimeSchema } from './schema';

// redux
import organizationSelectors from '@/redux/organization/organizationSelectors';
import { useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';

// helpers
import { format } from 'date-fns';
import { Angry, Frown, Laugh, Loader2Icon, Meh, Smile } from 'lucide-react';
import { errorToast, successToast } from '@/helpers/toastActions';
import { TaskMoodEnum } from '@/interfaces/taskLogs';
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';

// api
import { useMutation, useQuery } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { tasksLogsApi } from '@/api/tasksLogs/tasksLogsApi';
import {
  CreateTaskParams,
  ExtendedLogDataType,
} from '@/api/tasksLogs/tasksLogsTypes';

const EmojiContainer = ({
  icon: Icon,
  onClick,
  active = false,
}: {
  icon: React.ElementType;
  onClick: () => void;
  active: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full bg-[#fecc31] size-9 hover:bg-[#fecc31]/60  active:bg-[#fecc31]/40  transition ${
        active && ' !bg-[#f8961e]'
      }`}
      type='button'
    >
      <Icon className='rounded-full size-9 scale-[1.2] text-primary/80' />
    </button>
  );
};

const AddManuallyTimeForm = ({
  onClose,
  isEditMode,
  logData,
}: {
  onClose: () => void;
  isEditMode?: boolean;
  logData?: ExtendedLogDataType;
}) => {
  // selectors
  const { id: organizationId, name: organizationName } = useAppSelector(
    organizationSelectors.getOrganizationData,
  );
  const userId = useAppSelector(userSelectors.getUserId);

  // context
  const { timerStartTime, setIsTaskLogAdded } = useMyProgressContext();

  // state
  const [tasksOptions, setTasksOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const organizationOptions = [
    { value: 'personal', label: 'My personal' },
    { value: organizationId, label: organizationName },
  ];

  // form
  const form = useForm<AddManuallyTimeSchemaType>({
    resolver: zodResolver(
      getAddManuallyTimeSchema(timerStartTime || undefined),
    ),
    defaultValues: {
      organization: '',
      task: '',
      date: new Date(),
      type: undefined,
      start: '',
      end: '',
      break: 0,
      note: '',
      mood: undefined,
    },
  });

  const {
    setValue,
    watch,
    formState: { dirtyFields },
  } = form;

  const organizationValue = watch('organization');
  const moodValue = watch('mood');
  const startValue = watch('start');
  const endValue = watch('end');
  const breakValue = watch('break');
  const noteValue = watch('note');

  const selectPlaceholderStyle = 'data-[placeholder]:text-foreground/60';

  const isTaskDeleted = isEditMode && !logData?.task;

  // fetch tasks
  const {
    data: organizationTasksData,
    isLoading: organizationTasksIsLoading,
    isFetching: organizationTasksIsFetching,
  } = useQuery({
    queryKey: ['getOrganizationMemberTasks', organizationValue, userId],
    queryFn: () =>
      organizationsApi.getOrganizationTasks({
        organizationId: organizationValue,
        page: 1,
        limit: 50,
        userId: userId,
      }),
    select: (res) => res.data,
    enabled:
      !!organizationValue &&
      organizationValue !== 'personal' &&
      !!userId &&
      !isEditMode,
  });

  // handle mutation function for create and update log
  const handleMutationFn = (
    values: Partial<AddManuallyTimeSchemaType>,
    apiFn: Function,
  ) => {
    const {
      break: breakValue,
      organization: organizationId,
      date,
      start,
      end,
      ...data
    } = values;

    let normalizedDate: string | undefined;
    if (date) {
      const isoDate = format(date, 'yyyy-MM-dd');
      normalizedDate = new Date(isoDate).toISOString();
    }

    const finalDate = normalizedDate || logData?.date;

    const payload = {
      ...data,
    } as CreateTaskParams;

    if (normalizedDate) {
      payload.date = normalizedDate;
    }

    if (finalDate && start) {
      const startDate = new Date(`${finalDate.split('T')[0]}T${start}:00`);
      payload.start = startDate.toISOString();
    }

    if (finalDate && end) {
      const endDate = new Date(`${finalDate.split('T')[0]}T${end}:00`);
      payload.end = endDate.toISOString();
    }

    if (!isEditMode && organizationId) {
      payload.organizationId = organizationId;
    }

    if (breakValue !== undefined) {
      payload.breakSec = breakValue || 0;
    }

    return apiFn({
      data: payload,
      ...(isEditMode && logData?.id ? { logId: logData.id } : {}),
    });
  };

  // Create log
  const { mutate: createTaskLog, isPending: isCreateTaskLogPending } =
    useMutation({
      mutationFn: (values: AddManuallyTimeSchemaType) =>
        handleMutationFn(values, tasksLogsApi.createTaskLog),
      mutationKey: ['createTaskLog'],
      onSuccess: async (response) => {
        if (response) {
          setIsTaskLogAdded(true);
          successToast('Log successfully added');
          onClose();
        }
      },
      onError: (error: { error: string }) => {
        errorToast(error.error ?? 'Error while adding log');
      },
    });

  // Update log
  const { mutate: updateTaskLog, isPending: isUpdateTaskLogPending } =
    useMutation({
      mutationFn: (values: AddManuallyTimeSchemaType) => {
        const filterValues = Object.keys(dirtyFields).reduce((acc, key) => {
          acc[key] = values[key as keyof AddManuallyTimeSchemaType];
          return acc;
        }, {} as Record<string, any>);

        return handleMutationFn(filterValues, tasksLogsApi.updateTaskLog);
      },
      mutationKey: ['updateTaskLog'],
      onSuccess: async (response) => {
        if (response) {
          setIsTaskLogAdded(true);
          successToast('Log successfully updated');
          onClose();
        }
      },
      onError: (error: { error: string }) => {
        errorToast(error.error ?? 'Error while adding log');
      },
    });

  const onSubmit = (values: AddManuallyTimeSchemaType) => {
    isEditMode && logData ? updateTaskLog(values) : createTaskLog(values);
  };

  // calculate total logged time in seconds
  const totalLoggedSeconds = useMemo(() => {
    if (!startValue || !endValue) return 0;

    const [startHours, startMinutes] = startValue.split(':').map(Number);
    const [endHours, endMinutes] = endValue.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    let diffSeconds = Math.floor(
      (endDate.getTime() - startDate.getTime()) / 1000,
    );

    const breakSeconds = (Number(breakValue) || 0) * 60;
    diffSeconds -= breakSeconds;

    return diffSeconds > 0 ? diffSeconds : 0;
  }, [startValue, endValue, breakValue]);

  // set tasks options when organization tasks data changes
  useEffect(() => {
    if (
      organizationTasksData &&
      organizationTasksData.pagination.totalItems > 0
    ) {
      const tasksOptionsFormat = organizationTasksData.data.tasks.map(
        (item) => ({ value: item.id, label: item.title }),
      );
      setTasksOptions(tasksOptionsFormat);
    }
  }, [organizationTasksData]);

  useEffect(() => {
    if (organizationValue === 'personal') setTasksOptions([]);
  }, [organizationValue]);

  // set form values if in edit mode
  useEffect(() => {
    if (isEditMode && logData) {
      setValue('organization', logData.organization.name);
      setValue('task', logData?.task?.title || 'This task has been deleted');
      setValue('date', new Date(logData.date));
      setValue('type', logData.type);
      setValue('start', format(logData.start, 'HH:mm'));
      setValue('end', format(logData.end, 'HH:mm'));
      setValue('break', logData.breakSec);
      setValue('note', logData.note || undefined);
      setValue('mood', logData.mood || undefined);
    }
  }, [isEditMode, logData]);

  return (
    <Form {...form}>
      <form
        className='mt-4 flex flex-col gap-4 w-full'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Organization Select Field */}
        <div className='w-full'>
          <FormField
            control={form.control}
            name='organization'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  {isEditMode && logData ? (
                    <Input
                      type='text'
                      placeholder='Organization'
                      disabled
                      {...field}
                    />
                  ) : (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      placeholder='Organization'
                      options={organizationOptions}
                      triggerClassName={selectPlaceholderStyle}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Task Select Field */}
        <div className='w-full'>
          <FormField
            control={form.control}
            name='task'
            render={({ field }) => (
              <FormItem>
                <div className='flex w-full gap-1 items-center'>
                  <FormLabel>Task</FormLabel>
                  {(organizationTasksIsLoading ||
                    organizationTasksIsFetching) &&
                    !!organizationValue &&
                    !isEditMode && (
                      <Loader2Icon className='animate-spin size-[12px] relative -top-px' />
                    )}
                </div>
                <FormControl>
                  {isEditMode && logData ? (
                    <Input
                      type='text'
                      placeholder='Task'
                      disabled
                      {...field}
                      className={isTaskDeleted ? '!border-0' : ''}
                    />
                  ) : (
                    <Select
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      placeholder='Task'
                      options={tasksOptions}
                      triggerClassName={selectPlaceholderStyle}
                      disabled={
                        (organizationTasksIsLoading ||
                          organizationTasksIsFetching) &&
                        !!organizationValue
                      }
                      noOptionsMessage={
                        organizationValue
                          ? 'No tasks found'
                          : 'Select organization'
                      }
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date Field */}
        <div className='flex flex-col xs:flex-row gap-3 justify-between w-full'>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className='z-50'>
                <p className='font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs text-left'>
                  Date
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type='button'
                        variant={'outline'}
                        className={`w-full pl-3 text-left font-normal ${
                          !field.value && 'text-muted-foreground'
                        }`}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0 z-[9999]' align='start'>
                    <Calendar
                      mode='single'
                      selected={field.value}
                      onSelect={field.onChange}
                      fromYear={new Date().getFullYear() - 1}
                      toYear={new Date().getFullYear()}
                      disabled={(date) =>
                        date >= new Date(new Date().setHours(24, 0, 0, 0))
                      }
                      captionLayout='dropdown'
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Work Type Field */}
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
                        : logData?.type && isEditMode
                        ? logData.type
                        : ''
                    }
                    onChange={(value) => field.onChange(value)}
                    placeholder='Type'
                    options={workPreferenceList}
                    triggerClassName={selectPlaceholderStyle}
                    selectContentStyle='capitalize'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='w-full flex items-center justify-center gap-4 flex-wrap md:flex-nowrap'>
          {/* Start Time Field */}
          <FormField
            control={form.control}
            name='start'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start time</FormLabel>
                <FormControl>
                  <Input
                    type='time'
                    step='60'
                    placeholder='Start time'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Time Field */}
          <FormField
            control={form.control}
            name='end'
            render={({ field }) => (
              <FormItem>
                <FormLabel>End time</FormLabel>
                <FormControl>
                  <Input
                    type='time'
                    step='60'
                    placeholder='Start time'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Break time Field */}
          <FormField
            control={form.control}
            name='break'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Break(min)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Break time'
                    min={0}
                    max={480}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Logged Time calculation */}
        <div className='flex gap-1 text-xs'>
          <p className='text-primary/80 font-semibold'>Logged time:</p>
          <p className='text-muted-foreground capitalize'>
            {formatloggedTimeDuration(totalLoggedSeconds || 0)}
          </p>
        </div>

        {/* Note Field */}
        <div>
          <FormField
            control={form.control}
            name='note'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Task notes...'
                    className='resize-none h-28'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='-bottom-4 !top-auto' />
              </FormItem>
            )}
          />
          <p
            className={`ml-auto w-fit text-xs mt-1 mr-1 text-primary/80 ${
              (noteValue?.length || 0) > 500 && '!text-[#EF4444]'
            }`}
          >
            {noteValue?.length || 0}/500
          </p>
        </div>

        {/* Mood select */}
        <div className='w-full text-center mt-1'>
          <p className='text-primary/80 text-sm font-semibold'>
            How do you feel?
          </p>
          <div className='flex justify-center w-full max-w-60 m-auto gap-4 mt-2 flex-wrap md:flex-nowrap'>
            <EmojiContainer
              onClick={() =>
                setValue('mood', TaskMoodEnum.ANGRY, { shouldDirty: true })
              }
              icon={Angry}
              active={moodValue === TaskMoodEnum.ANGRY}
            />
            <EmojiContainer
              onClick={() =>
                setValue('mood', TaskMoodEnum.FROWN, { shouldDirty: true })
              }
              icon={Frown}
              active={moodValue === TaskMoodEnum.FROWN}
            />
            <EmojiContainer
              onClick={() =>
                setValue('mood', TaskMoodEnum.MEH, { shouldDirty: true })
              }
              icon={Meh}
              active={moodValue === TaskMoodEnum.MEH}
            />
            <EmojiContainer
              onClick={() =>
                setValue('mood', TaskMoodEnum.SMILE, { shouldDirty: true })
              }
              icon={Smile}
              active={moodValue === TaskMoodEnum.SMILE}
            />
            <EmojiContainer
              onClick={() =>
                setValue('mood', TaskMoodEnum.LAUGH, { shouldDirty: true })
              }
              icon={Laugh}
              active={moodValue === TaskMoodEnum.LAUGH}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 mt-4'>
          <Button
            type='button'
            variant='outline'
            className='w-full h-[40px] md:h-[32px]'
            disabled={isCreateTaskLogPending || isUpdateTaskLogPending}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='w-full h-[40px] md:h-[32px]'
            disabled={isCreateTaskLogPending || isUpdateTaskLogPending}
          >
            {isCreateTaskLogPending || isUpdateTaskLogPending
              ? 'Loading'
              : isEditMode && logData
              ? 'Edit'
              : 'Create'}
            {isCreateTaskLogPending ||
              (isUpdateTaskLogPending && (
                <Loader2Icon className='ml-2 h-4 w-4 animate-spin' />
              ))}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddManuallyTimeForm;
