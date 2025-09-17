export enum workPreferenceEnum {
  OFFICE = "OFFICE",
  REMOTE = "REMOTE",
}

export type WorkPreferenceType = workPreferenceEnum.OFFICE | workPreferenceEnum.REMOTE;

export const workPreferenceList: WorkPreferenceType[] = [workPreferenceEnum.OFFICE, workPreferenceEnum.REMOTE]