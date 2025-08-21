// types
import { RootState } from '@/redux/store';

const getOrganizationData = (state: RootState) => state.organization;
const getOrganizationId = (state: RootState) => state.organization.id;
const getOrganizationMemberData = (state: RootState) => state.organization.memberData;

const organizationSelectors = {
  getOrganizationData,
  getOrganizationId,
  getOrganizationMemberData
};

export default organizationSelectors;
