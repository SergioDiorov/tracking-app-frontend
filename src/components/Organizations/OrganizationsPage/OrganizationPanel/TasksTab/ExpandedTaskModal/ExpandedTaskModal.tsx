// react
import React, { FC, useState } from 'react';

// components
import Modal from '@/components/assets/Modal';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Select from '@/components/ui/custom/select';

// context
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';

// redux
import { useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';

// helpers
import {
  IOrganizationTaskType,
  taskWorkStatus,
  TaskWorkStatusEnum,
  TaskWorkStatusType,
} from '@/interfaces/organization';
import {
  formatloggedTimeDuration,
  handleFormatWorkStatus,
  PriorityBadge,
} from '../../constants';
import { formatDate } from '@/helpers/formatDate';
import { useIsUserOwnerOrAdmin } from '@/hooks/useOrganizationMemberOwnerOrAdmin';
import { errorToast } from '@/helpers/toastActions';

//api
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsApi } from '@/api/organizations/organizationsApi';
import { Loader2Icon } from 'lucide-react';

interface IExpandedTaskModalProps {
  open: boolean;
  onOpenChange: (param: boolean) => void;
  taskData: IOrganizationTaskType;
  onWorkOnTask?: () => void;
}

const ExpandedTaskModal: FC<IExpandedTaskModalProps> = ({
  open,
  onOpenChange,
  taskData,
  onWorkOnTask,
}) => {
  const queryClient = useQueryClient();

  // context
  const { timerStartTime } = useMyProgressContext();

  // task data destructuring
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
    assignee,
    organizationId,
    id: taskId,
  } = taskData;

  // hooks
  const isOwnerOrAdmin = useIsUserOwnerOrAdmin();
  const userId = useAppSelector(userSelectors.getUserId);
  const [selectedStatus, setSelectedStatus] = useState<TaskWorkStatusType>(
    workStatus || TaskWorkStatusEnum.TODO,
  );

  // update status
  const { mutate: updateOrganizationTask, isPending: isPerndingUpdateTask } =
    useMutation({
      mutationFn: (status: TaskWorkStatusType) =>
        organizationsApi.updateOrganizationTask({
          organizationId,
          taskId,
          taskData: { workStatus: status },
        }),
      mutationKey: ['updateOrganizationTask: status'],
      onSuccess: async (response) => {
        if (response) {
          await queryClient.invalidateQueries({
            queryKey: ['getOrganizationTasks', organizationId],
          });
        }
      },
      onError: (error: { error: string }) => {
        errorToast(error.error ? error.error : 'Error while updating status');
      },
    });

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
          <div className='flex flex-col gap-3 pr-3'>
            <div className='flex items-center '>
              {assignedMember?.userProfile.avatar ? (
                <img
                  src={assignedMember?.userProfile.avatar}
                  alt='Avatar'
                  className={
                    'max-w-[30px] max-h-[30px] min-w-[30px] min-h-[30px] rounded-full bg-secondary object-cover'
                  }
                />
              ) : (
                <div
                  className={
                    'max-w-[34px] max-h-[34px] min-w-[34px] min-h-[34px] rounded-full bg-secondary flex justify-center items-center text-[10px] uppercase font-bold text-primary/50'
                  }
                >
                  {assignedMember &&
                    assignedMember?.userProfile.firstName[0] +
                      assignedMember?.userProfile.lastName[0]}
                </div>
              )}
              {assignedMember ? (
                <span className='ml-2'>{`${assignedMember.userProfile.firstName} ${assignedMember.userProfile.lastName}`}</span>
              ) : (
                <span className='ml-1 text-muted-foreground text-sm leading-[14px]'>
                  Asigned user was removed from organization
                </span>
              )}
            </div>

            <div className='w-full space-y-3 bg-[#eceef1] rounded-lg mr-10 p-3'>
              <div className='flex gap-2 items-center justify-start'>
                <p className='text-sm leading-none font-medium min-w-fit'>
                  Work status:
                </p>

                {isOwnerOrAdmin || assignee === userId ? (
                  <div className='w-full pr-2 relative'>
                    <Select
                      value={selectedStatus}
                      onChange={(value) => {
                        setSelectedStatus(value as TaskWorkStatusType);
                        updateOrganizationTask(value as TaskWorkStatusType);
                      }}
                      placeholder='Type'
                      options={taskWorkStatus}
                      triggerClassName='data-[placeholder]:text-foreground/60 w-full h-8'
                      selectContentStyle='capitalize'
                      disabled={isPerndingUpdateTask}
                    />

                    {isPerndingUpdateTask && (
                      <Loader2Icon className='h-4 w-4 animate-spin absolute top-0 bottom-0.5 right-[38px] m-auto text-[#8f8f8f]' />
                    )}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm capitalize'>
                    {handleFormatWorkStatus(
                      workStatus ? workStatus : TaskWorkStatusEnum.TODO,
                    )}
                  </p>
                )}
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
        </div>

        <div className='w-1/3 flex flex-col gap-4'>
          <div className='bg-border/70 w-full h-full rounded-lg p-3 flex flex-col gap-3 items-center'>
            <div className='flex justify-center'>
              <PriorityBadge value={priority} vividColors />
            </div>
            <div>
              <h6 className='text-sm leading-none font-medium text-center'>
                Created
              </h6>
              <p className='text-muted-foreground text-sm'>
                {formatDate(createdAt)}
              </p>
            </div>
            <div>
              <h6 className='text-sm leading-none font-medium text-center'>
                Deadline
              </h6>
              <p className='text-muted-foreground text-sm'>
                {formatDate(deadline)}
              </p>
            </div>
          </div>
          {onWorkOnTask && (
            <Button
              variant='outline'
              className='mt-auto'
              onClick={onWorkOnTask}
              disabled={!!timerStartTime}
            >
              Work on task
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ExpandedTaskModal;
