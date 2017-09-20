import createAdapter from '../src'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

const adapter = createAdapter(axios)

adapter.apiPath = '/api'
adapter.commonOptions = {}

beforeEach(() => {
  mock.reset()
})

describe('adapter', () => {
  describe('get', () => {
    let ret
    const data = { manager_id: 2 }

    const action = () => {
      ret = adapter.get('/users', data)
    }

    describe('when it resolves', () => {
      const values = { id: 1, name: 'paco' }

      beforeEach(() => {
        mock.onGet('/api/users?manager_id=2').reply(200, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise.then((vals) => {
          expect(vals).toEqual(values)
        })
      }, 10000)
    })

    describe('when it fails', () => {
      const values = { errors: ['foo'] }

      beforeEach(() => {
        mock.onGet('/api/users?manager_id=2').reply(400, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise
          .then(() => fail('Request didn\'t fail'))
          .catch((vals) => {
            expect(vals).toEqual(values)
          })
      })
    })
  })

  describe('post', () => {
    let ret
    let data

    const action = () => {
      ret = adapter.post('/users', data)
    }

    describe('when it resolves', () => {
      const values = { id: 1, name: 'paco' }

      beforeEach(() => {
        data = { name: 'paco' }
        mock.onPost('/api/users').reply(200, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise.then((vals) => {
          expect(vals).toEqual(values)
        })
      })
    })

    describe('when it fails', () => {
      const values = { errors: ['foo'] }

      beforeEach(() => {
        data = { name: 'paco' }
        mock.onPost('/api/users').reply(400, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise
          .then(() => fail('Request didn\'t fail'))
          .catch((vals) => {
            expect(vals).toEqual(values)
          })
      })
    })

    describe('when it contains a file', () => {
      const values = { id: 1, avatar: 'lol.png' }

      beforeEach(() => {
        data = { avatar: new File([''], 'filename') }
        mock.onPost('/api/users').reply(201, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise.then((vals) => {
          expect(vals).toEqual(values)
        })
      })
    })
  })

  describe('put', () => {
    let ret
    const data = { name: 'paco' }

    const action = () => {
      ret = adapter.put('/users', data)
    }

    describe('when it resolves', () => {
      const values = { id: 1, name: 'paco' }

      beforeEach(() => {
        mock.onPut('/api/users').reply(200, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise.then((vals) => {
          expect(vals).toEqual(values)
        })
      })
    })

    describe('when it fails', () => {
      const values = { errors: ['foo'] }

      beforeEach(() => {
        mock.onPut('/api/users').reply(400, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise
          .then(() => fail('Request didn\'t fail'))
          .catch((vals) => {
            expect(vals).toEqual(values)
          })
      })
    })
  })

  describe('delete', () => {
    let ret

    const action = () => {
      ret = adapter.del('/users')
    }

    describe('when it resolves', () => {
      const values = { id: 1, name: 'paco' }

      beforeEach(() => {
        mock.onDelete('/api/users').reply(200, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise.then((vals) => {
          expect(vals).toEqual(values)
        })
      })
    })

    describe('when it fails', () => {
      const values = { errors: ['foo'] }

      beforeEach(() => {
        mock.onDelete('/api/users').reply(400, values)
        action()
      })

      it('sends a xhr request with data parameters', () => {
        expect(ret.abort).toBeTruthy()

        return ret.promise
          .then(() => fail('Request didn\'t fail'))
          .catch((vals) => {
            expect(vals).toEqual(values)
          })
      })
    })
  })
})
