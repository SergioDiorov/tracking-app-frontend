import React, { useState } from 'react';

// components
import { Card } from '@/components/ui/card';
import {
  formatloggedTimeDuration,
  generatePriorityBgColor,
  handleFormatWorkStatus,
} from '@/components/Organizations/OrganizationsPage/OrganizationPanel/constants';
import ExpandedTaskModal from '@/components/Organizations/OrganizationsPage/OrganizationPanel/TasksTab/ExpandedTaskModal/ExpandedTaskModal';

// interface
import {
  IOrganizationTaskType,
  TaskWorkStatusEnum,
} from '@/interfaces/organization';

// context
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';

const AssignedUserTaskItem = ({ task }: { task: IOrganizationTaskType }) => {
  // context
  const { setSelectedTask } = useMyProgressContext();

  // state
  const { priority, title, loggedTimeSec } = task;
  const [openTaskModal, setOpenTaskModal] = useState<boolean>(false);

  return (
    <>
      {/* Task info card */}
      <Card
        className={`p-2.5 max-w-[150px] hover:cursor-pointer hover:bg-opacity-60 active:bg-opacity-20 transition ${
          priority ? generatePriorityBgColor({ value: priority }) : '#f3f4f6'
        }`}
        onClick={() => setOpenTaskModal(true)}
      >
        <div className='text-xs font-medium truncate'>{title}</div>
        <div className='text-xs text-muted-foreground'>
          <span>Status:</span>
          <span className='font-semibold pl-1'>
            {handleFormatWorkStatus(
              task?.workStatus || TaskWorkStatusEnum.TODO,
            )}
          </span>
        </div>
        <div className='text-xs text-muted-foreground'>
          <span>Time:</span>
          <span className='font-semibold pl-1'>
            {formatloggedTimeDuration(loggedTimeSec || 0)}
          </span>
        </div>
      </Card>

      {/* Modal for expanded task details */}
      <ExpandedTaskModal
        open={openTaskModal}
        onOpenChange={setOpenTaskModal}
        taskData={task}
        onWorkOnTask={() => {
          setSelectedTask(task);
          setOpenTaskModal(false);
        }}
      />
    </>
  );
};

export default AssignedUserTaskItem;
