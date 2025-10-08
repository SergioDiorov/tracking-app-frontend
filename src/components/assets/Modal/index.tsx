// react
import { FC } from 'react';

// components
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2Icon } from 'lucide-react';

interface IModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  dialogContentClassName?: string;
  dialogFooterClassName?: string;
  description?: string;
  cancelButtonText?: string;
  acceptButtonText?: string;
  onCancel?: () => void;
  onAccept?: () => void;
  children: React.ReactNode;
  disableAcceptButton?: boolean;
  disableCancelButton?: boolean;
  isCloseOnAccept?: boolean;
  isActionLoading?: boolean;
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
  dialogContentClassName,
  dialogFooterClassName,
  isCloseOnAccept = true,
  isActionLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClassName || ''}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          {children}
        </DialogHeader>
        <DialogFooter className={`gap-2 ${dialogFooterClassName || ''}`}>
          {!disableCancelButton && (
            <Button
              variant='secondary'
              onClick={() => {
                onOpenChange(false);
                onCancel && onCancel();
              }}
              disabled={isActionLoading}
            >
              {cancelButtonText ?? 'Cancel'}
            </Button>
          )}
          {!disableAcceptButton && (
            <Button
              onClick={() => {
                onAccept && onAccept();
                isCloseOnAccept && onOpenChange(false);
              }}
              disabled={isActionLoading}
            >
              {acceptButtonText ?? 'Accept'}
              {isActionLoading && (
                <Loader2Icon className='animate-spin size-4 ml-1 !text-gray-400' />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
