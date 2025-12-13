import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const businessSchema = z.object({
  industry: z.string().min(1, 'Industry is required'),
  companyName: z.string().optional(),
  annualRevenue: z.string().min(1, 'Annual revenue is required'),
  employees: z.number().optional(),
  location: z.string().optional(),
});

export const analysisSchema = z.object({
  businessId: z.string().min(1, 'Business ID is required'),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'ANALYZED', 'REPORTED']).optional(),
  riskTolerance: z.enum(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE']).optional(),
  grossRevenue: z.string().optional(),
  operatingExpenses: z.string().optional(),
  debtPayments: z.string().optional(),
  ownerCompensation: z.string().optional(),
  taxObligations: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type BusinessInput = z.infer<typeof businessSchema>;
export type AnalysisInput = z.infer<typeof analysisSchema>;
