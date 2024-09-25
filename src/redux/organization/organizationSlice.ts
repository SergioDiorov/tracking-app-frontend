import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { IndustryType, IOrganizationType } from '@/interfaces/organization';

const initialState = {
  id: '',
  name: '',
  industry: '' as IndustryType,
  registrationCountry: '',
  website: '',
  corporateEmail: '',
  description: null,
  ownerId: '',
  createdAt: '',
  updatedAt: '',
  avatar: null,
} as IOrganizationType;

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizationData: (state, action: PayloadAction<IOrganizationType>) => ({ ...state, ...action.payload }),
    clearOrganizationData: (state) => Object.assign(state, initialState),
  },
});

export const {
  setOrganizationData,
  clearOrganizationData
} = organizationSlice.actions;

export default organizationSlice.reducer;
