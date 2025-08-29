import { NextResponse } from 'next/server';
import { ingestParsedMessage } from '@/lib/emailIngest';

export async function POST(req: Request) {
  const secret = req.headers.get('x-ingest-secret');
  if (!secret || secret !== process.env.EMAIL_INGEST_SECRET) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const body = await req.json();
  await ingestParsedMessage(body);
  return NextResponse.json({ status: 'ok' });
}
