import { IMessageResponse, IResponse, IPaginationData, IResponsePagination } from "@/interfaces/http";
import { IndustryType, OrganizationMemberType, OrganizationType } from "@/interfaces/organization";

export interface IGetUserOrganizationResponse extends IResponse<{
  organization: OrganizationType;
}> { }

export interface IGetOrganizationMembersResponse extends IResponsePagination<{
  members: OrganizationMemberType[];
}> { }

export interface IGetOrganizationMembersData extends IPaginationData {
  organizationId: string;
}

export interface ICreateOrganizationResponse extends IMessageResponse<{
  organization: OrganizationType;
}> { }

export interface ICreateOrganizationData {
  data: {
    name: string;
    industry: IndustryType;
    registrationCountry: string;
    website: string;
    corporateEmail: string;
    description?: string;
  };
  file: File | null;
}
