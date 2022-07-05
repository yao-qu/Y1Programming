/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';

const request = require('supertest');
const app = require('./app');

// thanks to Nico Tejera at https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
// returns something like "access_token=concertina&username=bobthebuilder"
function serialise (obj) {
    return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}

describe('Test casebook API', () => {
    test('GET /search succeeds', () => {
        return request(app)
.get('/search?keyword=Arriving in Paradise')
.expect(200);
    });

    test('GET /search returns JSON', () => {
        return request(app)
.get('/search?keyword=Arriving in Paradise')
.expect('Content-type', /json/);
    });

    test('GET /search includes keyword', () => {
        return request(app)
.get('/search?keyword=Paradise')
.expect([{
 id: 1,
season: '1',
episode: '1',
title: 'Arriving in Paradise',
detective: 'Detective Inspector Richard Poole',
victim: 'Detective Inspector Charlie Hulme and James Lavender',
culprit: 'Sergeant Lily Thomson',
cause: 'Gun shot',
        description: "Charlie Hulme, a British detective inspector, is found murdered in a locked panic room on the Caribbean island of Saint Marie. Commissi1r Selwyn Patterson demands that a UK officer investigates Charlie's death, so DI Richard Poole flies out to Saint Marie to solve the mystery. Richard learns that Charlie was having an affair with Sarah, 1 of the residents on the island, providing Sarah's husband with a motive to murder. Richard is convinced he has solved the case, but then Sarah's husband is also murdered, forcing Richard to look deeper into the case, and search for a mysterious woman seen at the house on the day of Charlie's death.",
        thumbnail: 'http://127.0.0.1:8090/images/dip11.png'
}]);
    });

    test('POST /newcase succeeds', () => {
        const params = {
            season: '1',
            episode: '5',
            title: 'Spot the Difference',
            detective: 'Detective Inspector Richard Poole',
            victim: 'Vincent Carter and Ann Hamilton',
            culprit: 'Leon Hamilton',
            cause: 'Stabbed and Fall',
            description: "Richard is embarrassed when a prisoner is stabbed in the back whilst handcuffed to him. Realising that his career may be over if he is unable to uncover who the murderer is, Richard looks into the prisoner's criminal history and learns he was a fraudster. With many of the suspects wanting the prisoner dead, Richard turns his attentions to the widow of the victim, convinced she knows more than she claims she does. The breakthrough clue in the case is the unexpected death of Anne Hamilton, exposing who the original murderer is.",
            thumbnail: 'http://127.0.0.1:8090/images/ni.png'
        };

        return request(app)
.post('/newcase')
.send(params)
.expect(200);
    });

    test('POST /newcase adds data to be accessed via GET', async () => {
        const params = {
            season: '1',
            episode: '6',
            title: 'An Unhelpful Aid',
            detective: 'Detective Inspector Richard Poole',
            victim: 'Mark Lightfoot',
            culprit: 'Benjamin Lightfoot',
            cause: 'Drowning',
            description: 'Dwayne and Fidel unite to solve the death of an experienced diver who drowns in ten feet of water when Richard falls ill with the fever and Camille is in Paris. As they begin to investigate the diver\'s death, the pair are quick to establish the diver was murdered. DS Angela Young, a British detective on holiday, begins to intervene in the case and attempts to solve the mystery herself, but when she lacks progress in the investigation, Dwayne and Fidel go behind Angela\'s back and present Richard with all the evidence they have gathered, leading Richard to solve the murder before Angela.',
            thumbnail: 'http://127.0.0.1:8090/images/ni.png'
        };

        await request(app)
.post('/newcase')
.send(params);

        return request(app)
.get('/search?keyword=Unhelpful')
.expect('Content-type', /json/);
    });

    test('POST /newcomment adds comment to be accessed via GET', async () => {
        const params = {
            Admin: 'Yao',
            Image: 'https://img.icons8.com/flat_round/64/000000/wolf--v1.png',
            Comment: 'Test - using Jest'
        };

        await request(app)
.post('/newcomment')
.send(params);
// Only tested return JSON and not data due to time stamp used
        return request(app)
.get('/comment/1')
.expect('Content-type', /json/);
    });
});
