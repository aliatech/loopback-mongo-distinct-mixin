/* eslint-disable require-jsdoc */

'use strict';

const should = require('should');
const app = require('./fixtures/get-app')('simple-app');
const Seeder = require('./fixtures/simple-app/populate');
const request = require('request');


describe('Distinct features', function () {

  const Person = app.models.Person;
  const Company = app.models.Company;

  const distinctPersonNames = ['a', 'b', 'c', 'd'];
  const distinctPersonNamesForCompanyB = ['d', 'a', 'c'];
  const distinctCompanyNames = ['A', 'B', 'C'];
  const distinctCompanyNamesForSectorY = ['B'];
  const distinctCompanySectors = ['X', 'Y', 'Z'];
  const distinctCityPopulations = [1, 2, 3];

  before(function (done) {
    Seeder.seed(app, done);
  });

  it('Should obtain distinct person names', (done) => {
    Person.distinctValues('name', (err, names) => {
      if (err) return done(err);
      should.exist(names);
      names.should.be.an.Array().and.eql(distinctPersonNames);
      done();
    });
  });

  it('Should obtain distinct person names with condition', (done) => {
    Person.distinctValues('name', {company: 'B'}, (err, names) => {
      if (err) return done(err);
      should.exist(names);
      names.should.be.an.Array().and.eql(distinctPersonNamesForCompanyB);
      done();
    });
  });

  it('Should obtain empty values specifying a property that does not exist', (done) => {
    Person.distinctValues('random', (err, names) => {
      if (err) return done(err);
      should.exist(names);
      names.should.be.an.Array().and.be.empty();
      done();
    });
  });

  it('Should get error calling without property cos person has no defaultProperty', (done) => {
    Person.distinctValues((err) => {
      should.exist(err);
      done();
    });
  });

  it('Should get 404 through the remote cos it\'s not enabled', (done) => {
    request(`${getApiUrl()}/Persons/distinctValues`, (err, res) => {
      if (err) return done(err);
      should.exist(res);
      res.statusCode.should.be.eql(404);
      done();
    });
  });

  it('Should obtain distinct company names using defaultProperty', (done) => {
    Company.distinctValues((err, names) => {
      if (err) return done(err);
      should.exist(names);
      names.should.be.an.Array().and.eql(distinctCompanyNames);
      done();
    });
  });

  it('Should obtain distinct company names through the remote with defaultProperty', (done) => {
    request(`${getApiUrl()}/Companies/distinctValues`, (err, res, body) => {
      if (err) return done(err);
      const names = assert200(res, body);
      names.should.be.an.Array().and.eql(distinctCompanyNames);
      done();
    });
  });

  it('Should obtain distinct company sectors through the remote', (done) => {
    request(`${getApiUrl()}/Companies/distinctValues`,
      {qs: {property: 'sector'}},
      (err, res, body) => {
        if (err) return done(err);
        const names = assert200(res, body);
        names.should.be.an.Array().and.eql(distinctCompanySectors);
        done();
      });
  });

  it('Should obtain distinct company names with condition through the remote', (done) => {
    request(`${getApiUrl()}/Companies/distinctValues`,
      {qs: {property: 'name', where: {sector: 'Y'}}},
      (err, res, body) => {
        if (err) return done(err);
        const names = assert200(res, body);
        names.should.be.an.Array().and.eql(distinctCompanyNamesForSectorY);
        done();
      });
  });

  it('Should obtain distinct city populations through a remote with custom http path', (done) => {
    request(`${getApiUrl()}/Cities/differentValues`,
      {qs: {property: 'population'}},
      (err, res, body) => {
        if (err) return done(err);
        const names = assert200(res, body);
        names.should.be.an.Array().and.eql(distinctCityPopulations);
        done();
      });
  });

  it('Should get 400 through the remote without property and no defaultProperty', (done) => {
    request(`${getApiUrl()}/Cities/differentValues`, (err, res) => {
      if (err) return done(err);
      should.exist(res);
      res.statusCode.should.be.eql(400);
      done();
    });
  });

});

function getApiUrl () {
  const protocol = app.get('protocol');
  const host = app.get('host');
  const port = app.get('port');
  const apiRoot = app.get('restApiRoot');
  return `${protocol}://${host}:${port}${apiRoot}`;
}

function assert200 (res, body) {
  should.exist(res);
  res.statusCode.should.be.eql(200);
  should.exist(body);
  return JSON.parse(body);
}
