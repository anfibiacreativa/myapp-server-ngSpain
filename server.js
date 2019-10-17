const express = require('express')
const express_graphql = require('express-graphql')
const cors = require('cors')
const bodyParser = require('body-parser')
const { buildSchema } = require('graphql')
const fs = require('fs');
const catsFile = './cats.json';

// Schema for our GraphQL validation
const schema = buildSchema(`
    type Query {
        message: String
        kitten(id: String!): Kitten,
        kittens(id: String): [Kitten],
    }
    type Mutation {
        createKitty(input: KittyInput): Kitten
    }
    type Kitten {
        id: String,
        name: String
    }
    input KittyInput {
        id: String,
        name: String
    }
`)

const parseBuffer = function(file) {
  const catsBuffer = fs.readFileSync(file);
  return JSON.parse(catsBuffer);
}

const getKitten = function(parent, args) {
  kittenData = parseBuffer(catsFile);
  const newCat = parent.input;
  if (newCat && newCat.id) {
      kittenData.filter(kitten => kitten.id === newCat.id);
  } else {
      return kittenData;
  }
}

const addKitty = function(parent, args) {
  const cat = parent.input;
  cats = parseBuffer(catsFile);
  console.log(cats);
  cats.push({
    id: cat.id,
    name: cat.name
  });

  fs.writeFile(catsFile, JSON.stringify(cats), function(error) {
    if (error) {
        return console.log(error + 'Mission failed.');
    }
    console.log('A new cat is in queue to space');
  });

  return cat; 
}

// Resolves the root of your API
const root = {
    message: () => 'API Server ready!',
    kittens: getKitten,
    kitten: getKitten,
    createKitty: addKitty
}

// Get all the cats

// const kittenData = {};
// Define cors options to be able to use cross doamin resource sharing
const corsOptions = {
  origin: '*',
  credentials: false,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
}
// Starts up the server and defines the port to reach the endpoint, returning `message` at the root
const app = express().use(cors(corsOptions)).use(bodyParser.json());
app.use('/api', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}))
app.listen(8000, err => {
    if (err) {
      return console.log(err);
    }
    return console.log('GraphQL server is up and running on localhost:8000/api');
})
