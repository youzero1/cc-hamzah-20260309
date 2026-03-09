import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getCalculationRepository } from '@/lib/database';

export async function GET() {
  try {
    const repo = await getCalculationRepository();
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return NextResponse.json({ success: true, data: calculations });
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined) {
      return NextResponse.json(
        { success: false, error: 'Expression and result are required' },
        { status: 400 }
      );
    }

    const repo = await getCalculationRepository();
    const calculation = repo.create({
      expression: String(expression),
      result: String(result),
      shared: false,
      likes: 0,
    });

    const saved = await repo.save(calculation);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}
