import { useContext } from 'react';
import { MyProgressContext } from './MyProgressContext';

export const useMyProgressContext = () => {
  const context = useContext(MyProgressContext);
  if (!context) {
    throw new Error(
      'useMyProgressContext must be used within a MyProgressProvider',
    );
  }
  return context;
};
