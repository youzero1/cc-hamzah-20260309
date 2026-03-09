import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getCalculationRepository } from '@/lib/database';

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const repo = await getCalculationRepository();
    const calculation = await repo.findOne({ where: { id } });

    if (!calculation) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      );
    }

    calculation.likes = (calculation.likes || 0) + 1;
    const updated = await repo.save(calculation);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('POST /api/history/[id]/like error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like calculation' },
      { status: 500 }
    );
  }
}
