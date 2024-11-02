import {
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  setAccessToken,
} from "./token";
import axios from "axios";
import { ResultSuccess, ResultError } from "./result";
import statusCodes from "./constants/status-codes";
import errorMessages from "./constants/error-messages";
import paths from "./constants/paths";
import CONTENT_TYPES from './constants/content-types';

function buildQueryString(query) {
  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}

async function getNewAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const headers = {
    "Content-Type": CONTENT_TYPES.JSON,
  };

  const config = {
    method: "post",
    url: paths.AUTH.TOKEN,
    headers: headers,
    data: { token: refreshToken },
  };

  const result = await makeRequestAbstract(config);
  if (!result.success) return null;

  return result.data.accessToken;
}

async function makeRequestAbstract(config, isProtected = false) {
  const BASE_PATH = "http://localhost:4000/api/" + (isProtected ? 'protected/' : 'public/');
  const mainConfig = { ...config, url: BASE_PATH + config.url }
  
  try {
    const result = await axios(mainConfig);
    return new ResultSuccess(result.data.data);
  } catch (e) {
    if (e.response) {
      let critical = false;
      let unauthorized = false;
      let forbidden = false;
      let notFound = false;

      switch (e.response.status) {
        case statusCodes.INTERNAL_SERVER_ERROR:
          critical = true;
          break;

        case statusCodes.UNAUTHORIZED:
          unauthorized = true;
          break;

        case statusCodes.FORBIDDEN:
          forbidden = true;
          break;

        case statusCodes.NOT_FOUND:
          notFound = true;
          break;

        default:
          break;
      }

      return new ResultError(
        critical ? errorMessages.UNEXPECTED_ERROR : e.response.data.error,
        critical,
        unauthorized,
        forbidden,
        notFound
      );
    }else if(e.request) {
      return new ResultError(errorMessages.CONNECTION_ERROR);
    }

    return new ResultError(errorMessages.UNEXPECTED_ERROR);
  }
}

export default async function makeRequest(
  url,
  method,
  data = null,
  header = {},
  query = {},
  isProtected = false
) {
  let accessToken = getAccessToken();

  let headers = {
    "Content-Type": CONTENT_TYPES.JSON,
    ...header,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (query && typeof query === 'object' && Object.keys(query).length > 0) {
    const queryString = buildQueryString(query);
    url += `?${queryString}`;
  }

  data ??= {};

  let config = {
    method,
    url,
    headers,
    data,
  };

  let result = await makeRequestAbstract(config, isProtected);
  if (result.unauthorized) {
    removeAccessToken();

    const newAccessToken = await getNewAccessToken();
    if (!newAccessToken) return result;

    setAccessToken(newAccessToken);

    headers = {
      ...headers,
      Authorization: "Bearer " + newAccessToken,
    };

    config = {
      ...config,
      headers: headers,
    };

    result = await makeRequestAbstract(config, isProtected);
  }

  return result;
}
