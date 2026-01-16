export type PackageType = "yearbook" | "photo" | "video";

type QuoteInput = {
  package: PackageType;
  students: number;
  city: string;
  deadline: Date;
};

function roundTo10k(x: number) {
  return Math.round(x / 10_000) * 10_000;
}

function daysUntil(d: Date) {
  const ms = d.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function estimateQuote(input: QuoteInput) {
  const { package: pkg, students, city, deadline } = input;

  const base: Record<PackageType, number> = {
    yearbook: 12_000_000,
    photo: 6_000_000,
    video: 8_000_000,
  };

  const perStudent: Record<PackageType, number> = {
    yearbook: 45_000,
    photo: 20_000,
    video: 30_000,
  };

  const cityLower = city.toLowerCase();
  const locationMultiplier =
    cityLower.includes("bandung") ? 1.0 :
    cityLower.includes("jakarta") || cityLower.includes("bogor") || cityLower.includes("depok") || cityLower.includes("tangerang") || cityLower.includes("bekasi") ? 1.1 :
    1.2;

  const du = daysUntil(deadline);
  let rushMultiplier = 1.0;
  if (du <= 7) rushMultiplier = 1.35;
  else if (du <= 14) rushMultiplier = 1.2;

  const mid = (base[pkg] + perStudent[pkg] * students) * locationMultiplier * rushMultiplier;

  const priceMin = roundTo10k(mid * 0.9);
  const priceMax = roundTo10k(mid * 1.15);

  const baseDays: Record<PackageType, number> = {
    yearbook: 25,
    photo: 7,
    video: 14,
  };

  const loadFactor = Math.ceil(students / 100);
  let etaMin = baseDays[pkg] + loadFactor * 1;
  let etaMax = baseDays[pkg] + loadFactor * 3;

  if (du <= 14) {
    etaMin = Math.max(3, Math.floor(etaMin * 0.8));
    etaMax = Math.max(5, Math.floor(etaMax * 0.85));
  }

  return { priceMin, priceMax, etaMinDays: etaMin, etaMaxDays: etaMax };
}
