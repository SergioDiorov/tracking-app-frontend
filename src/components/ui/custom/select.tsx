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
}

const Select: React.FC<ICustomSelectProps> = ({
  value,
  onChange,
  placeholder,
  options,
  selectContentStyle,
}) => {
  return (
    <UiSelect value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={`max-h-[200px] w-full h-full ${
          selectContentStyle ? selectContentStyle : ''
        }`}
      >
        <SelectGroup>
          {options.map((option) => {
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
          })}
        </SelectGroup>
      </SelectContent>
    </UiSelect>
  );
};

export default Select;
