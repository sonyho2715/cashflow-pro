'use server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { Prisma, RiskTolerance } from '@/app/generated/prisma/client';

function parseDecimal(value: string | null | undefined): Prisma.Decimal | null {
  if (!value) return null;
  const cleaned = value.replace(/[$,]/g, '');
  return new Prisma.Decimal(cleaned || '0');
}

// Risk tolerance multipliers
const RISK_MULTIPLIERS: Record<RiskTolerance, number> = {
  CONSERVATIVE: 0.5,
  MODERATE: 0.75,
  AGGRESSIVE: 1.0,
};

export async function runAnalysis(analysisId: string, formData: FormData) {
  try {
    const session = await requireAuth();

    const grossRevenue = parseDecimal(formData.get('grossRevenue') as string);
    const operatingExpenses = parseDecimal(formData.get('operatingExpenses') as string);
    const debtPayments = parseDecimal(formData.get('debtPayments') as string);
    const ownerCompensation = parseDecimal(formData.get('ownerCompensation') as string);
    const taxObligations = parseDecimal(formData.get('taxObligations') as string);
    const riskTolerance = (formData.get('riskTolerance') as RiskTolerance) || 'MODERATE';

    // Calculate discretionary cash flow
    const gross = Number(grossRevenue) || 0;
    const expenses = Number(operatingExpenses) || 0;
    const debt = Number(debtPayments) || 0;
    const owner = Number(ownerCompensation) || 0;
    const tax = Number(taxObligations) || 0;

    const discretionaryCashFlow = gross - expenses - debt - owner - tax;
    const multiplier = RISK_MULTIPLIERS[riskTolerance];
    const recommendedPremium = discretionaryCashFlow * multiplier;

    // Calculate affordability score (0-100)
    let affordabilityScore = 0;
    if (gross > 0) {
      const ratio = discretionaryCashFlow / gross;
      affordabilityScore = Math.min(100, Math.max(0, Math.round(ratio * 200)));
    }

    // Generate recommendation
    let recommendation = '';
    if (affordabilityScore >= 75) {
      recommendation = 'Safe to Proceed - Strong financial position with healthy discretionary cash flow.';
    } else if (affordabilityScore >= 50) {
      recommendation = 'Moderate Risk - Adequate cash flow, consider conservative premium options.';
    } else if (affordabilityScore >= 25) {
      recommendation = 'Caution Advised - Limited discretionary income, recommend thorough review.';
    } else {
      recommendation = 'High Risk - Insufficient cash flow for recommended premium levels.';
    }

    const analysis = await db.analysis.update({
      where: {
        id: analysisId,
        userId: session.userId,
      },
      data: {
        status: 'ANALYZED',
        riskTolerance,
        grossRevenue,
        operatingExpenses,
        debtPayments,
        ownerCompensation,
        taxObligations,
        discretionaryCashFlow: new Prisma.Decimal(discretionaryCashFlow),
        recommendedPremium: new Prisma.Decimal(recommendedPremium),
        affordabilityScore,
        recommendation,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: analysis };
  } catch (error) {
    console.error('Run analysis error:', error);
    return { success: false, error: 'Failed to run analysis' };
  }
}

export async function updateAnalysisStatus(
  analysisId: string,
  status: 'DRAFT' | 'IN_PROGRESS' | 'ANALYZED' | 'REPORTED'
) {
  try {
    const session = await requireAuth();

    const analysis = await db.analysis.update({
      where: {
        id: analysisId,
        userId: session.userId,
      },
      data: {
        status,
        reportGeneratedAt: status === 'REPORTED' ? new Date() : undefined,
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: analysis };
  } catch (error) {
    console.error('Update analysis status error:', error);
    return { success: false, error: 'Failed to update analysis' };
  }
}

export async function getAnalysis(analysisId: string) {
  try {
    const session = await requireAuth();

    const analysis = await db.analysis.findFirst({
      where: {
        id: analysisId,
        userId: session.userId,
      },
      include: {
        business: true,
      },
    });

    if (!analysis) {
      return { success: false, error: 'Analysis not found' };
    }

    return { success: true, data: analysis };
  } catch (error) {
    console.error('Get analysis error:', error);
    return { success: false, error: 'Failed to fetch analysis' };
  }
}
