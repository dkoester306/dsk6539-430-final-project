const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let PlaylistModel = {};
const convertId = mongoose.Types.ObjectId;

// const PlaylistEntrySchema = new mongoose.Schema({
//     title: String,
//     artist: String,
//     album: String,
//     link: String,
//     img: String,
//     id: String,
// });


const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  tracks: [{
    img: String,
    title: String,
    artist: String,
    album: String,
    link: String,
  }],
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Playlist',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

PlaylistSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  tracks: doc.tracks,
});

PlaylistSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return PlaylistModel.find(search).select('name tracks').lean().exec(callback);
};

PlaylistSchema.statics.findByName = (searchName, callback) => {
  const search = {
    name: searchName,
  };
  return PlaylistModel.findOne(search, callback);
};


PlaylistModel = mongoose.model('Playlist', PlaylistSchema);


module.exports.PlaylistModel = PlaylistModel;
module.exports.PlaylistSchema = PlaylistSchema;
