'use server';

import {
  generatePolicy,
  type PolicyGeneratorInput,
} from '@/ai/flows/policy-generator';
import { z } from 'zod';

const policySchema = z.object({
  apiFunctionality: z
    .string()
    .min(20, { message: 'Please describe the API functionality in at least 20 characters.' }),
  dataSensitivity: z
    .string()
    .min(10, { message: 'Please describe the data sensitivity in at least 10 characters.' }),
  complianceRequirements: z
    .string()
    .min(2, { message: 'Please specify compliance requirements (e.g., "none", "HIPAA").' }),
});

export type PolicyState = {
  message?: string | null;
  policy?: string | null;
  errors?: {
    apiFunctionality?: string[];
    dataSensitivity?: string[];
    complianceRequirements?: string[];
  };
};

export async function generateApiPolicy(
  prevState: PolicyState,
  formData: FormData
): Promise<PolicyState> {
  const validatedFields = policySchema.safeParse({
    apiFunctionality: formData.get('apiFunctionality'),
    dataSensitivity: formData.get('dataSensitivity'),
    complianceRequirements: formData.get('complianceRequirements'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed. Please check the fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await generatePolicy(validatedFields.data as PolicyGeneratorInput);
    if (result.suggestedPolicies) {
      return {
        message: 'Policy generated successfully.',
        policy: result.suggestedPolicies,
      };
    } else {
        return { message: 'The AI failed to generate a policy. Please try again with a more detailed description.' };
    }
  } catch (error) {
    console.error(error);
    return {
      message: 'An unexpected error occurred while generating the policy. Please try again later.',
    };
  }
}
