import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import { IndustryType, IOrganizationMemberType, IOrganizationType } from '@/interfaces/organization';

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
  memberData: null,
} as IOrganizationType & { memberData: IOrganizationMemberType | null };

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    setOrganizationData: (state, action: PayloadAction<IOrganizationType>) => ({ ...state, ...action.payload }),
    setOrganizationMemberData: (state, action: PayloadAction<IOrganizationMemberType>) => ({ ...state, memberData: action.payload }),
    clearOrganizationData: (state) => Object.assign(state, initialState),
  },
});

export const {
  setOrganizationData,
  clearOrganizationData,
  setOrganizationMemberData
} = organizationSlice.actions;

export default organizationSlice.reducer;
