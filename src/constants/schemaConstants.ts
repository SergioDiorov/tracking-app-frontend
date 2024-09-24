export const emailConstants = {
  minLength: 1,
  maxLength: 64
}

export const passwordConstants = {
  minLength: 8,
  maxLength: 64
}

export const nameConstants = {
  minLength: 1,
  maxLength: 64
}

export const organizationNameConstants = {
  minLength: 1,
  maxLength: 100
}

export const organizationDescriptionConstants = {
  maxLength: 500
}

export const defaultConstants = {
  minLength: 1,
  maxLength: 64
}

export const organizationMemberConstants = {
  workHours: {
    min: 1,
    max: 24
  },
  salary: {
    min: 1,
  },
  experienceMonth: {
    min: 0,
    max: 11
  },
  experienceYears: {
    min: 0,
    max: 50
  },
}