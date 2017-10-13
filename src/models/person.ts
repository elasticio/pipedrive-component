import { Visibility } from './enums';

export interface Person {
    id: number;
    name: string;
    owner_id: number;
    org_id: number;
    email: Array<string>;
    phone: Array<string>;
    visible_to: Visibility;
    add_time: string;
}
