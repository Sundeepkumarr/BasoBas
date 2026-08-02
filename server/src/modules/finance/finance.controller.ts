import { Request, Response } from 'express';
import prisma from '../../config/database';
import { catchAsync, AppError } from '../../utils';

export const createFinanceRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { propertyId, loanAmount, monthlyIncome, employmentType, employerName, notes } = req.body;

  const request = await prisma.financeRequest.create({
    data: { userId, propertyId, loanAmount, monthlyIncome, employmentType, employerName, notes },
    include: { property: true },
  });

  res.status(201).json({ success: true, message: 'Finance request submitted', data: request });
});

export const getFinanceRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const role = req.user!.role;

  const where = role === 'ADMIN' ? {} : { userId };

  const requests = await prisma.financeRequest.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { include: { profile: true } },
      property: { include: { images: { where: { isPrimary: true }, take: 1 } } },
    },
  });

  res.json({ success: true, data: requests });
});

export const updateFinanceStatus = catchAsync(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id) throw AppError.badRequest('Missing id');
  const { status, adminNotes } = req.body;

  const request = await prisma.financeRequest.update({
    where: { id },
    data: { status, adminNotes },
  });

  res.json({ success: true, message: 'Finance request updated', data: request });
});

// EMI Calculator (stateless utility)
export const calculateEMI = catchAsync(async (req: Request, res: Response) => {
  const { principal, annualRate, tenureMonths } = req.body;

  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalAmount = emi * tenureMonths;
  const totalInterest = totalAmount - principal;

  res.json({
    success: true,
    data: {
      emi: Math.round(emi),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal,
      annualRate,
      tenureMonths,
    },
  });
});
