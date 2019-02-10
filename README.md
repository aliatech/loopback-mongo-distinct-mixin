
# Loopback Distinct mixin for MongoDB

Provide to models the ability to query distinct values from database

This is a Loopback mixin to be used together with MongoDB connector.
Works for Loopback 2 and 3.

## How to install

Install the package through NPM

```bash
npm i -S loopback-mongo-distinct-mixin
```

or Yarn

```bash
yarn add loopback-mongo-distinct-mixin
```

## Server configuration

Include the mixin in `server/model-config.json`:

```json
{
  "_meta": {
    "sources": [
      "loopback/common/models",
      "loopback/server/models",
      "../common/models",
      "./models"
    ],
    "mixins": [
      "loopback/common/mixins",
      "../node_modules/loopback-mongo-distinct-mixin/lib",
      "../common/mixins"
    ]
  }
}
```

## Usage

Enable the mixin in your model definition, ie `person.json`.

### Basic configuration

```json
{
  "name": "Person",
  "properties": {
    "name": "string",
    "company": "string"
  },
  "mixins": {
    "Distinct": true
  }
}
```

Now you can query for distinct values this way:

```js
app.models.Person.distinctValues('name', (err, names) => {
  if (err) return next(err);
  console.log(names);
  // names = ['john', 'mary', 'anne', ...]
});
```

### Advanced configuration

Enable the mixin passing an options object instead of just true.

**These are the available options:**

| Option            | Type      | Required  | Description                                                                                                                                                                                                                                                                                           |
| ------------------| ----------| --------- | ----------------- |
| defaultProperty   | string    | optional  | Default property name to get values. With this option, it won't be required to specify property argument. |
| remote            | object    | optional  | Customize a remote method to call distinct feature.                                                                                                                                                                                                                                                                                   |
| remote.enabled    | boolean   | optional  | Enable a remote method for `distinctValues`. (default `false`) |
| remote.name       | string    | optional  | Name of the remote method. (default `'distinctValues'`) |
| remote.definition | object    | optional  | The Loopback definition of the remote method. |

**Default options**

These are the default options that will be merged with the model specifics:

```json
{
  "remote": {
    "enabled": false,
    "name": "distinctValues",
    "definition": {
      "description": "Find objects with distinct property",
      "http": {
        "path": "/distinctValues",
        "verb": "get"
      },
      "accepts": [{
        "arg": "property",
        "type": "string",
        "required": true
      }, {
        "arg": "where",
        "type": "object",
        "required": false
      }],
      "returns": {
        "arg": "objects",
        "type": "array",
        "root": true
      }
    }
  }
}
```

Note that `property` argument will required only if `defaultProperty` is not set.

### Advanced usage

#### Call distinct values with filter.

````js
app.models.Person.distinctValues('name', {company: 'alia'}, (err, names) => {
  // Got distinct names for objects having company = 'alia'
});
````

#### Call distinct values using a default property.

1. Configure `defaultProperty` option
2. Call `distinctValues` omitting property argument

````js
app.models.Person.distinctValues((err, names) => {
  // Do something
});
````

Using default property and a filter:

````js
app.models.Person.distinctValues({company: 'alia'}, (err, names) => {
  // Do something
});
````

#### Remote distinctValues

1. Configure `remote.enabled` option to be true
2. Call through the API

````js
const request = require('request');

request('http://localhost:3000/api/Person/distinctValues',
  {qs: {property: 'name', where: {company: 'alia'}}},
  (err, res, body) => {
    if (err) return next(err);
    if (res.statusCode === 200){
      const names = JSON.parse(body);
      // Do something
    }
});
````

# Testing

````bash
npm test
````
