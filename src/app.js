const express = require("express");
const cors = require("cors");
const {uuid, isUuid} = require('uuidv4')

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/*
  Middleware to show the method and 
  URL of requests.
*/
function logRequests(request, response, next){
  //Getting the method and url from HTTP.
  const {method, url} = request;

  console.log(`[${method}] ${url}`);

  return next();
}

app.use(logRequests);

//Endpoint to get the list of repositories.
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

//Endpoint to post a new repository.
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

  return response.status(201).json(repository);
});

//Endpoint to update an existing repository.
app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  //Check if the ID is valid. 
  if(!isUuid(id)) return response.status(400).json({error: 'This is not a valid id.'});  

  //Find the repository using the ID.
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  //If doesn't existe will send a error message.
  if(repositoryIndex < 0) return response.status(400).json({error: "Repository doesn't exist."});

  //Creating a new repository. 
  const newRepository = {
    id,
    title,
    url,
    techs,
    like: repositories[repositoryIndex].like
  }

  //Updating the old repository. 
  repositories[repositoryIndex] = newRepository;

  return response.status(200).json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  //Check if the ID is valid. 
  if(!isUuid(id)) return response.status(400).json({error: 'This is not a valid id.'});  

  //Find the repository using the ID.
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  //If doesn't existe will send a error message.
  if(repositoryIndex < 0) return response.status(400).json({error: "Repository doesn't exist."});

  //Remove the deleted repository.
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

/*
Endpoint to increment the number of likes of the repository.
*/
app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  //Check if the ID is valid. 
  if(!isUuid(id)) return response.status(400).json({error: 'This is not a valid id.'});  

  //Find the repository using the ID.
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  //If doesn't existe will send a error message.
  if(repositoryIndex < 0) return response.status(400).json({error: "Repository doesn't exist."});

  //Incrementing the number of likes.
  repositories[repositoryIndex].like = repositories[repositoryIndex].like + 1;

  //Returning the repository.
  let repository = repositories[repositoryIndex];

  return response.status(200).json(repository);
});

module.exports = app;
