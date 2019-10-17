import { Environment } from '../Environment';
import { AsyncTaskContext } from '../ApplicationContext';
const urljoin = require('url-join');

import 'isomorphic-fetch';


export function getFile<T>(path: string, asyncTaskContext: AsyncTaskContext): Promise<T> {
  let getFilePromise: Promise<T> = new Promise((resolve, reject) => {
    let fullUrl = path;
    if (!isUrlAbsolute(path)) {
      fullUrl = urljoin(apiBaseUrl(asyncTaskContext), path);
    }

    fetch(fullUrl)
      .then(res => res.json())
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });

  asyncTaskContext.addTask(getFilePromise);
  return getFilePromise;
}

/** 
 * See https://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative (Philipp) 
 */
function isUrlAbsolute(url: string): boolean {
  return url.indexOf('//') === 0 ? true : url.indexOf('://') === -1 ? false : url.indexOf('.') === -1 ? false : url.indexOf('/') === -1 ? false : url.indexOf(':') > url.indexOf('/') ? false : url.indexOf('://') < url.indexOf('.') ? true : false;
}

/**
 * Get the base url for calling api methods. When doing client-side api calls and no baseUrl is specifed the base url is the 
 * root url of the website the component lives in. When doing server-side rendering we use Hypernova running on a seperate server. 
 * In that case the base url comes from the metadata.baseUrl of the Hypernova call, and is specified in asyncTaskContext.baseUrl.
 */
function apiBaseUrl(asyncTaskContext: AsyncTaskContext): string {
  if (!asyncTaskContext.baseUrl && !Environment.isServer && window.location) { 
    return `${window.location.protocol}//${window.location.host}`;
  } else {
    return asyncTaskContext.baseUrl;
  }
}