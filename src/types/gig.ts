export interface Gig {
  id: number;
  userId?: number;
  bands: string[];
  city: string;
  venue: string;
  country: string;
  date: string; // format ISO "AAAA-MM-JJ"
  price: string | number;
}

export type GigFormValues = {
  bands: string[];
  city: string;
  venue: string;
  country: string;
  date: string;
  price: string;
};

export interface BandStat {
  band: string;
  count: number;
}

export interface CountryStat {
  country: string;
  count: number;
}
