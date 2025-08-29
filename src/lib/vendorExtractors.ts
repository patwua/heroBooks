interface ExtractResult {
  vendorName: string;
}

type Extractor = (text: string) => ExtractResult | null;

function autoParts(text: string): ExtractResult | null {
  if (/autoparts/i.test(text)) {
    return { vendorName: 'AutoParts' };
  }
  return null;
}

function regency(text: string): ExtractResult | null {
  if (/regency/i.test(text)) {
    return { vendorName: 'Regency' };
  }
  return null;
}

function beForward(text: string): ExtractResult | null {
  if (/beforward/i.test(text)) {
    return { vendorName: 'BeForward' };
  }
  return null;
}

const extractors: Extractor[] = [autoParts, regency, beForward];

export function runVendorExtractors(text: string): ExtractResult | null {
  for (const ex of extractors) {
    const res = ex(text);
    if (res) return res;
  }
  return null;
}
