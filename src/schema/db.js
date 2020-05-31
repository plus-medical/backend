// Instantiate Couchbase and Ottoman
const couchbase = require('couchbase');
const ottoman = require('ottoman');
const debug = require('debug')('app:couchbase');

const {
  config: {
    dev, dbPassword, dbUrl, dbName,
  },
} = require('../config');

// Build my cluster object and open a new cluster
const connectionString = dev !== 'production' ? `${dbUrl}?detailed_errcodes=1` : `${dbUrl}`;
debug(connectionString);

const myCluster = new couchbase.Cluster(connectionString);
const myBucket = myCluster.openBucket(dbName, encodeURIComponent(dbPassword));
ottoman.store = new ottoman.CbStoreAdapter(myBucket, couchbase);
// ottoman.bucket.operationTimeout = 120 * 1000;

// Build my "schema" from my model files
require('./models/exam');
require('./models/laboratory');
require('./models/user');
require('./models/clinicHistory');

// Build the necessary indexes to function
ottoman.ensureIndices((err) => {
  if (err) return debug(err);
  return debug('ensure indices - OK');
});
