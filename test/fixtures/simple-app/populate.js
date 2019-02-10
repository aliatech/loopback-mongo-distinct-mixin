'use strict';

const TestDataBuilder = require('loopback-testing').TestDataBuilder;

const Seeder = module.exports = {};

Seeder.seed = function (app, next) {
  const context = {};
  const Person = app.models.Person;
  const Company = app.models.Company;
  const City = app.models.City;
  new TestDataBuilder()
    .define('person1', Person, {name: 'a', company: 'A'})
    .define('person2', Person, {name: 'b', company: 'A'})
    .define('person3', Person, {name: 'c', company: 'A'})
    .define('person4', Person, {name: 'd', company: 'B'})
    .define('person5', Person, {name: 'a', company: 'B'})
    .define('person6', Person, {name: 'c', company: 'B'})
    .define('person7', Person, {name: 'c', company: 'B'})
    .define('company1', Company, {name: 'A', sector: 'X'})
    .define('company2', Company, {name: 'B', sector: 'X'})
    .define('company3', Company, {name: 'C', sector: 'X'})
    .define('company4', Company, {name: 'A', sector: 'X'})
    .define('company5', Company, {name: 'B', sector: 'Y'})
    .define('company6', Company, {name: 'B', sector: 'Y'})
    .define('company7', Company, {name: 'C', sector: 'Z'})
    .define('city1', City, {name: 'p', population: 1})
    .define('city2', City, {name: 'q', population: 2})
    .define('city3', City, {name: 'r', population: 2})
    .define('city4', City, {name: 's', population: 2})
    .define('city5', City, {name: 't', population: 3})
    .buildTo(context, (err) => next(err, context));
};
