import { z } from 'zod';

import { lettersAndSpacesRegex } from '@/constants/regex';
import { industry, IndustryEnum, IndustryType } from '@/interfaces/organization';
import { defaultConstants, organizationDescriptionConstants, organizationNameConstants } from '@/constants/schemaConstants';

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(organizationNameConstants.minLength, { message: 'Name is required' })
    .max(organizationNameConstants.maxLength, { message: 'Name is too long' })
    .regex(lettersAndSpacesRegex, { message: 'Name must be only letters and spaces' })
    .trim(),
  industry: z
    .enum(Object.values(IndustryEnum) as [IndustryType, ...IndustryType[]])
    .refine((value: IndustryType) => industry.includes(value), {
      message: `Industry must be one of the following: ${industry.join(', ')}`,
    }),
  registrationCountry: z
    .string()
    .min(defaultConstants.minLength, { message: 'Registration country is required' })
    .max(defaultConstants.maxLength, { message: 'Registration country is too long' })
    .trim(),
  website: z
    .string()
    .url({ message: 'Website must be a valid URL' }),

  corporateEmail: z
    .string()
    .email({ message: 'Corporate email must be a valid email address' }),
  description: z
    .string()
    .max(organizationDescriptionConstants.maxLength, { message: 'Description is too long' })
    .optional(),
})

export type CreateOrganizationSchemaType = z.infer<typeof createOrganizationSchema>