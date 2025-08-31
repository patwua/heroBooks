import { NextResponse } from 'next/server';
import { addTransactions, BankTransaction } from '../../../../lib/bank';

function parseCsv(text: string) {
  const lines = text.trim().split(/\r?\n/);
  lines.shift(); // remove header
  return lines.filter(Boolean).map((line) => {
    const [date, amount, memo] = line.split(',');
    const txn: BankTransaction = {
      id: Math.random().toString(36).slice(2),
      date: new Date(date).toISOString(),
      amount: Number(amount),
      memo,
      status: 'UNMATCHED',
    };
    return txn;
  });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'file required' }, { status: 400 });
  }
  const text = await file.text();
  const txns = parseCsv(text);
  addTransactions(txns);
  return NextResponse.json({ imported: txns.length });
}
