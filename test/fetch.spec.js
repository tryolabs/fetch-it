import FetchIt from '../src/fetch-it.js';
import 'isomorphic-fetch';

describe('Default instance fetch() method', () => {
  let url = 'http://example.com/page';
  let fetchStub;

  before(() => fetchStub = sinon.stub(global, 'fetch'));

  after(() => fetchStub.restore());

  beforeEach(() => fetchStub.reset());

  it('should call global.fetch with the same parameters (only url)', (done) => {
    global.fetch(url);
    FetchIt.fetch(url)
      .then(() => {
        let fetchItArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(fetchItArgs.length).to.be.equal(1);
        expect(fetchItArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(fetchItArgs[0].method).to.be.equal('GET');
        expect(fetchItArgs[0].headers.getAll().length).to.be.equal(0);

        done();
      });
  });

  it('should add default GET method if not present', (done) => {
    let options = {
      headers: {
        'x-custom-header': 'custom'
      }
    };

    global.fetch(url, options);
    FetchIt.fetch(url, options)
      .then(() => {
        let fetchItArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(fetchItArgs.length).to.be.equal(1);
        expect(fetchItArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(fetchItArgs[0].headers.has('x-custom-header')).to.be.equal(true);
        expect(fetchItArgs[0].headers.get('x-custom-header'))
          .to.be.equal(fetchArgs[1].headers['x-custom-header']);
        expect(fetchItArgs[0].method).to.be.equal('GET');

        done();
      });
  });

  it('should not change the method if specified', (done) => {
    let options = {
      headers: {
        'x-custom-header': 'custom'
      },
      method: 'PUT',
    };

    global.fetch(url, options);
    FetchIt.fetch(url, options)
      .then(() => {
        let superArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(superArgs.length).to.be.equal(1);
        expect(superArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(superArgs[0].headers.has('x-custom-header')).to.be.equal(true);
        expect(superArgs[0].headers.get('x-custom-header'))
          .to.be.equal(fetchArgs[1].headers['x-custom-header']);
        expect(superArgs[0].method).to.be.equal('PUT');

        done();
      });
  });

  it('should add POST method if no method is specified and there is a body',
      (done) => {
        let options = {
          headers: {
            'x-custom-header': 'custom'
          },
          body: global.JSON.stringify({
            data: 'data'
          })
        };

        global.fetch(url, options);
        FetchIt.fetch(url, options)
          .then(() => {
            let superArgs = fetchStub.getCall(1).args;
            let fetchArgs = fetchStub.getCall(0).args;

            expect(fetchStub.callCount).to.be.equal(2);
            expect(superArgs.length).to.be.equal(1);
            expect(superArgs[0].url).to.be.equal(fetchArgs[0]);
            expect(superArgs[0].headers.has('x-custom-header')).to.be.equal(true);
            expect(superArgs[0].headers.get('x-custom-header'))
              .to.be.equal(fetchArgs[1].headers['x-custom-header']);
            expect(superArgs[0].method).to.be.equal('POST');
            expect(superArgs[0]._bodyText).to.be.equal(fetchArgs[1].body);

            done();
          });
      });
});
