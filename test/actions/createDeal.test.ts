const trigger = require("../../src/actions/createDeal");

import { messages } from "elasticio-node";
import { readFile } from "fs-extra";
import * as nock from "nock";

import { createDeal } from "../../src/actions/createDeal";
import { createActivity } from "../../src/actions/createActivity";
import { createNote } from "../../src/actions/createNote";
import { createOrganisation } from "../../src/actions/createOrganisation";
import { createPerson } from "../../src/actions/createPerson";
import { Deal } from '../../src/models/deal';
import { Status, Done } from '../../src/models/enums';
import { Note } from '../../src/models/note';
import { Organization } from '../../src/models/organization';
import { Person } from '../../src/models/person';
import { APIClient, APIResult } from '../../src/apiclient';
import { Activity } from '../../src/models/activity';
import { ComponentConfig } from '../../src/models/componentConfig';
import { PipedriveMessage } from '../../src/models/pipedriveMessage';

describe("Create a deal and all subitems", () => {
    let message = messages.newEmptyMessage();

    // Careful! this object is common data for all tests
    const data = {
        activity_subject: "Call Gordon Freeman",
        owner_id: 332632,
        deal_title: "Website: Black Mesa",
        deal_value: 1.000,
        deal_currency: "Euro",
        note_content: 'Can you integrate with the XEN based systems?',
        org_name: 'Black Mesa',
        person_name: 'Gordon Freeman',
        person_email: ['gordon.freeman@blackmesa.com'],
        person_phone: ['+01 2516/819813'],
    };
    message.body = data as PipedriveMessage;

    const config = {
        company_domain: "aperture",
        token: "i-am-real-token-yes",
        deal_note: "Just a simple note."
    } as ComponentConfig;

    var self = this;
    beforeEach(() => {
        self.emit = jest.fn();
    });

    if (process.env.COMPANY_DOMAIN && process.env.TOKEN && process.env.OWNER_ID && process.env.DEAL_NOTE) {

        // Create number to randomise input values
        let date = new Date();
        // Overwrite the static values
        data.person_name = 'Gordon Freeman' + (date.getMilliseconds() % 10000);
        data.org_name = 'Black Mesa' + (date.getMilliseconds() % 10000);
        data.owner_id = parseInt(process.env.OWNER_ID);
        config.company_domain = process.env.COMPANY_DOMAIN;
        config.token = process.env.TOKEN;
        config.deal_note = "Just a simple note.";

        it("should create an organization", async () => {
            expect.assertions(1);

            // Act
            let res = await createOrganisation.call(this, message, config, {});

            console.log('createOrganisation() realResult: ' + JSON.stringify(res));
            // Assert
            expect(res).toBeDefined();
        });

        it("should create a person", async () => {
            expect.assertions(1);

            // Act
            let res = await createPerson.call(this, message, config, {});

            console.log('createPerson() realResult: ' + JSON.stringify(res));
            // Assert
            expect(res).toBeDefined();
        });

        it("should create a deal", async () => {
            expect.assertions(1);

            // Act
            let res = await createDeal.call(this, message, config, {});

            console.log('createDeal() realResult: ' + JSON.stringify(res));
            // Assert
            expect(res).toBeDefined();
        });

        it("should create a note", async () => {
            expect.assertions(1);

            // Act
            let res = await createNote.call(this, message, config, {});

            console.log('createNote() realResult: ' + JSON.stringify(res));
            // Assert
            expect(res).toBeDefined();
        });

        it("should create an activity", async () => {
            expect.assertions(1);

            // Act
            let res = await createActivity.call(this, message, config, {});

            console.log('createActivity() realResult: ' + JSON.stringify(res));
            // Assert
            expect(res).toBeDefined();
        });
    } else {

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

        it("should mock creating an organization", async () => {
            expect.assertions(1);

            // Mock
            var createOrganizationAPI = nock("https://aperture.pipedrive.com/v1")
                .post("/organizations")
                .query({ 'api_token': config.token })
                .reply(200, { success: true, data: organization } as APIResult);

            // Act
            await createOrganisation.call(this, message, config, {});

            // Assert
            expect(createOrganizationAPI.isDone()).toBeTruthy();
        });

        it("should mock creating a person", async () => {
            expect.assertions(1);

            // Mock
            var createContactAPI = nock("https://aperture.pipedrive.com/v1")
                .post("/persons")
                .query({ 'api_token': config.token })
                .reply(200, { success: true, data: person } as APIResult);

            // Act
            await createPerson.call(this, message, config, {});

            // Assert
            expect(createContactAPI.isDone()).toBeTruthy();
        });

        it("should mock creating a deal", async () => {
            expect.assertions(1);

            // Mock
            var createDealAPI = nock("https://aperture.pipedrive.com/v1")
                .post("/deals")
                .query({ 'api_token': config.token })
                .reply(200, { success: true, data: deal } as APIResult);

            // Act
            await createDeal.call(this, message, config, {});

            // Assert
            expect(createDealAPI.isDone()).toBeTruthy();
        });

        it("should mock creating an activity", async () => {
            expect.assertions(1);

            // Mock
            var createActivityAPI = nock("https://aperture.pipedrive.com/v1")
                .post("/activities")
                .query({ 'api_token': config.token })
                .reply(200, { success: true, data: activity } as APIResult);

            // Act
            await createActivity.call(this, message, config, {});

            // Assert
            expect(createActivityAPI.isDone()).toBeTruthy();
        });

        it("should mock creating a notice", async () => {
            expect.assertions(1);

            // Mock
            var createNoteAPI = nock("https://aperture.pipedrive.com/v1")
                .post("/notes")
                .query({ 'api_token': config.token })
                .reply(200, { success: true, data: note } as APIResult);

            // Act
            await createNote.call(this, message, config, {});

            // Assert
            expect(createNoteAPI.isDone()).toBeTruthy();
        });
    }
});
