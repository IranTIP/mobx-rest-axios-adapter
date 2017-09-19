// @flow
import axios from 'axios'
import { forEach, isNull, merge } from 'lodash'
import qs from 'qs'

type Request = {
  abort: () => void;
  promise: Promise<*>;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type Options = {
  method: Method;
  headers?: ?{ [key: string]: string };
  data?: ?{ [key: string]: mixed };
  qs?: any;
}

function ajaxOptions (url: string, options: Options): ?{ } {
  if (options.method === 'GET' && options.data) {
    url = `${url}?${qs.stringify(options.data, options.qs)}`

    return {
      url,
      method: 'GET',
      headers: options.headers,
      responseType: 'json'
    }
  }

  const formData = new FormData()
  let hasFile = false

  forEach(options.data, (val: any, attr: string) => {
    hasFile = hasFile || val instanceof File
    if (!isNull(val)) formData.append(attr, val)
  })

  if (hasFile) {
    return {
      url,
      method: options.method,
      cache: false,
      processData: false,
      data: formData,
      headers: options.headers
    }
  }

  return {
    url,
    method: options.method,
    data: options.data,
    headers: options.headers,
    responseType: 'json'
  }
}

function ajax (url: string, options: Options): Request {
  const { CancelToken } = axios
  let cancel

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
