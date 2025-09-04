'use client';

// react
import React, { FC, useState } from 'react';

// components
import { Card } from '@/components/ui/card';
import {
  organizationMenuItems,
  OrganizationMenuType,
  OrganizationMenuEnum,
  AnalyticsChildTabsType,
  AnalyticsChildTabsEnum,
  analyticsChildTabsItems,
} from './constants';
import EmployeesTab from './EmployeesTab';
import TasksTab from './TasksTab';
import ProgressTab from './ProgressTab';
import Analytics from './AnalyticsTab';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface IEmployeesTabProps {}

const OrganizationPanel: FC<IEmployeesTabProps> = ({}) => {
  const [activeMenuItem, setActiveMenuItem] = useState<OrganizationMenuType>(
    OrganizationMenuEnum.EMPLOYEES,
  );
  const [activeAnalyticsChildTab, setActiveAnalyticsChildTab] =
    useState<AnalyticsChildTabsType>(AnalyticsChildTabsEnum.MEMBERS);
  const [isOpen, setIsOpen] = useState(false);

  const menuContent = {
    [OrganizationMenuEnum.EMPLOYEES]: <EmployeesTab />,
    [OrganizationMenuEnum.TASKS]: <TasksTab />,
    [OrganizationMenuEnum.PROGRESS]: <ProgressTab />,
    [OrganizationMenuEnum.ANALYTICS]: (
      <Analytics activeAnalyticsChildTab={activeAnalyticsChildTab} />
    ),
  };

  return (
    <Card className='w-full h-full mt-4 p-4 flex flex-col lg:flex-row'>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <ul className='flex h-fit relative lg:flex-col justify-start w-full lg:max-w-[15%] gap-2 pb-4 lg:pb-0 lg:pr-4 mb-4 lg:mb-0 lg:mr-4 border-b lg:border-b-0 lg:border-r border-primary/5 overflow-auto scrollbar'>
          {organizationMenuItems.map((item) => (
            <li
              key={item}
              className={`py-1 px-[6px] text-[14px] font-medium text-primary-text/80 rounded-[4px] hover:bg-secondary/40 active:bg-secondary/20 cursor-pointer ${
                activeMenuItem === item && '!bg-secondary/50'
              } transition`}
              onClick={() => {
                item === OrganizationMenuEnum.ANALYTICS && setIsOpen(true);
                setActiveMenuItem(item);
              }}
            >
              {item}
            </li>
          ))}

          <DropdownMenuTrigger asChild>
            <button className='lg:absolute bottom-0 left-0' />
          </DropdownMenuTrigger>

          <DropdownMenuContent className='lg:relative lg:left-9'>
            <DropdownMenuRadioGroup
              value={activeAnalyticsChildTab}
              onValueChange={(value) =>
                setActiveAnalyticsChildTab(value as AnalyticsChildTabsType)
              }
            >
              {analyticsChildTabsItems.map((item) => (
                <DropdownMenuRadioItem key={item} value={item}>
                  {item}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </ul>
      </DropdownMenu>

      <div className='w-full overflow-auto'>{menuContent[activeMenuItem]}</div>
    </Card>
  );
};

export default OrganizationPanel;
