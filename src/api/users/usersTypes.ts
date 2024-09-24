import { IResponse } from "@/interfaces/http";
import { IProfileType } from "@/interfaces/response";

export interface IGetUserByIdResponse extends IResponse<{
  profile: IProfileType;
}> { }

export interface IUpdateProfileResponse extends IResponse<{
  profile: IProfileType;
}> { }

export interface IUpdateProfileData {
  updateProfileData: {
    email?: string;
    oldPassword?: string;
    newPassword?: string;
    firstName?: string;
    lastName?: string;
    age?: string;
    country?: string;
    city?: string;
    workPreference?: string;
  };
  userId: string;
}

export interface IUploadAvatarResponse extends IResponse<{
  avatarUrl: string;
}> { message: string; }