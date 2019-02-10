'use strict';

const Distinct = require('./lib/distinct');

module.exports = function (app) {
  app.loopback.modelBuilder.mixins.define('Distinct', Distinct);
};
