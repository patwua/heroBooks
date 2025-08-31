export type BankTransaction = {
  id: string;
  date: string; // ISO date string
  amount: number;
  memo?: string;
  status: 'UNMATCHED' | 'MATCHED';
};

const bankTransactions: BankTransaction[] = [];

export function getTransactions() {
  return bankTransactions;
}

export function addTransactions(txns: BankTransaction[]) {
  bankTransactions.push(...txns);
}

export function reconcileTransactions() {
  let matched = 0;
  for (const t of bankTransactions) {
    if (t.status !== 'MATCHED') {
      t.status = 'MATCHED';
      matched++;
    }
  }
  return matched;
}

export function resetTransactions() {
  bankTransactions.length = 0;
}
