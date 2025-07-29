import Modal from '@/components/assets/Modal';
import {
  IOrganizationTaskType,
  TaskWorkStatusEnum,
} from '@/interfaces/organization';
import React, { FC } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  formatloggedTimeDuration,
  handleFormatWorkStatus,
  PriorityBadge,
} from '../../constants';
import { formatDate } from '@/helpers/formatDate';

interface IExpandedTaskModalProps {
  open: boolean;
  onOpenChange: (param: boolean) => void;
  taskData: IOrganizationTaskType;
}

const ExpandedTaskModal: FC<IExpandedTaskModalProps> = ({
  open,
  onOpenChange,
  taskData,
}) => {
  const {
    title,
    descriptopn,
    assignedMember,
    priority,
    deadline,
    createdAt,
    loggedTimeSec,
    startedAt,
    finishedAt,
    workStatus,
  } = taskData;
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title=''
      disableCancelButton
      disableAcceptButton
      dialogContentClassName='!overflow-visible'
    >
      <div className='flex'>
        <div className='w-full'>
          <div>
            <h6 className='text-xl font-semibold pr-2'>{title}</h6>
            <Separator orientation='horizontal' className='mt-3 z-50' />

            <p className='text-muted-foreground text-base font-normal leading-6 max-h-80 overflow-auto pt-3 mr-2'>
              {descriptopn}
            </p>
          </div>
          <Separator orientation='horizontal' className='my-3 z-50' />
          <div className='flex flex-col gap-2'>
            <div className='flex items-center pb-1'>
              {assignedMember.userProfile.avatar ? (
                <img
                  src={assignedMember.userProfile.avatar}
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
                  {assignedMember.userProfile.firstName[0] +
                    assignedMember.userProfile.lastName[0]}
                </div>
              )}
              <span className='ml-2'>{`${assignedMember.userProfile.firstName} ${assignedMember.userProfile.lastName}`}</span>
            </div>

            <div className='flex gap-2 items-center justify-start'>
              <p className='text-sm leading-none font-medium'>Work status:</p>
              <p className='text-muted-foreground text-sm capitalize'>
                {handleFormatWorkStatus(
                  workStatus ? workStatus : TaskWorkStatusEnum.TODO,
                )}
              </p>
            </div>
            <div className='flex gap-2 items-center justify-start'>
              <p className='text-sm leading-none font-medium'>Logged time:</p>
              <p className='text-muted-foreground text-sm capitalize'>
                {formatloggedTimeDuration(loggedTimeSec || 0)}
              </p>
            </div>
            <div className='flex gap-2 items-center justify-start'>
              <p className='text-sm leading-none font-medium'>Started at:</p>
              <p className='text-muted-foreground text-sm capitalize'>
                {startedAt ? formatDate(startedAt) : 'Not started yet'}
              </p>
            </div>
            <div className='flex gap-2 items-center justify-start'>
              <p className='text-sm leading-none font-medium'>Finished at:</p>
              <p className='text-muted-foreground text-sm capitalize'>
                {finishedAt ? formatDate(finishedAt) : 'Not finished yet'}
              </p>
            </div>
          </div>
        </div>

        <div className='bg-border/70 h-full w-1/3 rounded-lg p-3 flex flex-col gap-3'>
          <div className='flex justify-center'>
            <PriorityBadge value={priority} vividColors />
          </div>
          <div>
            <h6 className='text-sm leading-none font-medium'>Created</h6>
            <p className='text-muted-foreground text-sm'>
              {formatDate(createdAt)}
            </p>
          </div>
          <div>
            <h6 className='text-sm leading-none font-medium'>Deadline</h6>
            <p className='text-muted-foreground text-sm'>
              {formatDate(deadline)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExpandedTaskModal;
