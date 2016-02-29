import FetchIt from '../src/fetch-it.js';
import 'whatwg-fetch';

describe('Middleware features', () => {
  let url = 'http://example.com/page';
  let middleware1 = {
    request(req) {
      req.headers.set('x-req-fake1', true);
      return req;
    },

    requestError(error) {
      return window.Promise.reject(error);
    },

    response(res) {
      res.headers.set('x-res-fake1', true);
      return res;
    },

    responseError(error) {
      return window.Promise.reject(error);
    }
  };

  let middleware2 = {
    request(req) {
      req.headers.set('x-req-fake2', true);
      return req;
    },

    requestError(error) {
      return window.Promise.reject(error);
    },

    response(res) {
      res.headers.set('x-res-fake2', true);
      return res;
    },

    responseError(error) {
      return window.Promise.reject(error);
    }
  };

  beforeEach(() => {
    spyOn(window, 'fetch').and.callFake(() => {
      return new window.Response('response');
    });
  });

  afterEach(() => {
    FetchIt.clearMiddlewares();
  });

  it('should call request() before calling window.fetch', (done) => {
    spyOn(middleware1, 'request').and.callThrough();

    FetchIt.addMiddlewares([middleware1]);
    FetchIt.fetch(url)
      .then(() => {
        expect(middleware1.request.calls.count()).toBe(1);
        expect(window.fetch.calls.count()).toBe(1);
        expect(window.fetch.calls.argsFor(0)[0].headers.has('x-req-fake1'))
          .toBe(true);

        done();
      })
      .catch(done.fail);
  });

  it('should call response() after calling window.fetch', (done) => {
    spyOn(middleware1, 'response').and.callThrough();

    FetchIt.addMiddlewares([middleware1]);
    FetchIt.fetch(url)
      .then((res) => {
        expect(middleware1.response.calls.count()).toBe(1);
        expect(window.fetch.calls.count()).toBe(1);
        expect(window.fetch.calls.argsFor(0)[0].headers.has('x-req-fake1'))
          .toBe(true);
        expect(window.fetch.calls.argsFor(0)[0].headers.has('x-res-fake1'))
          .toBe(false);
        expect(res.headers.has('x-res-fake1')).toBe(true);

        done();
      })
      .catch(done.fail);
  });

  it(`should call requestError() after previous middleware request() threw an
      error`, (done) => {
    spyOn(middleware1, 'request').and.throwError();
    spyOn(middleware1, 'requestError');
    spyOn(middleware2, 'request');
    spyOn(middleware2, 'requestError').and.callThrough();

    FetchIt.addMiddlewares([middleware1, middleware2]);
    FetchIt.fetch(url)
      .then(done.fail)
      .catch(() => {
        expect(middleware1.request.calls.count()).toBe(1);
        expect(middleware2.request.calls.count()).toBe(0);
        expect(middleware1.requestError.calls.count()).toBe(0);
        expect(middleware2.requestError.calls.count()).toBe(1);
        expect(window.fetch.calls.count()).toBe(0);

        done();
      });
  });

  it(`should call responseError() after previous middleware response() threw an
      error`, (done) => {
    spyOn(middleware2, 'response').and.throwError();
    spyOn(middleware2, 'responseError');
    spyOn(middleware1, 'response');
    spyOn(middleware1, 'responseError').and.callThrough();

    FetchIt.addMiddlewares([middleware1, middleware2]);
    FetchIt.fetch(url)
      .then(done.fail)
      .catch(() => {
        expect(middleware1.response.calls.count()).toBe(0);
        expect(middleware2.response.calls.count()).toBe(1);
        expect(middleware1.responseError.calls.count()).toBe(1);
        expect(middleware2.responseError.calls.count()).toBe(0);
        expect(window.fetch.calls.count()).toBe(1);

        done();
      });
  });

  it('should calls middlewares in order', (done) => {
    spyOn(middleware1, 'request').and.callThrough();
    spyOn(middleware2, 'request').and.callThrough();
    spyOn(middleware1, 'requestError');
    spyOn(middleware2, 'requestError');
    spyOn(middleware1, 'response').and.callThrough();
    spyOn(middleware2, 'response').and.callThrough();
    spyOn(middleware1, 'responseError');
    spyOn(middleware2, 'responseError');

    FetchIt.addMiddlewares([middleware1, middleware2]);
    FetchIt.fetch(url)
      .then((res) => {
        expect(middleware1.request.calls.count()).toBe(1);
        expect(middleware2.request.calls.count()).toBe(1);
        expect(middleware1.requestError.calls.count()).toBe(0);
        expect(middleware2.requestError.calls.count()).toBe(0);
        expect(window.fetch.calls.count()).toBe(1);
        expect(middleware1.response.calls.count()).toBe(1);
        expect(middleware2.response.calls.count()).toBe(1);
        expect(middleware1.responseError.calls.count()).toBe(0);
        expect(middleware2.responseError.calls.count()).toBe(0);

        expect(
          middleware2.request.calls.argsFor(0)[0].headers.has('x-req-fake1')
        ).toBe(true);
        expect(window.fetch.calls.argsFor(0)[0].headers.has('x-req-fake1'))
          .toBe(true);
        expect(window.fetch.calls.argsFor(0)[0].headers.has('x-req-fake2'))
          .toBe(true);
        expect(
          middleware1.response.calls.argsFor(0)[0].headers.has('x-res-fake2')
        ).toBe(true);
        expect(res.headers.has('x-res-fake1')).toBe(true);

        done();
      })
      .catch(done.fail);
  });
});
