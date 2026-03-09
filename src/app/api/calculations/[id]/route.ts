import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getCalculationRepository } from '@/lib/database';

export async function PATCH(
  request: NextRequest,
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

    const body = await request.json();
    const repo = await getCalculationRepository();
    const calculation = await repo.findOne({ where: { id } });

    if (!calculation) {
      return NextResponse.json(
        { success: false, error: 'Calculation not found' },
        { status: 404 }
      );
    }

    if (body.shared !== undefined) {
      calculation.shared = body.shared;
    }

    const updated = await repo.save(calculation);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/calculations/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update calculation' },
      { status: 500 }
    );
  }
}
