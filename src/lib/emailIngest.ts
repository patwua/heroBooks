import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import pdfParse from 'pdf-parse';
import { prisma } from './prisma';

export async function emailIngest() {
  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: Number(process.env.IMAP_PORT || 993),
    secure: process.env.IMAP_TLS !== 'false',
    auth: {
      user: process.env.IMAP_USER || '',
      pass: process.env.IMAP_PASSWORD || ''
    }
  });

  await client.connect();
  await client.selectMailbox('INBOX');

  for await (const message of client.fetch('1:*', { source: true })) {
    const parsed = await simpleParser(message.source as Buffer);
    for (const attachment of parsed.attachments || []) {
      if (attachment.contentType === 'application/pdf') {
        const pdf = await pdfParse(attachment.content);
        const vendorName = pdf.text.split('\n')[0]?.trim() || 'Unknown Vendor';
        const vendor = await prisma.vendor.upsert({
          where: { name: vendorName },
          create: { name: vendorName, orgId: '' },
          update: {}
        });
        await prisma.bill.create({
          data: {
            orgId: vendor.orgId,
            vendorId: vendor.id,
            status: 'draft'
          }
        });
      }
    }
  }

  await client.logout();
}
