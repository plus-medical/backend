const debug = require('debug')('app:server');

// Instantiate Couchbase and Ottoman
const couchbase = require('couchbase');
const ottoman = require('ottoman');

const {
  config: {
    dev, dbPassword, dbUrl, dbName,
  },
} = require('../config');

// console.log(dbPassword);

// Build my cluster object and open a new cluster
const connectionString = dev !== 'production' ? `${dbUrl}?detailed_errcodes=1` : `${dbUrl}`;
const myCluster = new couchbase.Cluster(connectionString);
const myBucket = myCluster.openBucket(dbName, encodeURIComponent(dbPassword));
ottoman.store = new ottoman.CbStoreAdapter(myBucket, couchbase);

// Build my "schema" from my model files
require('./models');

// Build the necessary indexes to function
ottoman.ensureIndices((err) => {
  if (err) return debug(err);
});
