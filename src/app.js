const express = require("express");
const cors = require("cors");
const {uuid} = require('uuidv4')

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next){
  const {method, url} = request;

  console.log(`[${method}] ${url}`);

  return next();
}

app.use(logRequests);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  //Reciving the data from body of HTTP.
  const {title, url, techs} = request.body;

  //Creating a new repository.
  const repository = {
    id: uuid(),
    title,
    url,
    techs, 
    like: 0
  };

  //Adding the new repository in the array.
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
