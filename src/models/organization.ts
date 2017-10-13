import { Visibility } from './enums';

export interface Organization {
    id: number;
    name: string;
    owner_id: number;
    visible_to: Visibility;
    add_time: string;
}
