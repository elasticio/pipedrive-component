import { isUndefined } from "lodash";

import { Visibility } from "../models/enums";
import { Organization } from "../models/organization";
import { ComponentConfig } from "../models/componentConfig";
import { PipedriveMessage } from '../models/pipedriveMessage';

import { APIClient } from "../apiclient";

exports.process = createOrganisation;

/**
 * createOrganisation creates a new org.
 *
 * @param data incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values
 * @param snapshot the scratchpad for persitence between execution runs
 *
 * @returns promise resolving a message to be emitted to the platform
 */
export async function createOrganisation(msg: elasticionode.Message, cfg: ComponentConfig, snapshot: any): Promise<PipedriveMessage> {
    console.log("Msg content:");
    console.log(msg);
    console.log("Cfg content:");
    console.log(cfg);
    console.log("snapshot content:");
    console.log(snapshot);

    let data = <PipedriveMessage>msg.body;

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

    // Client init
    cfg.token = cfg.token.trim();
    cfg.company_domain = cfg.company_domain.trim();
    let client = new APIClient(cfg.company_domain, cfg.token);

    // Create Organization, private by default
    let organization = {
        name: data.org_name,
        add_time: data.org_add_time,
        owner_id: data.owner_id,
    } as Organization;

    // Set visibility enum, API allows it to be omitted
    switch (data.org_visible_to) {
        case 1:
            organization.visible_to = Visibility.OwnerAndFollowers;
            break;
        case 2:
            organization.visible_to = Visibility.EntireCompany;
            break;
    }
    console.log("Creating organization: " + JSON.stringify(organization));
    organization = await client.createOrganization(organization);
    console.log("Created organization: " + JSON.stringify(organization));
    // assign returned id to org_id
    let ret = <PipedriveMessage>data;
    ret.org_id = organization.id;
    // Return message
    return ret;
}
