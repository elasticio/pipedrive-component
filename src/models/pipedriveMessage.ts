import { Visibility, Done, Status } from '../models/enums';

// owner_id and user_id are fully optional
//  when owner_id not specified authenticated user is set as owner
// from https://developers.pipedrive.com/docs/api/v1
// If user_id is defined, it will replace owner_id for task
export interface PipedriveMessage {
  activity_id: number;
  activity_subject: string;
  activity_done: Done;
  activity_type: string;
  deal_id: number;
  deal_title: string;
  deal_value: number;
  deal_currency: string;
  user_id: number;
  deal_stage_id: number;
  deal_status: Status;
  deal_lost_reason: string;
  deal_visible_to: Visibility;
  deal_add_time: string;
  note_id: number;
  note_content: string;
  org_id: number;
  org_name: string;
  org_visible_to: Visibility;
  org_add_time: string;
  person_id: number;
  person_name: string;
  // tslint:disable-next-line:prefer-array-literal
  person_email: Array<string>;
  // tslint:disable-next-line:prefer-array-literal
  person_phone: Array<string>;
  person_visible_to: Visibility;
  person_add_time: string;
  owner_id: number;
}
