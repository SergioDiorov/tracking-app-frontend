'use client';

// react
import React, { useState } from 'react';

// components
import { Card } from '@/components/ui/card';
import {
  organizationMenuItems,
  OrganizationMenuType,
  OrganizationMenuEnum,
} from './constants';
import EmployeesTab from './EmployeesTab';

const OrganizationPanel = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<OrganizationMenuType>(
    OrganizationMenuEnum.EMPLOYEES,
  );
  return (
    <Card className='w-full h-full mt-4 p-4 flex flex-col lg:flex-row'>
      <ul className='flex lg:flex-col justify-start w-full lg:max-w-[15%] gap-2 pb-4 lg:pb-0 lg:pr-4 mb-4 lg:mb-0 lg:mr-4 border-b lg:border-b-0 lg:border-r border-primary/5'>
        {organizationMenuItems.map((item) => (
          <li
            key={item}
            className={`py-1 px-[6px] text-primary-text/80 rounded-[4px] hover:bg-secondary/40 active:bg-secondary/20 cursor-pointer ${
              activeMenuItem === item && '!bg-secondary/50'
            } transition`}
            onClick={() => setActiveMenuItem(item)}
          >
            {item}
          </li>
        ))}
      </ul>

      <div className='w-full'>
        {activeMenuItem === OrganizationMenuEnum.EMPLOYEES && <EmployeesTab />}

        {activeMenuItem === OrganizationMenuEnum.ANALYTICS &&
          OrganizationMenuEnum.ANALYTICS}

        {activeMenuItem === OrganizationMenuEnum.PROGRESS &&
          OrganizationMenuEnum.PROGRESS}

        {activeMenuItem === OrganizationMenuEnum.TASKS &&
          OrganizationMenuEnum.TASKS}
      </div>
    </Card>
  );
};

export default OrganizationPanel;
