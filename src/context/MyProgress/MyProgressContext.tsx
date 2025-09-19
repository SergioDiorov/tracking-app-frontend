import { IOrganizationTaskType } from '@/interfaces/organization';
import { createContext, useState } from 'react';

interface MyProgressContextType {
  selectedTask: IOrganizationTaskType | null;
  setSelectedTask: (task: IOrganizationTaskType | null) => void;
  isTaskLogAdded: boolean;
  setIsTaskLogAdded: (task: boolean) => void;
  timerStartTime: Date | null;
  setTimerStartTime: (task: Date | null) => void;
}

export const MyProgressContext = createContext<
  MyProgressContextType | undefined
>(undefined);

interface MyProgressProviderProps {
  children: React.ReactNode;
}

export const MyProgressProvider = ({ children }: MyProgressProviderProps) => {
  const [selectedTask, setSelectedTask] =
    useState<null | IOrganizationTaskType>(null);
  const [isTaskLogAdded, setIsTaskLogAdded] = useState<boolean>(false);
  const [timerStartTime, setTimerStartTime] = useState<Date | null>(null);

  return (
    <MyProgressContext.Provider
      value={{
        selectedTask,
        setSelectedTask,
        isTaskLogAdded,
        setIsTaskLogAdded,
        timerStartTime,
        setTimerStartTime,
      }}
    >
      {children}
    </MyProgressContext.Provider>
  );
};
