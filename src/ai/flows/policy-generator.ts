// PolicyGenerator.ts
'use server';
/**
 * @fileOverview This file contains the Genkit flow for generating API security and governance policies.
 *
 * - generatePolicy - A function that generates API security policies based on the API's functionality, data sensitivity, and compliance requirements.
 * - PolicyGeneratorInput - The input type for the generatePolicy function.
 * - PolicyGeneratorOutput - The return type for the generatePolicy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PolicyGeneratorInputSchema = z.object({
  apiFunctionality: z.string().describe('Description of the API functionality.'),
  dataSensitivity: z.string().describe('Description of the data sensitivity of the API.'),
  complianceRequirements: z.string().describe('Specific compliance requirements for the API (e.g., HIPAA, GDPR).'),
});
export type PolicyGeneratorInput = z.infer<typeof PolicyGeneratorInputSchema>;

const PolicyGeneratorOutputSchema = z.object({
  suggestedPolicies: z.string().describe('A list of suggested API security and governance policies based on the input.'),
});
export type PolicyGeneratorOutput = z.infer<typeof PolicyGeneratorOutputSchema>;

export async function generatePolicy(input: PolicyGeneratorInput): Promise<PolicyGeneratorOutput> {
  return generatePolicyFlow(input);
}

const policyGeneratorPrompt = ai.definePrompt({
  name: 'policyGeneratorPrompt',
  input: {schema: PolicyGeneratorInputSchema},
  output: {schema: PolicyGeneratorOutputSchema},
  prompt: `You are an expert in API security and governance.

  Based on the API's functionality, data sensitivity, and compliance requirements, recommend optimal API security and governance policies.

  API Functionality: {{{apiFunctionality}}}
  Data Sensitivity: {{{dataSensitivity}}}
  Compliance Requirements: {{{complianceRequirements}}}

  Suggested Policies:`, // The model will generate policies following this.
});

const generatePolicyFlow = ai.defineFlow(
  {
    name: 'generatePolicyFlow',
    inputSchema: PolicyGeneratorInputSchema,
    outputSchema: PolicyGeneratorOutputSchema,
  },
  async input => {
    const {output} = await policyGeneratorPrompt(input);
    return output!;
  }
);
