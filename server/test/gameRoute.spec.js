const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const app = require('../app.js')

describe('server game route', () => {
  it('sends back new game instance', (done) => {
    request(app)
    .get('/api/game')
    .expect(200)
    .expect(res => {
        expect(typeof(res.text)).to.equal('string');
    })
    .end(done);
  });

  it('send Posted back to the sender', (done) => {
    request(app)
    .post('/api/game')
    .expect(201)
    .expect(res => {
      expect(res.body.data).to.equal('Posted!');
    })
    .end(done);
  });
});

describe('updateUserGameStat handler', () => {
  it('update user game status after each game', (done) => {
    request(app)
    .post('/api/game/updateUserGameStat')
    .expect(res => {
      expect(res.text).to.equal('done');
    })
    .end(done);
  });
});

describe('Watson conversation handler', () => {
  it('should return capture message for the capturing side', (done) => {
    request(app)
    expect(201)
    .post('/api/game/conversation')
    .expect(res => {
    // console.log(res);
    // continue implementation
    })
    .end(done);
  });
});