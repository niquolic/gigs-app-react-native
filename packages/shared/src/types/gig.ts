export interface Gig {
  id: string;
  userId?: string | number;
  bands: string[];
  city: string;
  venue: string;
  country: string;
  date: string;
  price: number | string;
}

export type GigFormValues = {
  bands: string[];
  city: string;
  venue: string;
  country: string;
  date: string;
  price: string;
};

export interface BandStat { band: string; count: number }
export interface CountryStat { country: string; count: number }
