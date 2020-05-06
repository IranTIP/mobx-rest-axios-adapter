// @flow
import { AxiosInstance } from 'axios'
import forEach from 'lodash/forEach'
import isNull from 'lodash/isNull'
import merge from 'lodash/merge'
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
  const baseOptions: Object = {
    url,
    method: options.method,
    responseType: 'json'
  }

  if (options.headers) baseOptions.headers = options.headers

  if (options.method === 'GET' && options.data) {
    url = `${url}?${qs.stringify(options.data, options.qs)}`

    return Object.assign({}, baseOptions, { url })
  }

  const formData = new FormData()
  let hasFile = false

  forEach(options.data, (val: any, attr: string) => {
    hasFile = hasFile || val instanceof File || val instanceof Blob

    if (!isNull(val)) formData.append(attr, val)
  })

  if (hasFile) {
    return Object.assign({}, baseOptions, {
      cache: false,
      processData: false,
      data: formData
    })
  }

  return Object.assign({}, baseOptions, { data: options.data })
}

function ajax (url: string, options: Options, axiosInstance): Request {
  const { CancelToken } = axiosInstance
  let cancel

  const xhr = axiosInstance(ajaxOptions(url, options), {
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
        return reject(error.response)
      }
    )
  })

  const abort = () => {
    cancel()
  }

  return { abort, promise }
}

export default (axiosInstance: AxiosInstance) => ({
  apiPath: '',
  commonOptions: {},

  get (path: string, data: ?{ }, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'GET', data }, this.commonOptions, options),
      axiosInstance
    )
  },

  post (path: string, data: ?{ }, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'POST', data }, this.commonOptions, options),
      axiosInstance
    )
  },

  put (path: string, data: ?{ }, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'PUT', data }, this.commonOptions, options),
      axiosInstance
    )
  },

  patch (path: string, data: ?{ }, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'PATCH', data }, this.commonOptions, options),
      axiosInstance
    )
  },

  del (path: string, options?: {} = {}): Request {
    return ajax(
      `${this.apiPath}${path}`,
      merge({}, { method: 'DELETE' }, this.commonOptions, options),
      axiosInstance
    )
  }
})
