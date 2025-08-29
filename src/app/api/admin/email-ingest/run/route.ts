import { NextResponse } from 'next/server';
import { emailIngest } from '@/lib/emailIngest';

export async function POST(req: Request) {
  const secret = req.headers.get('x-ingest-secret');
  if (!secret || secret !== process.env.EMAIL_INGEST_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  await emailIngest();
  return NextResponse.json({ status: 'ok' });
}
