import 'reflect-metadata';
import { NextResponse } from 'next/server';
import { getCalculationRepository } from '@/lib/database';

export async function GET() {
  try {
    const repo = await getCalculationRepository();
    const shared = await repo.find({
      where: { shared: true },
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return NextResponse.json({ success: true, data: shared });
  } catch (error) {
    console.error('GET /api/history error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shared calculations' },
      { status: 500 }
    );
  }
}
