export function fmtMoney(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}

export function fmtDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB");
}
