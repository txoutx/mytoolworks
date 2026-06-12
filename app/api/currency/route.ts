import { NextRequest, NextResponse } from "next/server";

type FrankfurterPair = {
  date?: string;
  base?: string;
  quote?: string;
  rate?: number;
};

type FrankfurterRates = {
  date?: string;
  rates?: Record<string, number>;
};

const allowedCodes = new Set(["EUR", "USD", "GBP", "CHF", "JPY", "CAD", "AUD", "MXN"]);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const base = sanitizeCurrency(searchParams.get("base") ?? "EUR");
  const quotes = (searchParams.get("quotes") ?? "USD")
    .split(",")
    .map((code) => sanitizeCurrency(code))
    .filter((code) => code !== base);

  if (!allowedCodes.has(base) || quotes.some((code) => !allowedCodes.has(code))) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }

  const url = `https://api.frankfurter.dev/v2/rates?base=${base}&quotes=${quotes.join(",")}`;
  const response = await fetch(url, {
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Currency provider unavailable" }, { status: 502 });
  }

  const payload = (await response.json()) as FrankfurterPair[] | FrankfurterRates;
  const normalized = normalizeRates(payload);

  return NextResponse.json({
    base,
    date: normalized.date,
    rates: normalized.rates
  });
}

function sanitizeCurrency(value: string) {
  return value.trim().toUpperCase();
}

function normalizeRates(payload: FrankfurterPair[] | FrankfurterRates): { date: string; rates: Record<string, number> } {
  if (Array.isArray(payload)) {
    const result: { date: string; rates: Record<string, number> } = { date: "", rates: {} };
    payload.forEach((item) => {
      if (item.date && !result.date) result.date = item.date;
      if (item.quote && Number.isFinite(item.rate)) result.rates[item.quote] = item.rate as number;
    });
    return result;
  }

  return {
    date: payload.date ?? "",
    rates: payload.rates ?? {}
  };
}
