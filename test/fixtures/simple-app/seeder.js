/* eslint-disable require-jsdoc */

'use strict';

const async = require('async');

module.exports = class Seeder {

  constructor (app) {
    this.app = app;
    this.context = {};
  }

  seed (next) {
    const Person = this.app.models.Person;
    const Company = this.app.models.Company;
    const City = this.app.models.City;
    const context = this.context;
    const personsData = [
      {name: 'a', company: 'A'},
      {name: 'b', company: 'A'},
      {name: 'c', company: 'A'},
      {name: 'd', company: 'B'},
      {name: 'a', company: 'B'},
      {name: 'c', company: 'B'},
      {name: 'c', company: 'B'},
    ];
    const companiesData = [
      {name: 'A', sector: 'X'},
      {name: 'B', sector: 'X'},
      {name: 'C', sector: 'X'},
      {name: 'A', sector: 'X'},
      {name: 'B', sector: 'Y'},
      {name: 'B', sector: 'Y'},
      {name: 'C', sector: 'Z'},
    ];
    const citiesData = [
      {name: 'p', population: 1},
      {name: 'q', population: 2},
      {name: 'r', population: 2},
      {name: 's', population: 2},
      {name: 't', population: 3},
    ];
    // Seed persons
    async.mapSeries(personsData, (personData, nextItem) => {
      Person.create(personData, nextItem);
    }, (err, persons) => {
      if (err) return next(err);
      context.persons = persons;
      context.persons.forEach((person, i) => context[`person${i + 1}`] = person);
      // Seed companies
      async.mapSeries(companiesData, (companyData, nextItem) => {
        Company.create(companyData, nextItem);
      }, (err, companies) => {
        if (err) return next(err);
        context.companies = companies;
        context.companies.forEach((company, i) => context[`company${i + 1}`] = company);
        // Seed cities
        async.mapSeries(citiesData, (cityData, nextItem) => {
          City.create(cityData, nextItem);
        }, (err, cities) => {
          if (err) return next(err);
          context.cities = cities;
          context.cities.forEach((city, i) => context[`city${i + 1}`] = city);
          next(null, context);
        });
      });
    });
  }

};
