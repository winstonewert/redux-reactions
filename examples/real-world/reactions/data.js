import { Schemas } from './api'
import { USER_SUCCESS, USER_FAILURE, REPO_SUCCESS, REPO_FAILURE, STARRED_SUCCESS, STARRED_FAILURE, STARGAZERS_SUCCESS, STARGAZERS_FAILURE } from '../actions'

// Fetches a single user from Github API.
export function fetchUser(login) {
  return {
    type: 'GITHUB_API',
    endpoint: `users/${login}`,
    schema: Schemas.USER,
    events: {
      resolved: (response) => ({ type: USER_SUCCESS, response }),
      rejected: (response) => ({ type: USER_FAILURE, response })
    }
  }
}

// Fetches a single repository from Github API.
export function fetchRepo(fullName) {
  return {
    type: 'GITHUB_API',
    endpoint: `repos/${fullName}`,
    schema: Schemas.REPO,
    events: {
      resolved: (response) => ({ type: REPO_SUCCESS, response }),
      rejected: (response) => ({ type: REPO_FAILURE, response })
    }
  }
}

// Fetches a page of starred repos by a particular user.
export function fetchStarred(login, nextPageUrl = `users/${login}/starred`) {
  return {
    type: 'GITHUB_API',
    endpoint: nextPageUrl,
    schema: Schemas.REPO_ARRAY,
    events: {
      resolved: (response) => ({ type: STARRED_SUCCESS, response, login }),
      rejected: (response) => ({ type: STARRED_FAILURE, response, login })
    }
  }
}

// Fetches a page of stargazers for a particular repo.
export function fetchStargazers(fullName, nextPageUrl = `repos/${fullName}/stargazers`) {
  return {
    type: 'GITHUB_API',
    endpoint: nextPageUrl,
    schema: Schemas.USER_ARRAY,
    events: {
      resolved: (response) => ({ type: STARGAZERS_SUCCESS, response, fullName }),
      rejected: (response) => ({ type: STARGAZERS_FAILURE, response, fullName })
    }
  }
}

export function dataReactions(id, entities, paginations, requiredFields, fetchEntity, fetchRelated) {
  var entity = entities[id]
  var pagination = paginations[id]
  return [
    (!entity || !requiredFields.every(key => entity.hasOwnProperty(key))) && fetchEntity(id),
    (!pagination || pagination.isFetching) && fetchRelated(id, pagination && pagination.nextPageUrl)
  ]
}
