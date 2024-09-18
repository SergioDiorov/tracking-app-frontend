import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { OrganizationType } from '@/interfaces/organization';

const initialState = {
  id: '',
  name: '',
  industry: '',
  registrationCountry: '',
  website: '',
  corporateEmail: '',
  description: null,
  ownerId: '',
  createdAt: '',
  updatedAt: '',
  avatar: null,
} as Omit<OrganizationType, 'industry'> & { industry: any };

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizationData: (state, action: PayloadAction<OrganizationType>) => ({ ...state, ...action.payload }),
    clearOrganizationData: (state) => Object.assign(state, initialState),
  },
});

export const {
  setOrganizationData,
  clearOrganizationData
} = organizationSlice.actions;

export default organizationSlice.reducer;
