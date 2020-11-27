import chai from 'chai';
import sinon from 'sinon';

const { expect } = chai;

import { messages } from 'elasticio-node';
const logger = require('@elastic.io/component-logger')();

import { createDeal } from '../../src/actions/createDeal';
import { createActivity } from '../../src/actions/createActivity';
import { createNote } from '../../src/actions/createNote';
import { createOrganisation } from '../../src/actions/createOrganisation';
import { createPerson } from '../../src/actions/createPerson';
import { Deal } from '../../src/models/deal';
import { Status, Done } from '../../src/models/enums';
import { Note } from '../../src/models/note';
import { Organization } from '../../src/models/organization';
import { Person } from '../../src/models/person';
import { APIClient } from '../../src/apiclient';
import { Activity } from '../../src/models/activity';
import { ComponentConfig } from '../../src/models/componentConfig';
import { PipedriveMessage } from '../../src/models/pipedriveMessage';

describe('Create a deal and all subitems', () => {
  const message = messages.newEmptyMessage();

    // Careful! this object is common data for all tests
  const data = {
    activity_subject: 'Call Gordon Freeman',
    owner_id: 332632,
    deal_title: 'Website: Black Mesa',
    deal_value: 1.000,
    deal_currency: 'Euro',
    note_content: 'Can you integrate with the XEN based systems?',
    org_name: 'Black Mesa',
    person_name: 'Gordon Freeman',
    person_email: ['gordon.freeman@blackmesa.com'],
    person_phone: ['+01 2516/819813'],
  };
  message.body = data as PipedriveMessage;

  const config = {
    company_domain: 'aperture',
    token: 'i-am-real-token-yes',
    deal_note: 'Just a simple note.',
  } as ComponentConfig;

  let emit: any;

  let self;

  beforeEach(() => {
    emit = sinon.spy();
    self = {
      logger,
      emit,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  const organization = {
    id: 42,
    name: data.org_name,
    owner_id: data.owner_id,
  } as Organization;

  const person = {
    id: 12,
    name: data.person_name,
    phone: data.person_phone,
    email: data.person_email,
    org_id: organization.id,
    owner_id: data.owner_id,
  } as Person;

  const deal = {
    id: 99,
    title: data.deal_title,
    person_id: person.id,
    org_id: organization.id,
    status: Status.Open,
  } as Deal;

  const note = {
    id: 123,
    deal_id: deal.id,
    content: 'Just a simple note. : Can you integrate with the XEN based systems?',
  } as Note;

  const activity = {
    subject: data.activity_subject,
    person_id: person.id,
    done: Done.NotDone,
    deal_id: deal.id,
    type: 'task',
  } as Activity;

  it('should mock creating an organization', async () => {
    sinon.stub(APIClient.prototype, 'create').resolves(
      new Promise(resolve => resolve(organization)),
    );

    await createOrganisation.call(self, message, config);
    const result = emit.getCall(0).args[1].body;
    expect(result).to.be.deep.equal(message.body);
  });

  it('should mock creating a person', async () => {
    sinon.stub(APIClient.prototype, 'create').resolves(
        new Promise(resolve => resolve(person)),
    );

    await createPerson.call(self, message, config);
    const result = emit.getCall(0).args[1].body;
    expect(result).to.be.deep.equal(message.body);
  });

  it('should mock creating a deal', async () => {
    sinon.stub(APIClient.prototype, 'create').resolves(
        new Promise(resolve => resolve(deal)),
    );

    await createDeal.call(self, message, config);
    const result = emit.getCall(0).args[1].body;
    expect(result).to.be.deep.equal(message.body);
  });

  it('should mock creating an activity', async () => {
    sinon.stub(APIClient.prototype, 'create').resolves(
        new Promise(resolve => resolve(activity)),
    );

    await createActivity.call(self, message, config);
    const result = emit.getCall(0).args[1].body;
    expect(result).to.be.deep.equal(message.body);
  });

  it('should mock creating a notice', async () => {
    sinon.stub(APIClient.prototype, 'create').resolves(
        new Promise(resolve => resolve(note)),
    );

    await createNote.call(self, message, config);
    const result = emit.getCall(0).args[1].body;
    expect(result).to.be.deep.equal(message.body);
  });
});
