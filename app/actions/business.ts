'use server';

import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { businessSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@/app/generated/prisma/client';

function parseRevenue(revenue: string): Prisma.Decimal {
  // Remove $ and commas, then parse
  const cleaned = revenue.replace(/[$,]/g, '');
  return new Prisma.Decimal(cleaned || '0');
}

export async function createBusiness(formData: FormData) {
  try {
    const session = await requireAuth();

    const data = {
      industry: formData.get('industry') as string,
      companyName: formData.get('companyName') as string || undefined,
      annualRevenue: formData.get('annualRevenue') as string,
      employees: formData.get('employees') ? parseInt(formData.get('employees') as string) : undefined,
      location: formData.get('location') as string || undefined,
    };

    const validated = businessSchema.parse(data);

    const business = await db.business.create({
      data: {
        industry: validated.industry,
        companyName: validated.companyName,
        annualRevenue: parseRevenue(validated.annualRevenue),
        employees: validated.employees,
        location: validated.location,
        userId: session.userId,
      },
    });

    // Also create a draft analysis for this business
    await db.analysis.create({
      data: {
        businessId: business.id,
        userId: session.userId,
        status: 'DRAFT',
      },
    });

    revalidatePath('/dashboard');
    return { success: true, data: business };
  } catch (error) {
    console.error('Create business error:', error);
    return { success: false, error: 'Failed to create business' };
  }
}

export async function getBusinesses() {
  try {
    const session = await requireAuth();

    const businesses = await db.business.findMany({
      where: { userId: session.userId },
      include: {
        analyses: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, data: businesses };
  } catch (error) {
    console.error('Get businesses error:', error);
    return { success: false, error: 'Failed to fetch businesses', data: [] };
  }
}

export async function getBusiness(id: string) {
  try {
    const session = await requireAuth();

    const business = await db.business.findFirst({
      where: {
        id,
        userId: session.userId,
      },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!business) {
      return { success: false, error: 'Business not found' };
    }

    return { success: true, data: business };
  } catch (error) {
    console.error('Get business error:', error);
    return { success: false, error: 'Failed to fetch business' };
  }
}

export async function updateBusiness(id: string, formData: FormData) {
  try {
    const session = await requireAuth();

    const data = {
      industry: formData.get('industry') as string,
      companyName: formData.get('companyName') as string || undefined,
      annualRevenue: formData.get('annualRevenue') as string,
      employees: formData.get('employees') ? parseInt(formData.get('employees') as string) : undefined,
      location: formData.get('location') as string || undefined,
    };

    const validated = businessSchema.parse(data);

    const business = await db.business.updateMany({
      where: {
        id,
        userId: session.userId,
      },
      data: {
        industry: validated.industry,
        companyName: validated.companyName,
        annualRevenue: parseRevenue(validated.annualRevenue),
        employees: validated.employees,
        location: validated.location,
      },
    });

    if (business.count === 0) {
      return { success: false, error: 'Business not found' };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Update business error:', error);
    return { success: false, error: 'Failed to update business' };
  }
}

export async function deleteBusiness(id: string) {
  try {
    const session = await requireAuth();

    const deleted = await db.business.deleteMany({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (deleted.count === 0) {
      return { success: false, error: 'Business not found' };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete business error:', error);
    return { success: false, error: 'Failed to delete business' };
  }
}

export async function getDashboardStats() {
  try {
    const session = await requireAuth();

    const [businessCount, analysisCount, totalRevenue] = await Promise.all([
      db.business.count({ where: { userId: session.userId } }),
      db.analysis.count({
        where: {
          userId: session.userId,
          status: { in: ['ANALYZED', 'REPORTED'] },
        },
      }),
      db.business.aggregate({
        where: { userId: session.userId },
        _sum: { annualRevenue: true },
      }),
    ]);

    return {
      success: true,
      data: {
        activeAnalyses: businessCount,
        reportsGenerated: analysisCount,
        totalRevenue: totalRevenue._sum.annualRevenue?.toString() || '0',
      },
    };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return {
      success: false,
      data: {
        activeAnalyses: 0,
        reportsGenerated: 0,
        totalRevenue: '0',
      },
    };
  }
}

export async function getRecentActivity() {
  try {
    const session = await requireAuth();

    const businesses = await db.business.findMany({
      where: { userId: session.userId },
      include: {
        analyses: {
          orderBy: { updatedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
    });

    const activities = businesses.map((business) => ({
      id: business.id,
      industry: business.industry,
      companyName: business.companyName,
      revenue: `$${Number(business.annualRevenue).toLocaleString()}`,
      date: business.updatedAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: business.analyses[0]?.status || 'DRAFT',
    }));

    return { success: true, data: activities };
  } catch (error) {
    console.error('Get recent activity error:', error);
    return { success: false, data: [] };
  }
}
