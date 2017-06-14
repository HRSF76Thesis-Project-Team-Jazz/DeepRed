const request = require('supertest');
const express = require('express');
const expect = require('chai').expect;
const game = require('../routes/game');

describe('get new game instance route', () => {
    it('sends back new game instance', (done) => {
        request(game)
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(typeof(res.text)).to.equal('object');
        })
        .end(done);
    });

    it('send Posted back to the sender', (done) => {
        request(game)
        .post('/')
        .expect(201)
        .expect((res) => {
          expect(res.data).to.equal('Posted!');
        })
        .end(done);
    });
});

// describe('')