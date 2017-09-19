// @flow
import axios from 'axios'
import { merge } from 'lodash'
import qs from 'qs'

type Request = {
  abort: () => void;
  promise: Promise<*>;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type Options = {
  method: Method;
  headers?: any;
  data?: any;
  qs?: any;
}

function ajaxOptions (url: string, options: Options): ?{ } {
  return {
    url,
    method: options.method,
    data: options.data,
    responseType: 'json'
  }
}

function ajax (url: string, options: Options): Request {
  const { CancelToken } = axios
  let cancel

  if (options.method === 'GET' && options.data) {
    url = `${url}?${qs.stringify(options.data, options.qs)}`
    delete options.data
  }

  const xhr = axios(ajaxOptions(url, options), {
    cancelToken: new CancelToken((c) => {
      cancel = c
    })
  })

  const promise = new Promise((resolve, reject) => {
    xhr.then(
      (response) => {
        return resolve(response.data)
      },
      (error) => {
        return reject(error.response.data)
      }
    )
  })

  const abort = () => {
    cancel()
  }

  return { abort, promise }
}

export default {
  apiPath: '',
  commonOptions: {},

  get (path: string, data: ?{ }, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'GET', data }, this.commonOptions, options)
    )
  },

  post (path: string, data: ?{ }, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'POST', data }, this.commonOptions, options)
    )
  },

  put (path: string, data: ?{ }, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'PUT', data }, this.commonOptions, options)
    )
  },

  del (path: string, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'DELETE' }, this.commonOptions, options)
    )
  }
}
