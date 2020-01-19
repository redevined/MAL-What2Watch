export interface AnimeListModel {
  anime : AnimeModel[];
}

export interface AnimeModel {
  // Attributes of results from /plantowatch call
  mal_id? : number;
  title? : string;
  url? : string;
  image_url? : string;
  type? : string;
  total_episodes? : number;

  // Attributes of /anime call
  status? : string;
  score? : number;
  rank? : number;
  popularity? : number;
  source? : string;
  premiered? : string;
  studios? : { mal_id : number, name : string }[];
  genres? : { mal_id : number, name : string }[];

  // Flag  if details have been collected
  synced? : boolean;
}

export let keyNameMap = {
  mal_id: 'MAL ID',
  title: 'Title',
  url: 'URL',
  image_url: 'Image URL',
  type: 'Type',
  total_episodes: 'Number of episodes',
  status: 'Status',
  score: 'Average score',
  rank: 'Rank',
  popularity: 'Popularity',
  source: 'Source material',
  premiered: 'Premiere date',
  studios: 'Studios',
  genres: 'Genres',
  synced: 'Synchronized details'
}
