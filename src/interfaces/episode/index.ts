import { SnippetInterface } from 'interfaces/snippet';
import { PodcastInterface } from 'interfaces/podcast';
import { IndividualInterface } from 'interfaces/individual';
import { GetQueryInterface } from 'interfaces';

export interface EpisodeInterface {
  id?: string;
  title: string;
  podcast_id?: string;
  individual_id?: string;
  created_at?: any;
  updated_at?: any;
  snippet?: SnippetInterface[];
  podcast?: PodcastInterface;
  individual?: IndividualInterface;
  _count?: {
    snippet?: number;
  };
}

export interface EpisodeGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  podcast_id?: string;
  individual_id?: string;
}
