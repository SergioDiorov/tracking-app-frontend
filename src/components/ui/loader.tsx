'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const loaderVariants = cva('flex items-center justify-center', {
  variants: {
    full: {
      true: 'h-screen w-full',
      false: '',
    },
  },
  defaultVariants: {
    full: false,
  },
});

const spinnerVariants = cva(
  'animate-spin rounded-full border-4 border-transparent border-t-primary/80 h-12 w-12',
);

const textVariants = cva('text-primary-text');

type LoaderProps = {
  full?: boolean;
} & React.HTMLProps<HTMLDivElement> &
  VariantProps<typeof loaderVariants>;

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ full = false, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(loaderVariants({ full }), className)}
      {...props}
    >
      <div className='flex flex-col items-center space-y-4'>
        <div className={spinnerVariants()} />
        <p className={textVariants()}>Loading...</p>
      </div>
    </div>
  ),
);

Loader.displayName = 'Loader';

export { Loader };
