const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose:index');

const config = require('./config');

// connect to mongo db
const mongoUri = `mongodb+srv://${config.mongo.user}:${config.mongo.password}@${config.mongo.host}/${config.mongo.db}`;
const mongoConfig = {
  keepAlive: 1,
  useNewUrlParser: true,
  useCreateIndex: true
};

mongoose.connect(mongoUri, mongoConfig)
  .then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    },
    (err) => {
      throw new Error(`unable to connect to database: ${mongoUri}, ${err}`);
    }
  );

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}
