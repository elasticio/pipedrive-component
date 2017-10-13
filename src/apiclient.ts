import Axios from 'axios';
import { AxiosInstance } from 'axios';

import { Deal } from './models/deal';
import { Note } from './models/note';
import { Organization } from './models/organization';
import { Person } from './models/person';
import { Activity } from './models/activity';

export interface APIResult {
    success: boolean;
    data: any;
    related_objects: any;
}

export class APIClient {
    private http: AxiosInstance;

    constructor(companyDomain: string, token: string) {
        this.http = Axios.create({
            baseURL: 'https://' + companyDomain + '.pipedrive.com/v1',
            params: { 'api_token': token }
        });
    }

    async createDeal(deal: Deal) {
        return this.create<Deal>(deal, "deals");
    }

    async createNote(note: Note) {
        return this.create<Note>(note, "notes");
    }

    async createOrganization(organization: Organization) {
        return this.create<Organization>(organization, "organizations");
    }

    async createPerson(person: Person) {
        return this.create<Person>(person, "persons");
    }

    async createActivity(activity: Activity) {
        return this.create<Activity>(activity, "activities");
    }

    private async create<T>(payload: T, endpointName: string): Promise<T> {
        const response = await this.http.post('/' + endpointName, payload, { responseType: 'json' });
        const result = <APIResult>response.data;
        if (!result.success) {
            throw new Error('could not entity for endpoint ' + endpointName);
        }
        return <T>result.data;
    }
}
