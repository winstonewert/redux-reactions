import { Schemas } from '../middleware/api'
import apiDriver from './api'
import {USER_SUCCESS, USER_FAILURE, REPO_SUCCESS, REPO_FAILURE, STARRED_SUCCESS, STARRED_FAILURE, STARGAZERS_SUCCESS, STARGAZERS_FAILURE} from '../actions'



// Fetches a single user from Github API.
function fetchUser(login) {
  return {
      type: 'GITHUB_API',
      endpoint: `users/${login}`,
      schema: Schemas.USER,
      events: {
          resolved: (response) => ({type: USER_SUCCESS, response}),
          rejected: (response) => ({type: USER_FAILURE, response}),
      }
  }
}

// Fetches a single repository from Github API.
// Relies on the custom API middleware defined in ../middleware/api.js.
function fetchRepo(fullName) {
  return {
     type: 'GITHUB_API',
     endpoint: `repos/${fullName}`,
     schema: Schemas.REPO,
     events: {
         resolved: (response) => ({type: REPO_SUCCESS, response}),
         rejected: (response) => ({type: REPO_FAILURE, response}),
     }
  }
}

// Fetches a page of starred repos by a particular user.
function fetchStarred(login, nextPageUrl = `users/${login}/starred`) {
  return {
      type: 'GITHUB_API',
      endpoint: nextPageUrl,
      schema: Schemas.REPO_ARRAY,
      events: {
         resolved: (response) => ({type: STARRED_SUCCESS, response, login}),
         rejected: (response) => ({type: STARRED_FAILURE, response, login}),
      }
  }
}

// Fetches a page of stargazers for a particular repo.
function fetchStargazers(fullName, nextPageUrl = `repos/${fullName}/stargazers`) {
  return {
    type: 'GITHUB_API',
    endpoint: nextPageUrl,
    schema: Schemas.USER_ARRAY,
    events: {
      resolved: (response) => ({type: STARGAZERS_SUCCESS, response, fullName}),
      rejected: (response) => ({type: STARGAZERS_FAILURE, response, fullName}),
    }
  }
}

function fetchData(id, entities, requiredFields, actionCreator) {
    if (!id) {
        // we don't have a id to fetch yet.
        return false;
    }

    var entity = entities[id];
    if (entity && requiredFields.every(key => entity.hasOwnProperty(key))) {
        // We already have the data we need, no need to fetch it.
        return false;
    }

    return actionCreator(id);
}

function fetchPaginatedData(id, paginations, actionCreator) {
    if (!id) {
        return false;
    }

    var pagination = paginations[id];
    if (pagination && !pagination.isFetching) {
        return false;
    }

    return actionCreator(id, (pagination && pagination.nextPageUrl) ? pagination.nextPageUrl : undefined)
}

export function reactions(state) {
    var x = _(state.router.components)
        .map('reactions')
        .filter() // remove components that don't have a reactions function.
        .transform((t) => {console.log("X", t);t(state)})
        .flatten()
        .value();
    console.log(x);

    return [];
}

function old() {
    var {login, name} = state.router.params;
    var repo = (login && name) ? `${login}/${name}` : undefined;
    return [
        fetchData(login, state.entities.users, ['name'], fetchUser),
        fetchData(repo, state.entities.repos, ['description'], fetchRepo),
        fetchPaginatedData(login, state.pagination.starredByUser, fetchStarred),
        fetchPaginatedData(repo, state.pagination.stargazersByRepo, fetchStargazers)
    ]
}

export const REACTION_TYPES = {
    GITHUB_API: apiDriver
}
