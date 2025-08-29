import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import pdfParse from 'pdf-parse';
import { prisma } from './prisma';
import { runVendorExtractors } from './vendorExtractors';

interface ParsedAttachment {
  filename?: string;
  contentType?: string;
  contentBase64?: string;
}

interface ParsedMessage {
  from?: string;
  to?: string;
  subject?: string;
  text?: string;
  attachments?: ParsedAttachment[];
}

export async function ingestParsedMessage(msg: ParsedMessage) {
  const to = msg.to?.toLowerCase() || '';
  const mailbox = await prisma.inboundMailbox.findUnique({ where: { email: to } });
  if (!mailbox) {
    await prisma.emailIngestLog.create({
      data: { status: 'no-mailbox', error: `No mailbox for ${to}` },
    });
    return;
  }
  for (const att of msg.attachments || []) {
    if (att.contentType === 'application/pdf' && att.contentBase64) {
      try {
        const pdf = await pdfParse(Buffer.from(att.contentBase64, 'base64'));
        const vendorInfo = runVendorExtractors(pdf.text);
        const vendorName = vendorInfo?.vendorName || 'Unknown Vendor';
        const vendor = await prisma.vendor.upsert({
          where: { orgId_name: { orgId: mailbox.orgId, name: vendorName } },
          update: {},
          create: { orgId: mailbox.orgId, name: vendorName },
        });
        const bill = await prisma.bill.create({
          data: { orgId: mailbox.orgId, vendorId: vendor.id, status: 'draft' },
        });
        await prisma.emailIngestLog.create({
          data: {
            mailboxId: mailbox.id,
            vendor: vendorName,
            billId: bill.id,
            status: 'ok',
          },
        });
      } catch (err: any) {
        await prisma.emailIngestLog.create({
          data: {
            mailboxId: mailbox.id,
            status: 'error',
            error: err.message,
          },
        });
      }
    }
  }
}

export async function runImapIngestion() {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT || 993),
    secure: process.env.IMAP_TLS !== 'false',
    auth: {
      user: process.env.IMAP_USER || '',
      pass: process.env.IMAP_PASSWORD || '',
    },
  });
  await client.connect();
  await client.selectMailbox('INBOX');
  const unseen = await client.search({ seen: false });
  for (const seq of unseen) {
    const { source } = await client.fetchOne(seq, { source: true });
    const parsed = await simpleParser(source as Buffer);
    const attachments = (parsed.attachments || []).map((a) => ({
      filename: a.filename,
      contentType: a.contentType,
      contentBase64: (a.content as Buffer).toString('base64'),
    }));
    const to = parsed.to?.value?.[0]?.address || '';
    await ingestParsedMessage({
      from: parsed.from?.text,
      to,
      subject: parsed.subject,
      text: parsed.text,
      attachments,
    });
    await client.messageFlagsAdd(seq, ['\\Seen']);
  }
  await client.logout();
}
