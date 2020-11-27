import { Visibility } from './enums';

export interface Person {
  id: number;
  name: string;
  owner_id: number;
  org_id: number;
  // tslint:disable-next-line:prefer-array-literal
  email: Array<string>;
  // tslint:disable-next-line:prefer-array-literal
  phone: Array<string>;
  visible_to: Visibility;
  add_time: string;
}
