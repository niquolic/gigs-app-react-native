import type {BandStat,CountryStat,Gig,GigFormValues} from "../types/gig";
export type AppLanguage="fr"|"en";
export type UserPreferences={language:AppLanguage;currency:string};
export type RegisterPreferences=Partial<UserPreferences>;
export type BandStatsPage={content:BandStat[];page:number;size:number;hasNext:boolean};
export type GigStats={totalNumberOfGigs:number;totalNumberOfGigsThisYear:number;totalPrice:number;priceThisYear:number};
export interface GigsApi {login(login:string,password:string):Promise<string>;register(login:string,password:string,prefs?:RegisterPreferences):Promise<string>;getGigsByUserId(userId:string):Promise<Gig[]>;getGigById(id:string|number):Promise<Gig>;addGig(userId:string,values:GigFormValues):Promise<void>;editGig(userId:string,gig:Gig):Promise<void>;deleteGig(id:string):Promise<void>;getBandsStats(page?:number):Promise<BandStatsPage>;getGigStats():Promise<GigStats>;getCountryStatsOfUser():Promise<CountryStat[]>;getUserPreferences():Promise<UserPreferences>;updateUserPreferences(prefs:UserPreferences):Promise<UserPreferences>;}
