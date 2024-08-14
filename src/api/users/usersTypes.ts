import { IResponse } from "@/interfaces/http";
import { ProfileType } from "@/interfaces/response";

export interface IAuthResponse extends IResponse<{
  profile: ProfileType
}> { }
