import { NextResponse } from 'next/server';
import { reconcileTransactions } from '../../../../lib/bank';

export async function POST() {
  const matched = reconcileTransactions();
  return NextResponse.json({ matched });
}
