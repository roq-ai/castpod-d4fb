import { EpisodeInterface } from 'interfaces/episode';
import { PlaylistInterface } from 'interfaces/playlist';
import { PodcastInterface } from 'interfaces/podcast';
import { SnippetInterface } from 'interfaces/snippet';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface IndividualInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  episode?: EpisodeInterface[];
  playlist?: PlaylistInterface[];
  podcast?: PodcastInterface[];
  snippet?: SnippetInterface[];
  user?: UserInterface;
  _count?: {
    episode?: number;
    playlist?: number;
    podcast?: number;
    snippet?: number;
  };
}

export interface IndividualGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}
