import { Done } from './enums';

export interface Activity {
  id: number;
  subject: string;
  done: Done;
  type: string;
  deal_id: number;
  person_id: number;
  org_id: number;
  user_id: number;
}
