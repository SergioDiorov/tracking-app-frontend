import React, { FC, useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../form';
import { Input } from '../input';
import { Control } from 'react-hook-form';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';

interface FormFieldPasswordProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
}

const FormFieldPassword: FC<FormFieldPasswordProps> = ({
  control,
  name,
  label,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='relative group'>
          {!!label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              placeholder={placeholder || ''}
              type={showPassword ? 'text' : 'password'}
              autoComplete=''
              {...field}
            />
          </FormControl>
          <FormMessage />

          <button
            className='absolute p-1 bottom-1.5 right-1.5 text-primary/30 group-hover:text-primary/70 transition'
            onClick={() => setShowPassword((prev) => !prev)}
            type='button'
          >
            {showPassword ? (
              <EyeOpenIcon className='size-5' />
            ) : (
              <EyeClosedIcon className='size-5' />
            )}
          </button>
        </FormItem>
      )}
    />
  );
};

export default FormFieldPassword;
