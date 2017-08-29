import { isUndefined } from "lodash";

import { Deal } from "../models/deal";
import { Status } from "../models/enums";
import { Note } from "../models/note";
import { Organization } from "../models/organization";
import { Person } from "../models/person";

import { APIClient } from "../apiclient";

exports.process = createDeal;

export interface CreateDealConfig {
    token: string;
    company_domain: string;
    deal_note: string;
}

export interface CreateDealInMessage {
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    role: string;
    company: string;
    company_size: string;
    message: string;
}

export interface CreateDealOutMessage {
    deal_id: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    role: string;
    company: string;
    company_size: string;
    message: string;
}

/**
 * createDeal creates a new deal. It will also create a contact person,
 * an organisation and a note.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values
 * @param snapshot the scratchpad for persitence between execution runs
 * 
 * @returns promise resolving a message to be emitted to the platform
 */
export async function createDeal(msg: elasticionode.Message, cfg: CreateDealConfig, snapshot: any): Promise<CreateDealOutMessage> {
    console.log("Msg content:");
    console.log(msg);
    console.log("Cfg content:");
    console.log(cfg);
    console.log("snapshot content:");
    console.log(snapshot);

    // Generate the config for https request
    if (isUndefined(cfg)) {
        throw new Error("cfg is undefined");
    }
    if (isUndefined(cfg.token)) {
        throw new Error("API token is undefined");
    }
    if (isUndefined(cfg.company_domain)) {
        throw new Error("Company domain is undefined");
    }
    if (isUndefined(cfg.deal_note)) {
        throw new Error("Deal note is undefined");
    }

    // Client init
    cfg.token = cfg.token.trim();
    cfg.company_domain = cfg.company_domain.trim();
    let client = new APIClient(cfg.company_domain, cfg.token);

    // Get the input data
    let data = <CreateDealInMessage>msg.body;

    // Create Organization
    console.log("Creating organization: " + data.company);
    let organization = {
        name: data.company,
    } as Organization;
    organization = await client.createOrganization(organization);
    console.log("Created organization: " + organization.name);

    // Create Person
    console.log("Creating person: " + data.contact_name);
    let person = {
        name: data.contact_name,
        email: new Array<string>(data.contact_email),
        phone: new Array<string>(data.contact_phone),
        org_id: organization.id,
    } as Person;
    person = await client.createPerson(person);
    console.log("Created person: " + person.name);

    // Create Deal
    console.log("Creating deal: ");
    let deal = {
        title: "Website: " + data.company,
        person_id: person.id,
        org_id: organization.id,
        status: Status.Open,
    } as Deal;
    deal = await client.createDeal(deal);
    console.log("Created deal: " + deal.title);

    // Create Note
    console.log("Creating note: ");
    let note = {
        deal_id: deal.id,
        content: cfg.deal_note,
    } as Note;
    note = await client.createNote(note);
    console.log("Created note for deal_id : " + note.deal_id);

    // Return message
    let ret = <CreateDealOutMessage>data;
    ret.deal_id = deal.id;
    return ret;
}

