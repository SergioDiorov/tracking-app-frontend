import { useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';
import organizationSelectors from '@/redux/organization/organizationSelectors';

export const useIsUserOrganizationOwner = () => {
  const userId = useAppSelector(userSelectors.getUserId);

  const organizationOwnerId = useAppSelector(
    organizationSelectors.getOrganizationData,
  ).ownerId;

  return userId === organizationOwnerId;
};
