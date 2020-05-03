const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let AccountModel = {};


const AccountSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accountId: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
  },
  accountType: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

AccountSchema.statics.toAPI = (doc) => ({
  // _id is built into your mongo document and is guaranteed to be unique
  displayName: doc.displayName,
  accessToken: doc.accessToken,
  refreshToken: doc.refreshToken,
  accountId: doc.accountId,
  link: doc.link,
  accountType: doc.accountType,
  _id: doc._id,
});

AccountSchema.statics.findByDisplayName = (name, callback) => {
  const search = {
    displayName: name,
  };
  console.log("Query name is: " + name);

  return AccountModel.findOne(search, callback);
};


AccountSchema.statics.authenticate = (name, callback) => {
  AccountModel.findByDisplayName(name, (err, doc) => {
    if (err) {
      return callback(err);
    }
    else if (!doc) {
      return callback();
    }
    return callback(null,doc);
  });
};





AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
