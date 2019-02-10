const _ = require('lodash');

module.exports = (Model, options) => {

  const defaultProperty = _.get(options, 'defaultProperty');

  const settings = _.merge({
    remote: { // Remote method settings
      enabled: false,
      name: 'distinctValues',
      definition: { // Remote method loopback options
        description: 'Find objects with distinct property',
        http: {
          path: '/distinctValues',
          verb: 'get',
        },
        accepts: [{
          arg: 'property',
          type: 'string',
          required: !defaultProperty,
        }, {
          arg: 'where',
          type: 'object',
          required: false,
        }],
        returns: {
          arg: 'objects',
          type: 'array',
          root: true,
        },
      },
    },
  }, options);

  if (settings.remote.enabled === true) {
    Model.remoteMethod(settings.remote.name, settings.remote.definition);
  }

  /**
   * Get distinct values of a property for existing model objects.
   * It can be called different ways:
   *  - distinctValues(property, where, next).
   *  - distinctValues(where, next) Only if defined defaultProperty.
   *  - distinctValues(next) Only if defined defaultProperty. No filter.
   *  * property {string} Specifies the name of the property to get distinct values.
   *  * where {object} Mongo filter.
   *  * next {function} Method callback. Receives error and result as arguments.
   * @param {...*} args Accepts different number of arguments.
   * @returns {void}
   */
  Model.distinctValues = function (...args) {
    const {property, where, next} = distinctArgs(args);
    if (property) {
      const collection = Model.getConnector().collection(Model.modelName);
      collection.distinct(property, where, (err, objects) => next(err, objects));
    }
  };

  /**
   * Parse "distinct" methods arguments to ensure they have correct values.
   * @param {arguments} params Arguments received in "distinct" methods
   * @returns {{property: string, where: object, next: function} | boolean}
   *  Valid arguments if could be parsed,
   *  otherwise return false and invoke next function with error.
   */
  function distinctArgs (params) {
    const args = Array.from(params);
    let property = defaultProperty;
    let where = {};
    let next = _.noop;
    while (args.length) {
      const arg = args.shift();
      if (typeof arg === 'string') {
        property = arg;
      } else if (_.isPlainObject(arg)) {
        where = arg;
      } else if (typeof arg === 'function') {
        next = arg;
      }
    }
    if (!property) {
      // Property is not specified and there is not a default one
      // Abort with error
      next(new Error('Must specify a property param'));
      return false;
    } else {
      return {property, where, next};
    }
  }

};
