import FetchIt from '../src/fetch-it.js';
import 'isomorphic-fetch';
import FormData from 'form-data';

import './node.fix.js';


describe('Default instance post() method', () => {
  let url = 'http://example.com/page';
  let fetchStub;

  before(() => fetchStub = sinon.stub(global, 'fetch'));

  after(() => fetchStub.restore());

  beforeEach(() => fetchStub.reset());

  it('should call global.fetch with the same parameters', (done) => {
    let data = {
      data: 'data'
    };

    global.fetch(url, { body: global.JSON.stringify(data), method: 'POST' });
    FetchIt.post(url, data)
      .then(() => {
        let fetchItArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(fetchItArgs.length).to.be.equal(1);
        expect(fetchItArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(fetchItArgs[0].method).to.be.equal(fetchArgs[1].method);
        expect(fetchItArgs[0].method).to.be.equal('POST');
        return global.Promise.all([fetchItArgs[0].text(), fetchArgs[1].body]);
      })
      .then(([fetchItBody, fetchBody]) => {
        expect(fetchItBody).to.be.equal(fetchBody);

        done();
      })
      .catch(done.fail);
  });

  it('should not change the method if it is specified in options', (done) => {
    let options = {
      method: 'PUT',
    };

    let data = {
      data: 'data'
    };

    global.fetch(url, { body: global.JSON.stringify(data), method: 'POST' });
    FetchIt.post(url, data, options)
      .then(() => {
        let fetchItArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(fetchItArgs.length).to.be.equal(1);
        expect(fetchItArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(fetchItArgs[0].method).to.be.equal(fetchArgs[1].method);
        expect(fetchItArgs[0].method).to.be.equal('POST');
        return global.Promise.all([fetchItArgs[0].text(), fetchArgs[1].body]);
      })
      .then(([fetchItBody, fetchBody]) => {
        expect(fetchItBody).to.be.equal(fetchBody);

        done();
      })
      .catch(done.fail);
  });

  it('should work send a FormData object', (done) => {
    let data = new FormData();
    data.append('field1', 'field1value');

    global.fetch(url, { body: data, method: 'POST' });
    FetchIt.post(url, data)
      .then(() => {
        let fetchItArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(fetchItArgs.length).to.be.equal(1);
        expect(fetchItArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(fetchItArgs[0].method).to.be.equal(fetchArgs[1].method);
        expect(fetchItArgs[0].method).to.be.equal('POST');
        expect(fetchItArgs[0].formData).to.throw(Error);

        done();
      })
      .catch(done.fail);
  });

  it('should work send a Blob object', (done) => {
    if (!('Blob' in global)) {
      done();
      return;
    }

    let data = new global.Blob(['hola'], { type: 'text/plain' });

    global.fetch(url, { body: data, method: 'POST' });
    FetchIt.post(url, data)
      .then(() => {
        let fetchItArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(fetchItArgs.length).to.be.equal(1);
        expect(fetchItArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(fetchItArgs[0].method).to.be.equal(fetchArgs[1].method);
        expect(fetchItArgs[0].method).to.be.equal('POST');
        return global.Promise.all([
          fetchItArgs[0].text(),
          new global.Request(url, { body: data, method: 'POST' }).text()
        ]);
      })
      .then(([fetchItBlob, fetchBlob]) => {
        expect(fetchItBlob).to.be.equal(fetchBlob);

        done();
      })
      .catch(done.fail);
  });

  it('should work send a URLSearchParams object', (done) => {
    if (!('URLSearchParams' in global)) {
      done();
      return;
    }

    let data = new global.URLSearchParams();
    data.append('field1', 'field1value');

    global.fetch(url, { body: data, method: 'POST' });
    FetchIt.post(url, data)
      .then(() => {
        let fetchItArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(fetchItArgs.length).to.be.equal(1);
        expect(fetchItArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(fetchItArgs[0].method).to.be.equal(fetchArgs[1].method);
        expect(fetchItArgs[0].method).to.be.equal('POST');
        return global.Promise.all([
          fetchItArgs[0].text(),
          new global.Request(url, { body: data, method: 'POST' }).text()
        ]);
      })
      .then(([fetchItURLSearchParams, fetchURLSearchParams]) => {
        expect(fetchItURLSearchParams).to.be.equal(fetchURLSearchParams);

        done();
      })
      .catch(done.fail);
  });
});
