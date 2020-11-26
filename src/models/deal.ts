import { Status, Visibility } from './enums';

export interface Deal {
  id: number;
  title: string;
  value: number;
  currency: string;
  user_id: number;
  person_id: number;
  org_id: number;
  stage_id: number;
  status: Status;
  lost_reason: string;
  visible_to: Visibility;
  add_time: string;
}
