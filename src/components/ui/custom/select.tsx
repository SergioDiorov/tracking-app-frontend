import React from 'react';
import {
  Select as UiSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ICustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[] | string[];
  selectContentStyle?: string;
  triggerClassName?: string;
  disabled?: boolean;
  noOptionsMessage?: string;
}

const Select: React.FC<ICustomSelectProps> = ({
  value,
  onChange,
  placeholder,
  options,
  selectContentStyle,
  triggerClassName = '',
  disabled = false,
  noOptionsMessage,
}) => {
  return (
    <UiSelect value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={`${triggerClassName}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={`max-h-[200px] w-full h-full ${
          selectContentStyle ? selectContentStyle : ''
        }`}
      >
        <SelectGroup>
          {!!options.length ? (
            options.map((option) => {
              if (typeof option === 'string') {
                return (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                );
              } else {
                return (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                );
              }
            })
          ) : (
            <p className='w-full text-center font-medium py-1.5 text-sm text-primary/80'>
              {noOptionsMessage || 'No options'}
            </p>
          )}
        </SelectGroup>
      </SelectContent>
    </UiSelect>
  );
};

export default Select;
