import { Environment } from '../Environment';
import { AsyncTaskContext } from '../ApplicationContext';
const urljoin = require('url-join');

import 'isomorphic-fetch';

export type AsyncData<T> = {
  readonly loading: boolean;
  readonly data?: T | null;
};

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
}

export const getUsersOld = (asyncTaskContext: AsyncTaskContext) => {
  if (process.env.NODE_ENV === 'development') { 
    var getUsersTimerName = `getUsers(random:${Math.random()})`;
    console.time(getUsersTimerName); 
  }
  
  const promise = new Promise<UserData[]>(resolve => {
    const getUsersPromise = fetch('https://reqres.in/api/users?per_page=10', {
      method: 'GET',
    }).then((res: any) => {
      if (process.env.NODE_ENV === 'development') { console.timeEnd(getUsersTimerName); }
      
      if (res.status === 200) {
        let json: any = res.json();
        let users: UserData[] = json.data;
        resolve(users);
      } else {
        resolve([]);
      }
    });
    asyncTaskContext.addTask(getUsersPromise);
  });
  asyncTaskContext.addTask(promise);
  return promise;
};

// export function getUsers(asyncTaskContext: AsyncTaskContext): Promise<UserData[]> {
//   let getUsersPromise: Promise<UserData[]> = new Promise((resolve, reject) => {
//     fetch('https://reqres.in/api/users?per_page=10')
//       .then(res => res.json())
//       .then(res => {
//         resolve(res.data);
//       })
//       .catch(error => {
//         reject(error);
//       });
//   });

//   asyncTaskContext.addTask(getUsersPromise);
//   return getUsersPromise;
// }

export function getUsers(asyncTaskContext: AsyncTaskContext): Promise<UserData[]> {
  let getUsersPromise: Promise<UserData[]> = new Promise((resolve, reject) => {
    fetch('https://reqres.in/api/users?per_page=10')
      .then(res => res.json())
      .then(res => {
        resolve(res.data);
      })
      .catch(error => {
        reject(error);
      });
  });

  return getUsersPromise;
}

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