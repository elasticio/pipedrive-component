import { isUndefined } from "lodash";

import { Note } from "../models/note";
import { ComponentConfig } from "../models/componentConfig";
import { PipedriveMessage } from '../models/pipedriveMessage';

import { APIClient } from "../apiclient";

exports.process = createNote;

/**
 * createPerson creates a new note.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values
 *
 * @returns promise resolving a message to be emitted to the platform
 */
export async function createNote(msg: elasticionode.Message, cfg: ComponentConfig): Promise<PipedriveMessage> {
    this.logger.info("Starting create note action...");

    // Get the input data
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

    // Create Note
    // Form note object to be inserted.
    let note = {
        org_id: data.org_id,
        person_id: data.person_id,
        deal_id: data.deal_id,
        content: data.note_content,
    } as Note;
    note = await client.createNote(note);
    // assign returned id to org_id
    let ret = <PipedriveMessage>data;
    ret.note_id = note.id;
    // Return message
    return ret;
}
