import { IResponse } from "@/interfaces/http";
import { ProfileType } from "@/interfaces/response";

export interface IGetUserByIdResponse extends IResponse<{
  profile: ProfileType;
}> { }

export interface IUpdateProfileResponse extends IResponse<{
  profile: ProfileType;
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