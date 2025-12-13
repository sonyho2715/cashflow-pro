import { PrismaClient, Prisma } from '../app/generated/prisma/client';
import bcrypt from 'bcryptjs';

const Decimal = Prisma.Decimal;

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
});

async function main() {
  console.log('Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('demo123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@cashflowpro.com' },
    update: {},
    create: {
      email: 'demo@cashflowpro.com',
      passwordHash,
      name: 'Demo User',
      role: 'USER',
      plan: 'ENTERPRISE',
    },
  });

  console.log('Created user:', user.email);

  // Create sample businesses with analyses
  const businessesData = [
    {
      industry: 'Technology',
      companyName: 'TechCorp Solutions',
      annualRevenue: new Decimal(2500000),
      employees: 45,
      location: 'San Francisco, CA',
      status: 'ANALYZED' as const,
      grossRevenue: new Decimal(2500000),
      operatingExpenses: new Decimal(1200000),
      debtPayments: new Decimal(150000),
      ownerCompensation: new Decimal(250000),
      taxObligations: new Decimal(300000),
    },
    {
      industry: 'Hospitality',
      companyName: 'Island Resort Group',
      annualRevenue: new Decimal(1800000),
      employees: 120,
      location: 'Honolulu, HI',
      status: 'REPORTED' as const,
      grossRevenue: new Decimal(1800000),
      operatingExpenses: new Decimal(950000),
      debtPayments: new Decimal(200000),
      ownerCompensation: new Decimal(180000),
      taxObligations: new Decimal(220000),
    },
    {
      industry: 'Construction',
      companyName: 'BuildRight Contractors',
      annualRevenue: new Decimal(5200000),
      employees: 85,
      location: 'Austin, TX',
      status: 'ANALYZED' as const,
      grossRevenue: new Decimal(5200000),
      operatingExpenses: new Decimal(3100000),
      debtPayments: new Decimal(450000),
      ownerCompensation: new Decimal(350000),
      taxObligations: new Decimal(520000),
    },
    {
      industry: 'Healthcare',
      companyName: 'Wellness Medical Center',
      annualRevenue: new Decimal(3100000),
      employees: 65,
      location: 'Denver, CO',
      status: 'DRAFT' as const,
      grossRevenue: null,
      operatingExpenses: null,
      debtPayments: null,
      ownerCompensation: null,
      taxObligations: null,
    },
    {
      industry: 'Manufacturing',
      companyName: 'Precision Parts Inc',
      annualRevenue: new Decimal(4200000),
      employees: 150,
      location: 'Detroit, MI',
      status: 'IN_PROGRESS' as const,
      grossRevenue: new Decimal(4200000),
      operatingExpenses: new Decimal(2800000),
      debtPayments: null,
      ownerCompensation: null,
      taxObligations: null,
    },
  ];

  for (const biz of businessesData) {
    const business = await prisma.business.create({
      data: {
        industry: biz.industry,
        companyName: biz.companyName,
        annualRevenue: biz.annualRevenue,
        employees: biz.employees,
        location: biz.location,
        userId: user.id,
      },
    });

    // Calculate analysis metrics if we have the data
    let discretionaryCashFlow: Prisma.Decimal | null = null;
    let recommendedPremium: Prisma.Decimal | null = null;
    let affordabilityScore: number | null = null;
    let recommendation: string | null = null;

    if (biz.grossRevenue && biz.operatingExpenses && biz.debtPayments && biz.ownerCompensation && biz.taxObligations) {
      const gross = Number(biz.grossRevenue);
      const dcf = gross - Number(biz.operatingExpenses) - Number(biz.debtPayments) - Number(biz.ownerCompensation) - Number(biz.taxObligations);

      discretionaryCashFlow = new Decimal(dcf);
      recommendedPremium = new Decimal(dcf * 0.75); // Moderate risk
      affordabilityScore = Math.min(100, Math.max(0, Math.round((dcf / gross) * 200)));

      if (affordabilityScore >= 75) {
        recommendation = 'Safe to Proceed - Strong financial position with healthy discretionary cash flow.';
      } else if (affordabilityScore >= 50) {
        recommendation = 'Moderate Risk - Adequate cash flow, consider conservative premium options.';
      } else if (affordabilityScore >= 25) {
        recommendation = 'Caution Advised - Limited discretionary income, recommend thorough review.';
      } else {
        recommendation = 'High Risk - Insufficient cash flow for recommended premium levels.';
      }
    }

    await prisma.analysis.create({
      data: {
        businessId: business.id,
        userId: user.id,
        status: biz.status,
        riskTolerance: 'MODERATE',
        grossRevenue: biz.grossRevenue,
        operatingExpenses: biz.operatingExpenses,
        debtPayments: biz.debtPayments,
        ownerCompensation: biz.ownerCompensation,
        taxObligations: biz.taxObligations,
        discretionaryCashFlow,
        recommendedPremium,
        affordabilityScore,
        recommendation,
        reportGeneratedAt: biz.status === 'REPORTED' ? new Date() : null,
      },
    });

    console.log('Created business:', biz.companyName);
  }

  console.log('Seeding complete!');
  console.log('');
  console.log('Demo credentials:');
  console.log('  Email: demo@cashflowpro.com');
  console.log('  Password: demo123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
