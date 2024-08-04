import { toast } from "sonner";

const toastDuration = 3000; //ms

export const successToast = (message: string) => toast.success(message, { duration: toastDuration });

export const errorToast = (message: string) => toast.error(message, { duration: toastDuration });