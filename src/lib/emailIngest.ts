import { ImapFlow } from 'imapflow';
import { simpleParser, AddressObject } from 'mailparser';
import { prisma } from './prisma';
import { runVendorExtractors } from './vendorExtractors';

interface ParsedAttachment {
  filename?: string;
  contentType?: string;
  contentBase64?: string;
}

interface ParsedMessage {
  from?: string;
  to?: AddressObject | string | null;
  subject?: string;
  text?: string;
  attachments?: ParsedAttachment[];
}

export async function ingestParsedMessage(msg: ParsedMessage) {
  const recipients: string[] = [];
  if (typeof msg.to === 'string') {
    recipients.push(msg.to);
  } else if (msg.to?.value) {
    for (const addr of msg.to.value) {
      if (addr.address) {
        recipients.push(addr.address);
      }
    }
  }
  for (const rawTo of recipients) {
    const to = rawTo.toLowerCase();
    const mailbox = await prisma.inboundMailbox.findUnique({ where: { email: to } });
    if (!mailbox) {
      await prisma.emailIngestLog.create({
        data: { status: 'no-mailbox', error: `No mailbox for ${to}` },
      });
      continue;
    }
    for (const att of msg.attachments || []) {
      if (att.contentType === 'application/pdf' && att.contentBase64) {
        try {
          const pdfParse = (await import('pdf-parse')).default;
          const pdf = await pdfParse(Buffer.from(att.contentBase64, 'base64'));
          const vendorInfo = runVendorExtractors(pdf.text);
          const vendorName = vendorInfo?.vendorName || 'Unknown Vendor';
          const vendor = await prisma.vendor.upsert({
            where: { orgId_name: { orgId: mailbox.orgId, name: vendorName } },
            update: {},
            create: { orgId: mailbox.orgId, name: vendorName },
          });
          const bill = await prisma.bill.create({
            data: { orgId: mailbox.orgId, vendorId: vendor.id },
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
}

export async function runImapIngestion() {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST || "",
    port: Number(process.env.IMAP_PORT || 993),
    secure: process.env.IMAP_TLS !== 'false',
    auth: {
      user: process.env.IMAP_USER || '',
      pass: process.env.IMAP_PASSWORD || '',
    },
  });
  await client.connect();
  await client.mailboxOpen('INBOX');
  const unseen = await client.search({ seen: false });
  if (Array.isArray(unseen)) {
    for (const seq of unseen) {
      const result = await client.fetchOne(seq, { source: true });
      if (result && result.source) {
        const parsed = await simpleParser(result.source as Buffer);
        const attachments = (parsed.attachments || []).map((a) => ({
          filename: a.filename,
          contentType: a.contentType,
          contentBase64: (a.content as Buffer).toString('base64'),
        }));
        await ingestParsedMessage({
          from: parsed.from?.text,
          to: Array.isArray(parsed.to) ? parsed.to[0] : parsed.to || null,
          subject: parsed.subject,
          text: parsed.text,
          attachments,
        });
        await client.messageFlagsAdd(seq, ['\\Seen']);
      }
    }
  }
  await client.logout();
}
