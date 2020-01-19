export interface AnimeListModel {
  anime : AnimeModel[];
}

export interface AnimeModel {
  mal_id? : number;
  title? : string;
  url? : string;
  image_url? : string;
  type? : string;
  total_episodes? : number;

  status? : string;
  score? : number;
  rank? : number;
  popularity? : number;
  source? : string;
  premiered? : string;
  studios? : { mal_id : number, name : string }[];
  genres? : { mal_id : number, name : string }[];

  synced? : boolean;
}
