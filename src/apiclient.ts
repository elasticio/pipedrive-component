import axios, { AxiosInstance } from 'axios';

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
    this.http = axios.create({
      // tslint:disable-next-line:prefer-template
      baseURL: 'https://' + companyDomain + '.pipedrive.com/v1',
      params: { api_token: token },
    });
  }

  async createDeal(deal: Deal) {
    return this.create<Deal>(deal, 'deals');
  }

  async createNote(note: Note) {
    return this.create<Note>(note, 'notes');
  }

  async createOrganization(organization: Organization) {
    const createResponse = await this.create<Organization>(organization, 'organizations');
    return createResponse;
  }

  async createPerson(person: Person) {
    return this.create<Person>(person, 'persons');
  }

  async createActivity(activity: Activity) {
    return this.create<Activity>(activity, 'activities');
  }

  private async create<T>(payload: T, endpointName: string): Promise<T> {
    // tslint:disable-next-line:prefer-template
    const response = await this.http.post('/' + endpointName, payload, { responseType: 'json', timeout: 5000 });
    const result = <APIResult> response.data;
    if (!result.success) {
      throw new Error('Could not entity for provided endpoint');
    }
    return <T>result.data;
  }
}
