'use client';

// react
import React, { useEffect, useRef, useState } from 'react';

// components
import { Button } from '@/components/ui/button';
import { workPreferenceEnum } from '@/components/auth/constants';
import { Play, Square, Pause } from 'lucide-react';

// api
import { tasksLogsApi } from '@/api/tasksLogs/tasksLogsApi';
import { CreateTaskParams } from '@/api/tasksLogs/tasksLogsTypes';
import { useMutation } from '@tanstack/react-query';

// context
import { useMyProgressContext } from '@/context/MyProgress/useMyProgressContext';

// helpers
import { errorToast, successToast } from '@/helpers/toastActions';

// Timer icon button component
const TimerButton = ({
  onClick,
  icon: Icon,
  isDisabled,
}: {
  onClick: () => void;
  icon: React.ElementType;
  isDisabled: boolean;
}) => {
  return (
    <Button
      variant='outline'
      size='icon'
      className='text-primary/50 hover:text-primary/30'
      onClick={onClick}
      disabled={isDisabled}
    >
      <Icon />
    </Button>
  );
};

const Timer = ({
  isDisabled = false,
  selectedTask,
  selectedOrganization,
}: {
  isDisabled?: boolean;
  selectedTask?: string;
  selectedOrganization?: string;
}) => {
  // context
  const { setIsTaskLogAdded, timerStartTime, setTimerStartTime } =
    useMyProgressContext();

  // state
  const [time, setTime] = useState(0);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [breakStart, setBreakStart] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breakRef = useRef<NodeJS.Timeout | null>(null);

  // Create log
  const { mutate: createTaskLog, isPending: isCreateTaskLogPending } =
    useMutation({
      mutationFn: (payload: CreateTaskParams) =>
        tasksLogsApi.createTaskLog({
          data: payload,
        }),
      mutationKey: ['createTaskLog'],
      onSuccess: async (response) => {
        if (response) {
          setIsTaskLogAdded(true);
          successToast('Log successfully added');
        }
      },
      onError: (error: { error: string }) => {
        errorToast(error.error ?? 'Error while adding log');
      },
    });

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  // Break timer logic
  useEffect(() => {
    if (breakStart) {
      breakRef.current = setInterval(() => {
        setBreakTime((prev) => prev + 1);
      }, 1000);
    } else if (!breakStart && breakRef.current) {
      clearInterval(breakRef.current);
      breakRef.current = null;
    }

    return () => {
      if (breakRef.current) {
        clearInterval(breakRef.current);
      }
    };
  }, [breakStart]);

  // Format time in HH:mm:ss for display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(
      2,
      '0',
    )}:${String(secs).padStart(2, '0')}`;
  };

  const handleCreateLog = async () => {
    if (selectedTask && selectedOrganization) {
      const payload: CreateTaskParams = {
        type: workPreferenceEnum.REMOTE,
        task: selectedTask,
        organizationId: selectedOrganization,
        date: new Date().toISOString(),
        start: timerStartTime
          ? timerStartTime.toISOString()
          : new Date().toISOString(),
        end: new Date().toISOString(),
        breakSec: breakTime,
        note: 'Auto log timer',
      };

      await createTaskLog(payload);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setBreakStart(false);
    if (!timerStartTime) {
      setTimerStartTime(new Date());
    }
  };

  const handlePause = () => {
    setBreakStart(true);
    setIsRunning(false);
  };

  const handleReset = async () => {
    time && (await handleCreateLog());
    setIsRunning(false);
    setBreakStart(false);
    setTimerStartTime(null);
    setTime(0);
    setBreakTime(0);
  };

  // reset timer if disabled or task changes
  useEffect(() => {
    if (isDisabled || selectedTask) {
      handleReset();
    }
  }, [isDisabled, selectedTask]);

  return (
    <div className='flex items-center gap-2 min-[300px]:flex-nowrap flex-wrap justify-center min-[300px]:justify-start'>
      {/* Timer display */}
      <div className='w-full min-[300px]:w-[120px] flex justify-center items-center'>
        <p className='text-2xl font-semibold text-primary/80 text-center w-full font-mono'>
          {formatTime(time)}
        </p>
      </div>

      {isRunning ? (
        <>
          {/* Pause button */}
          <TimerButton
            onClick={handlePause}
            icon={Pause}
            isDisabled={isDisabled || isCreateTaskLogPending}
          />
        </>
      ) : (
        <>
          {/* Start button */}
          <TimerButton
            onClick={handleStart}
            icon={Play}
            isDisabled={isDisabled || isCreateTaskLogPending}
          />
        </>
      )}

      {(time > 0 || isRunning) && (
        <>
          {/* Stop button */}
          <TimerButton
            onClick={handleReset}
            icon={Square}
            isDisabled={isDisabled || isCreateTaskLogPending}
          />
        </>
      )}
    </div>
  );
};

export default Timer;
