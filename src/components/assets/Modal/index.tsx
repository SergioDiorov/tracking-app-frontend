import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FC } from 'react';

interface IModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  cancelButtonText?: string;
  acceptButtonText?: string;
  onCancel?: () => void;
  onAccept?: () => void;
  children: React.ReactNode;
}

const Modal: FC<IModalProps> = ({
  open,
  onOpenChange,
  title,
  description,
  cancelButtonText,
  acceptButtonText,
  onCancel,
  onAccept,
  children,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {children}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onOpenChange(false);
              onCancel && onCancel();
            }}
          >
            {cancelButtonText ? cancelButtonText : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onOpenChange(false);
              onAccept && onAccept();
            }}
          >
            {acceptButtonText ? acceptButtonText : 'Accept'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;
