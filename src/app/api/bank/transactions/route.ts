import { NextResponse } from 'next/server';
import { getTransactions } from '../../../../lib/bank';

export async function GET() {
  return NextResponse.json(getTransactions());
}
