'use client';
// react
import React, { useState } from 'react';

// types
import { ExtendedLogDataType } from '@/api/tasksLogs/tasksLogsTypes';
import { TaskMoodEnum } from '@/interfaces/taskLogs';

// components
import { formatloggedTimeDuration } from '@/components/Organizations/OrganizationsPage/OrganizationPanel/constants';
import { Card } from '@/components/ui/card';
import Modal from '@/components/assets/Modal';
import { Button } from '@/components/ui/button';
import AddManuallyTimeForm from '../AddManuallyTimeForm/AddManuallyTimeForm';
import { Angry, Frown, Laugh, Meh, Smile, SquarePen } from 'lucide-react';

// helpers
import { format } from 'date-fns';

// mood icons
const moodIcons = {
  [TaskMoodEnum.ANGRY]: Angry,
  [TaskMoodEnum.FROWN]: Frown,
  [TaskMoodEnum.MEH]: Meh,
  [TaskMoodEnum.SMILE]: Smile,
  [TaskMoodEnum.LAUGH]: Laugh,
};

const LogItem = ({ log }: { log: ExtendedLogDataType }) => {
  // state
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  // log data
  const { breakSec, start, end, task, organization, type, mood, note } = log;
  const startTime = format(new Date(start), 'kk:mm');
  const endTime = format(new Date(end), 'kk:mm');

  // calculate total work seconds
  const totalWorkSeconds =
    Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000) -
    (breakSec || 0);

  // get mood icon
  const MoodIcon = mood ? moodIcons[mood] : null;

  return (
    <Card
      className={'w-full p-4 bg-gray-100/40 flex gap-4 flex-col md:flex-row'}
    >
      <div className='md:border-r pr-4 font-semibold text-sm flex-wrap md:flex-nowrap'>
        <div className='flex gap-0.5 text-primary/80 mb-1'>
          <p>{startTime}</p>
          <span>-</span>
          <p>{endTime}</p>,{' '}
          <p className='pl-0.5 min-w-fit font-normal w-[56px]'>{type}</p>
        </div>
        <p className='text-muted-foreground font-medium'>
          {formatloggedTimeDuration(totalWorkSeconds)}
        </p>
      </div>

      <div className='md:hidden w-full h-px bg-[#e5e7eb]' />

      <div className='md:border-r pr-4 text-sm'>
        <p className='font-semibold text-primary/80 mb-1 w-max max-w-[250px]'>
          {task.title}
        </p>
        <div className='flex w-max items-center text-muted-foreground'>
          {!!organization?.avatar && (
            <img
              src={organization.avatar}
              alt='organization-avatar'
              className='size-[14px] rounded-full object-cover mr-1'
            />
          )}
          <p className='min-w-fit font-medium relative top-px'>
            {organization.name}
          </p>
        </div>
      </div>

      <div className='md:hidden w-full h-px bg-[#e5e7eb]' />

      {!!note && (
        <div className='flex items-start w-full'>
          <p className='text-sm text-muted-foreground font-medium'>{note}</p>
          {!!MoodIcon && (
            <div className='rounded-full bg-[#fecc31] size-[14px] ml-4 mt-[3px]'>
              <MoodIcon className='rounded-full size-[14px] scale-[1.2] text-primary/80' />
            </div>
          )}
        </div>
      )}

      {/* edit log button */}
      <Button
        variant='secondary'
        className='md:hidden w-full text-primary/70 group'
        onClick={() => setOpenEditModal(true)}
      >
        <SquarePen className='text-primary/50 group-hover:text-primary/40 group-active:text-primary/20 transition mr-1' />
      </Button>

      <button
        onClick={() => setOpenEditModal(true)}
        className='hidden md:block ml-auto'
      >
        <SquarePen className='text-primary/50 hover:text-primary/40 active:text-primary/20 transition' />
      </button>

      {/* edit log modal */}
      <Modal
        open={openEditModal}
        onOpenChange={setOpenEditModal}
        title='Edit Log'
        disableCancelButton
        disableAcceptButton
        dialogContentClassName=' overflow-visible'
      >
        <AddManuallyTimeForm
          onClose={() => setOpenEditModal(false)}
          isEditMode
          logData={log}
        />
      </Modal>
    </Card>
  );
};
export default LogItem;
