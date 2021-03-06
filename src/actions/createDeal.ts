import { isUndefined } from 'lodash';
const { messages } = require('elasticio-node');

import { Deal } from '../models/deal';
import { Status, Visibility } from '../models/enums';
import { PipedriveMessage } from '../models/pipedriveMessage';
import { ComponentConfig } from '../models/componentConfig';

import { APIClient } from '../apiclient';

exports.process = createDeal;

/**
 * createDeal creates a new deal.
 *
 * @param msg incoming messages which is empty for triggers
 * @param cfg object to retrieve triggers configuration values
 *
 * @returns promise resolving a message to be emitted to the platform
 */
export async function createDeal(msg: any, cfg: ComponentConfig) {
  this.logger.info('Starting create deal action...');

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

    // Create Deal
  let deal = {
    title: data.deal_title,
    currency: data.deal_currency,
    person_id: data.person_id,
    org_id: data.org_id,
    user_id: data.owner_id,
    add_time: data.deal_add_time,
    lost_reason: data.deal_lost_reason,
    stage_id: data.deal_stage_id,
    value: data.deal_value,

  } as Deal;

    // Set visibility enum, API allows it to be omitted
  switch (data.deal_visible_to) {
    case 1:
      deal.visible_to = Visibility.OwnerAndFollowers;
      break;
    case 2:
      deal.visible_to = Visibility.EntireCompany;
      break;
  }

    // Set status enum, API allows it to be omitted
  switch (data.deal_status) {
    case 'Open':
      deal.status = Status.Open;
      break;
    case 'Won':
      deal.status = Status.Won;
      break;
    case 'Lost':
      deal.status = Status.Lost;
      break;
  }
  deal = await client.createDeal(deal);

    // Return message
  const ret = <PipedriveMessage>data;
  ret.deal_id = deal.id;
  await this.emit('data', messages.newMessageWithBody(ret));
}
