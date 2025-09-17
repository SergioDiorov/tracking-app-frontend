'use client';

// react
import React, { useEffect, useState } from 'react';

// redux
import { useAppSelector } from '@/redux/hooks';
import organizationSelectors from '@/redux/organization/organizationSelectors';
import userSelectors from '@/redux/user/userSelectors';

// api
import { useQuery } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';

// context
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';

// components
import { Card } from '@/components/ui/card';
import Select from '@/components/ui/custom/select';
import { Button } from '@/components/ui/button';
import Modal from '@/components/assets/Modal';
import Timer from './Timer';
import AddManuallyTimeForm from '../AddManuallyTimeForm/AddManuallyTimeForm';
import { Clock8, Loader2Icon, TimerIcon } from 'lucide-react';

const TrackerBar = () => {
  // context
  const {
    selectedTask: selectedTaskContext,
    setSelectedTask: setSelectedTaskContext,
  } = useMyProgressContext();

  // selectors
  const getOrganizationData = useAppSelector(
    organizationSelectors.getOrganizationData,
  );
  const userId = useAppSelector(userSelectors.getUserId);

  // state
  const [selectedOrganization, setSelectedOrganization] = useState<
    string | null
  >(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [tasksOptions, setTasksOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [openAddManuallyModal, setOpenAddManuallyModal] =
    useState<boolean>(false);

  const organizationOptions = [
    { value: 'personal', label: 'My personal' },
    { value: getOrganizationData?.id, label: getOrganizationData.name },
  ];

  // fetch tasks when organization changes
  const {
    data: organizationTasksData,
    isLoading: organizationTasksIsLoading,
    isFetching: organizationTasksIsFetching,
  } = useQuery({
    queryKey: ['getOrganizationMemberTasks', selectedOrganization, userId],
    queryFn: () =>
      organizationsApi.getOrganizationTasks({
        organizationId: selectedOrganization || '',
        page: 1,
        limit: 50,
        userId: userId,
      }),
    select: (res) => res.data,
    enabled:
      !!selectedOrganization && selectedOrganization !== 'personal' && !!userId,
  });

  // use effects
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
    if (selectedOrganization === 'personal') setTasksOptions([]);
  }, [selectedOrganization]);

  useEffect(() => {
    if (selectedTaskContext) {
      setSelectedOrganization(selectedTaskContext.organizationId);
      setSelectedTask(selectedTaskContext.id);
    }
  }, [selectedTaskContext]);

  useEffect(() => {
    if (selectedOrganization || selectedTask) {
      setSelectedTaskContext(null);
    }
  }, [selectedOrganization, selectedTask]);

  const selectPlaceholderStyle = 'data-[placeholder]:text-foreground/60';

  return (
    <div className='flex gap-4 flex-col min-[360px]:flex-row'>
      <Card className='p-4 flex items-center gap-2 w-full flex-col md:flex-row'>
        {/* Clock Icon */}
        <div className='min-w-fit max-w-fit mr-2 hidden md:flex items-center'>
          <Clock8 className='text-primary/50 size-6' />
        </div>

        {/* Select Organization */}
        <div className='md:!max-w-64 !w-full'>
          <Select
            value={selectedOrganization || ''}
            onChange={(value) => setSelectedOrganization(value)}
            placeholder='Organization'
            options={organizationOptions}
            triggerClassName={selectPlaceholderStyle}
          />
        </div>

        {/* Select Task */}
        <div className='md:!max-w-[500px] !w-full relative'>
          {(organizationTasksIsLoading || organizationTasksIsFetching) &&
            !!selectedOrganization && (
              <Loader2Icon className='absolute animate-spin size-[12px] top-0 bottom-0 m-auto right-8' />
            )}
          <Select
            value={selectedTask || ''}
            onChange={(value) => setSelectedTask(value)}
            placeholder='Task'
            options={tasksOptions}
            triggerClassName={selectPlaceholderStyle}
            disabled={
              (organizationTasksIsLoading || organizationTasksIsFetching) &&
              !!selectedOrganization
            }
            noOptionsMessage={
              selectedOrganization ? 'No tasks found' : 'Select organization'
            }
          />
        </div>

        <div className='ml-auto' />

        {/* Timer component */}
        <Timer
          isDisabled={!(selectedTask && selectedOrganization)}
          selectedTask={selectedTask || undefined}
          selectedOrganization={selectedOrganization || undefined}
        />
      </Card>

      {/* Add manually button */}
      <Button
        variant='outline'
        className='h-auto flex items-center justify-center gap-1 rounded-lg border text-base text-primary/80 hover:text-primary/60 group border-[#e5e7eb] shadow-sm'
        onClick={() => setOpenAddManuallyModal(true)}
      >
        <TimerIcon className='relative -top-0.5 text-primary/70 group-hover:text-primary/50' />
        <span className='hidden md:inline-block'>Add manually</span>
      </Button>

      {/* Add manually modal */}
      <Modal
        open={openAddManuallyModal}
        onOpenChange={setOpenAddManuallyModal}
        title='Add manually'
        disableCancelButton
        disableAcceptButton
        dialogContentClassName=' overflow-visible'
      >
        <AddManuallyTimeForm onClose={() => setOpenAddManuallyModal(false)} />
      </Modal>
    </div>
  );
};

export default TrackerBar;
