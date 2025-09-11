"use client";
import React, { useEffect, useMemo, useState } from "react";

type Country = {
  code: string;
  name: string;
  tax_name: string;
  standard_rate: number | null;
  verify_url?: string;
};

export default function RatesWidget({ defaultCode = "GY" }: { defaultCode?: string }) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [code, setCode] = useState<string>(defaultCode);

  useEffect(() => {
    let mounted = true;
    fetch("/kb/rates/tax_rates.json")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const arr: Country[] = Array.isArray(data?.countries) ? data.countries : [];
        setCountries(arr);
      })
      .catch(() => setCountries([]));
    return () => {
      mounted = false;
    };
  }, []);

  const sel = useMemo(() => {
    if (!countries.length) return undefined;
    return countries.find((c) => c.code === code) || countries[0];
  }, [countries, code]);

  if (!countries.length || !sel) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">Quick tax rate lookup</div>
        <div>
          <label className="sr-only" htmlFor="kb-rates-select">Country</label>
          <select
            id="kb-rates-select"
            className="rounded-md border bg-background px-2 py-1 text-sm"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="rounded-xl border bg-card p-4 text-card-foreground">
        <div className="text-sm text-muted-foreground">{sel.tax_name}</div>
        <div className="mt-1 text-lg font-semibold">
          Standard rate: {sel.standard_rate == null ? "—" : `${sel.standard_rate}%`}
        </div>
        {sel.verify_url ? (
          <a
            className="mt-3 inline-flex items-center gap-1 text-primary hover:underline"
            href={sel.verify_url}
            target="_blank"
            rel="noreferrer"
          >
            Verify at authority
          </a>
        ) : null}
        <div className="mt-2 text-xs text-muted-foreground">Rates change — verify before use.</div>
      </div>
    </div>
  );
}

