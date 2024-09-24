import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  disableAcceptButton?: boolean;
  disableCancelButton?: boolean;
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
  disableAcceptButton,
  disableCancelButton,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {children}
        </DialogHeader>
        <DialogFooter>
          {!disableCancelButton && (
            <Button
              variant='secondary'
              onClick={() => {
                onOpenChange(false);
                onCancel && onCancel();
              }}
            >
              {cancelButtonText ?? 'Cancel'}
            </Button>
          )}
          {!disableAcceptButton && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onAccept && onAccept();
              }}
            >
              {acceptButtonText ?? 'Accept'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
