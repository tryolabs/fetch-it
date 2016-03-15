import FetchIt from '../src/fetch-it.js';
import 'isomorphic-fetch';


describe('Middleware features', () => {
  let url = 'http://example.com/page';
  let fetchStub;

  let middleware1 = {
    request(req) {
      req.headers.set('x-req-fake1', true);
      return req;
    },

    requestError(error) {
      return global.Promise.reject(error);
    },

    response(res) {
      res.headers.set('x-res-fake1', true);
      return res;
    },

    responseError(error) {
      return global.Promise.reject(error);
    }
  };

  let middleware2 = {
    request(req) {
      req.headers.set('x-req-fake2', true);
      return req;
    },

    requestError(error) {
      return global.Promise.reject(error);
    },

    response(res) {
      res.headers.set('x-res-fake2', true);
      return res;
    },

    responseError(error) {
      return global.Promise.reject(error);
    }
  };

  before(() => fetchStub = sinon.stub(global, 'fetch', () => {
    return new global.Response('response');
  }));

  after(() => global.fetch.restore());

  beforeEach(() => fetchStub.reset());

  afterEach(() => FetchIt.clearMiddlewares());

  it('should call request() before calling global.fetch', (done) => {
    let middleware1RequestStub = sinon.spy(middleware1, 'request');

    FetchIt.addMiddlewares([middleware1]);
    FetchIt.fetch(url)
      .then(() => {
        expect(middleware1RequestStub.callCount).to.be.equal(1);
        expect(fetchStub.callCount).to.be.equal(1);
        expect(fetchStub.getCall(0).args[0].headers.has('x-req-fake1'))
          .to.be.equal(true);

        middleware1RequestStub.restore();

        done();
      })
      .catch(done.fail);
  });

  it('should call response() after calling global.fetch', (done) => {
    let middleware1ResponseStub = sinon.spy(middleware1, 'response');

    FetchIt.addMiddlewares([middleware1]);
    FetchIt.fetch(url)
      .then((res) => {
        expect(middleware1ResponseStub.callCount).to.be.equal(1);
        expect(fetchStub.callCount).to.be.equal(1);
        expect(fetchStub.getCall(0).args[0].headers.has('x-req-fake1'))
          .to.be.equal(true);
        expect(fetchStub.getCall(0).args[0].headers.has('x-res-fake1'))
          .to.be.equal(false);
        expect(res.headers.has('x-res-fake1')).to.be.equal(true);

        middleware1ResponseStub.restore();

        done();
      })
      .catch(done.fail);
  });

  it(`should call requestError() after previous middleware request() threw an
      error`, (done) => {
    let middleware1RequestStub = sinon.stub(middleware1, 'request').throws();
    let middleware1RequestErrorStub = sinon.stub(middleware1, 'requestError');
    let middleware2RequestStub = sinon.stub(middleware2, 'request');
    let middleware2RequestErrorStub = sinon.spy(middleware2, 'requestError');

    FetchIt.addMiddlewares([middleware1, middleware2]);
    FetchIt.fetch(url)
      .then(done.fail)
      .catch(() => {
        expect(middleware1RequestStub.callCount).to.be.equal(1);
        expect(middleware2RequestStub.callCount).to.be.equal(0);
        expect(middleware1RequestErrorStub.callCount).to.be.equal(0);
        expect(middleware2RequestErrorStub.callCount).to.be.equal(1);
        expect(fetchStub.callCount).to.be.equal(0);

        middleware1RequestStub.restore();
        middleware1RequestErrorStub.restore();
        middleware2RequestStub.restore();
        middleware2RequestErrorStub.restore();

        done();
      });
  });

  it(`should call responseError() after previous middleware response() threw an
      error`, (done) => {
    let middleware1ResponseStub = sinon.stub(middleware1, 'response');
    let middleware1ResponseErrorStub = sinon.spy(middleware1, 'responseError');
    let middleware2ResponseStub = sinon.stub(middleware2, 'response').throws();
    let middleware2ResponseErrorStub = sinon.stub(middleware2, 'responseError');

    FetchIt.addMiddlewares([middleware1, middleware2]);
    FetchIt.fetch(url)
      .then(done.fail)
      .catch(() => {
        expect(middleware1ResponseStub.callCount).to.be.equal(0);
        expect(middleware2ResponseStub.callCount).to.be.equal(1);
        expect(middleware1ResponseErrorStub.callCount).to.be.equal(1);
        expect(middleware2ResponseErrorStub.callCount).to.be.equal(0);
        expect(fetchStub.callCount).to.be.equal(1);

        middleware1ResponseStub.restore();
        middleware1ResponseErrorStub.restore();
        middleware2ResponseStub.restore();
        middleware2ResponseErrorStub.restore();

        done();
      });
  });

  it('should calls middlewares in order', (done) => {
    let middleware1RequestStub = sinon.spy(middleware1, 'request');
    let middleware2RequestStub = sinon.spy(middleware2, 'request');
    let middleware1RequestErrorStub = sinon.stub(middleware1, 'requestError');
    let middleware2RequestErrorStub = sinon.stub(middleware2, 'requestError');
    let middleware1ResponseStub = sinon.spy(middleware1, 'response');
    let middleware2ResponseStub = sinon.spy(middleware2, 'response');
    let middleware1ResponseErrorStub = sinon.stub(middleware1, 'responseError');
    let middleware2ResponseErrorStub = sinon.stub(middleware2, 'responseError');

    FetchIt.addMiddlewares([middleware1, middleware2]);
    FetchIt.fetch(url)
      .then((res) => {
        expect(middleware1RequestStub.callCount).to.be.equal(1);
        expect(middleware2RequestStub.callCount).to.be.equal(1);
        expect(middleware1RequestErrorStub.callCount).to.be.equal(0);
        expect(middleware2RequestErrorStub.callCount).to.be.equal(0);
        expect(fetchStub.callCount).to.be.equal(1);
        expect(middleware1ResponseStub.callCount).to.be.equal(1);
        expect(middleware2ResponseStub.callCount).to.be.equal(1);
        expect(middleware1ResponseErrorStub.callCount).to.be.equal(0);
        expect(middleware2ResponseErrorStub.callCount).to.be.equal(0);

        expect(
          middleware2RequestStub.getCall(0).args[0].headers.has('x-req-fake1')
        ).to.be.equal(true);
        expect(fetchStub.getCall(0).args[0].headers.has('x-req-fake1'))
          .to.be.equal(true);
        expect(fetchStub.getCall(0).args[0].headers.has('x-req-fake2'))
          .to.be.equal(true);
        expect(
          middleware1ResponseStub.getCall(0).args[0].headers.has('x-res-fake2')
        ).to.be.equal(true);
        expect(res.headers.has('x-res-fake1')).to.be.equal(true);

        middleware1RequestStub.restore();
        middleware2RequestStub.restore();
        middleware1RequestErrorStub.restore();
        middleware2RequestErrorStub.restore();
        middleware1ResponseStub.restore();
        middleware2ResponseStub.restore();
        middleware1ResponseErrorStub.restore();
        middleware2ResponseErrorStub.restore();

        done();
      })
      .catch(done.fail);
  });
});
