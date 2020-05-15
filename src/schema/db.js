// const debug = require('debug')('app:server');
// const couchbase = require('couchbase');
// const ottoman = require('ottoman');

// const bucketName = 'plus';
// const password = 'uq*n$7ilhKq202x7lw5nlabs)FmItziRJ]dJ!qUdmql8tfid';

// const myCluster = new couchbase.Cluster('couchbase://db');
// const myCluster = new couchbase.Cluster('localhost:8091');

// const myBucket = myCluster.openBucket(bucketName, password, (err) => {
// if (err) {
// debug(err);
// } else debug(`${bucketName} bucket open`);
// });
// ottoman.bucket.operationTimeout = 120 * 1000;
// ottoman.store = new ottoman.CbStoreAdapter(myBucket, couchbase);

// require('./model/person');
// require('./model/user');

// ottoman.ensureIndices((err) => {
//   if (err) return debug(err);
// });
