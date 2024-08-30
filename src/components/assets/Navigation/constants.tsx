// icons
import { HomeIcon } from '@radix-ui/react-icons';
import { Component1Icon } from '@radix-ui/react-icons';
import { TimerIcon } from '@radix-ui/react-icons';
import { GearIcon } from '@radix-ui/react-icons';

export type listItem = {
  text: string;
  path: string;
};

export type sidebarListItem = {
  text: string;
  path: string;
  icon: React.JSX.Element;
};

export enum menuTitle {
  HOME = 'Home',
  ORGANIZATIONS = 'Organizations',
  MY_PROGRESS = 'My Progress',
  PROFILE_SETTINGS = 'Profile Settings',
}

export const menuList: listItem[] = [
  { text: menuTitle.ORGANIZATIONS, path: '/organizations' },
  { text: menuTitle.MY_PROGRESS, path: '/my-progress' },
  { text: menuTitle.PROFILE_SETTINGS, path: '/profile-settings' },
];

export const sidebarMenuList: sidebarListItem[] = [
  {
    text: menuTitle.HOME,
    path: '/',
    icon: <HomeIcon width={18} height={18} fill='#b7c0cd' />,
  },
  {
    text: menuTitle.ORGANIZATIONS,
    path: '/organizations',
    icon: <Component1Icon width={18} height={18} fill='#b7c0cd' />,
  },
  {
    text: menuTitle.MY_PROGRESS,
    path: '/my-progress',
    icon: <TimerIcon width={18} height={18} fill='#b7c0cd' />,
  },
  {
    text: menuTitle.PROFILE_SETTINGS,
    path: '/profile-settings',
    icon: <GearIcon width={18} height={18} fill='#b7c0cd' />,
  },
];
