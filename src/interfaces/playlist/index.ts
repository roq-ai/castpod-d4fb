import { IndividualInterface } from 'interfaces/individual';
import { GetQueryInterface } from 'interfaces';

export interface PlaylistInterface {
  id?: string;
  name: string;
  individual_id?: string;
  created_at?: any;
  updated_at?: any;

  individual?: IndividualInterface;
  _count?: {};
}

export interface PlaylistGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  individual_id?: string;
}
