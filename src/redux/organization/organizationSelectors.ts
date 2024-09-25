// types
import { RootState } from '@/redux/store';

const getOrganizationData = (state: RootState) => state.organization;
const getOrganizationId = (state: RootState) => state.organization.id;

const organizationSelectors = {
  getOrganizationData,
  getOrganizationId
};

export default organizationSelectors;
