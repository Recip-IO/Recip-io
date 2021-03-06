const mongoose= require('mongoose');
const session = require('express-session');

mongoose.connect('mongodb://localhost/recipios');
var db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

// schema for new users
let userSchema = mongoose.Schema({
  username: String,
  email: String,
  date_created: { type: Date, default: Date.now },
  bio: { about: String, location: String },
  my_recipios: [],
  favorites: [],
  hash: String,
  salt: String
})

let User = mongoose.model('User', userSchema);

var user = new User();

user.save = function(err, user) {
  if (err) {
    console.error(err, null);
  }
  console.log(null, user);
}

let recipioSchema = mongoose.Schema({
  imageUrl: String,
  sourceDisplayName: String,
  ingredients: [''],
  id: String,
  recipeName: String,
  totalTimeInSeconds:  Number,
  attributes: {
      course: [''],
      cuisine: ['']
  },
  description: String,
  votes: { type: Number, default: 0 },
  favs: { type: Number, default: 0 },
  shares: { type: Number, default: 0 }
},
  {
    timestamps: true
  }
)


let Recipio = mongoose.model('Recipio', recipioSchema);

// var recipio = new Recipio();

const createRecipio = function(data, callback) {

  console.log('the data passed into createRecipio = ', data);

  var recipio = new Recipio({
    imageUrl: data.imageUrl,
    sourceDisplayName: data.sourceDisplayName,
    ingredients: data.ingredients,
    recipeName: data.recipeName,
    totalTimeInSeconds: data.totalTimeInSeconds,
    description: data.description
  });

  recipio.save(function (err) {
    if (err) return console.error(err);
    console.log('Recipe saved as new recipio.', recipio);
  })
}

const addYumRecipe = function(data, callback) {

  console.log('the data passed into createRecipio = ', data);

  var recipio = new Recipio({
    imageUrl: data.imageUrlsBySize[90],
    sourceDisplayName: data.sourceDisplayName,
    ingredients: data.ingredients,
    recipeName: data.recipeName,
    totalTimeInSeconds: data.totalTimeInSeconds,
    id: data.id
  });

  recipio.save(function (err) {
    if (err) return console.error(err);
    console.log('Yummly recipe saved as new recipio.', recipio);
  })
}

var getRecipios = function(callback) {
  Recipio.find({}).sort({favs: 'descending'}).limit().exec(callback);
};

var searchRecipios = function(data, callback) {
  var searchRecipeName = null;
  var searchIngredients = null;
  var searchSourceDisplayName = null;
  var searchDescription = null;

  if (data.recipeName.length > 0) {
    searchRecipeName = data.recipeName;
  }
  if (data.ingredients.length > 0) {
    searchIngredients = data.ingredients;
  }
  if (data.sourceDisplayName.length > 0) {
    searchSourceDisplayName = data.sourceDisplayName;
  }
  if (data.description.length > 0) {
    searchDescription = data.description;
  }

  Recipio.find({recipeName: searchRecipeName}).sort({createdAt: 'descending'}).limit().exec(callback);
};

var favIncrementer = function(id, callback) {
  Recipio.findOneAndUpdate({ _id: id }, { $inc: { 'favs': 1 }}).exec(callback);
};

var deleteRecipio = function(id, callback) {
  Recipio.findOneAndDelete(id).exec(callback);
}

module.exports.user = user;
module.exports.createRecipio = createRecipio;
module.exports.getRecipios = getRecipios;
module.exports.favIncrementer = favIncrementer;
module.exports.searchRecipios = searchRecipios;
module.exports.addYumRecipe = addYumRecipe;
module.exports.deleteRecipio = deleteRecipio;