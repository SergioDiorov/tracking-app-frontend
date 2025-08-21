import { useAppSelector } from '@/redux/hooks';
import userSelectors from '@/redux/user/userSelectors';
import organizationSelectors from '@/redux/organization/organizationSelectors';
import { OrganizationUserRoleEnum } from '@/interfaces/organization';

export const useIsUserOwnerOrAdmin = () => {
  const userId = useAppSelector(userSelectors.getUserId);
  const organizationMemberData = useAppSelector(
    organizationSelectors.getOrganizationMemberData,
  );
  const organizationOwnerId = useAppSelector(
    organizationSelectors.getOrganizationData,
  ).ownerId;

  return (
    userId === organizationOwnerId ||
    organizationMemberData?.role === OrganizationUserRoleEnum.ADMIN
  );
};
