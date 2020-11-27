import { isUndefined } from 'lodash';
const { messages } = require('elasticio-node');

import { Visibility } from '../models/enums';
import { Person } from '../models/person';
import { ComponentConfig } from '../models/componentConfig';
import { PipedriveMessage } from '../models/pipedriveMessage';

import { APIClient } from '../apiclient';

exports.process = createPerson;

/**
 * createPerson creates a new person.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values
 *
 * @returns promise resolving a message to be emitted to the platform
 */
export async function createPerson(msg: any, cfg: ComponentConfig) {
  this.logger.info('Starting create person action...');

    // Get the input data
  const data = <PipedriveMessage>msg.body;

    // Generate the config for https request
  if (isUndefined(cfg)) {
    throw new Error('cfg is undefined');
  }
  if (isUndefined(cfg.token)) {
    throw new Error('API token is undefined');
  }
  if (isUndefined(cfg.company_domain)) {
    throw new Error('Company domain is undefined');
  }

    // Client init
  cfg.token = cfg.token.trim();
  cfg.company_domain = cfg.company_domain.trim();
  const client = new APIClient(cfg.company_domain, cfg.token);

    // Create Organization, private by default
  let person = {
    name: data.person_name,
    email: data.person_email,
    phone: data.person_phone,
    org_id: data.org_id,
    add_time: data.person_add_time,
    owner_id: data.owner_id,
  } as Person;

    // Set visibility enum, API allows it to be omitted
  switch (data.person_visible_to) {
    case 1:
      person.visible_to = Visibility.OwnerAndFollowers;
      break;
    case 2:
      person.visible_to = Visibility.EntireCompany;
      break;
  }
  person = await client.createPerson(person);
    // assign returned id to org_id
  const ret = <PipedriveMessage>data;
  ret.person_id = person.id;
    // Return message
  await this.emit('data', messages.newMessageWithBody(ret));
}
