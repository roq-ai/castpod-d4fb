import { EpisodeInterface } from 'interfaces/episode';
import { IndividualInterface } from 'interfaces/individual';
import { GetQueryInterface } from 'interfaces';

export interface PodcastInterface {
  id?: string;
  title: string;
  genre: string;
  host: string;
  individual_id?: string;
  created_at?: any;
  updated_at?: any;
  episode?: EpisodeInterface[];
  individual?: IndividualInterface;
  _count?: {
    episode?: number;
  };
}

export interface PodcastGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  genre?: string;
  host?: string;
  individual_id?: string;
}
