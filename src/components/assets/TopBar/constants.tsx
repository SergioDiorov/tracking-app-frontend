export type listItem = {
  text: string;
  path: string;
};

export enum menuTitle {
  ORGANIZATIONS = 'Organizations',
  MY_PROGRESS = 'My Progress',
  PROFILE_SETTINGS = 'Profile Settings',
}

export const menuList: listItem[] = [
  { text: menuTitle.ORGANIZATIONS, path: '/organizations' },
  { text: menuTitle.MY_PROGRESS, path: '/my-progress' },
  { text: menuTitle.PROFILE_SETTINGS, path: '/profile-settings' },
];
