import test from 'node:test';
import assert from 'node:assert/strict';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

function sanitizeMarked(md) {
  const html = marked.parse(md);
  return sanitizeHtml(String(html), {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'table', 'thead', 'tbody', 'tr', 'td', 'th',
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'srcset', 'sizes', 'loading', 'decoding'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowProtocolRelative: true,
  });
}

test('removes script tags and dangerous attributes', () => {
  const dirty = [
    'Hello <script>alert(1)</script> world',
    '<img src="x" onerror="alert(1)" />',
  ].join('\n');
  const clean = sanitizeMarked(dirty);
  assert.ok(!clean.includes('<script'), 'script tag should be stripped');
  assert.ok(!/onerror\s*=/.test(clean), 'dangerous onerror should be stripped');
});

test('keeps headings and images with safe attributes', () => {
  const dirty = [
    '# Hello',
    '![Alt text](/kb/illustrations/test.svg "Title")',
  ].join('\n\n');
  const clean = sanitizeMarked(dirty);
  assert.ok(clean.includes('<h1>'), 'h1 should be allowed');
  assert.ok(/<img[^>]+src="\/kb\/illustrations\/test.svg"/.test(clean), 'img src should be preserved');
  assert.ok(/<img[^>]+alt="Alt text"/.test(clean), 'img alt should be preserved');
});

