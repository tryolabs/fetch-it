import FetchIt from '../src/fetch-it.js';
import 'isomorphic-fetch';


describe('Default instance head() method', () => {
  let url = 'http://example.com/page';
  let fetchStub;

  before(() => fetchStub = sinon.stub(global, 'fetch'));

  after(() => fetchStub.restore());

  beforeEach(() => fetchStub.reset());

  it('should call global.fetch with the same parameters', (done) => {
    global.fetch(url, { method: 'HEAD' });
    FetchIt.head(url)
      .then(() => {
        let superArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(superArgs.length).to.be.equal(1);
        expect(superArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(superArgs[0].method).to.be.equal(fetchArgs[1].method);
        expect(superArgs[0].method).to.be.equal('HEAD');

        done();
      })
      .catch(done.fail);
  });

  it('should not change the method if it is specified in options', (done) => {
    let options = {
      method: 'PUT',
    };

    global.fetch(url, { method: 'HEAD' });
    FetchIt.head(url, options)
      .then(() => {
        let superArgs = fetchStub.getCall(1).args;
        let fetchArgs = fetchStub.getCall(0).args;

        expect(fetchStub.callCount).to.be.equal(2);
        expect(superArgs.length).to.be.equal(1);
        expect(superArgs[0].url).to.be.equal(fetchArgs[0]);
        expect(superArgs[0].method).to.be.equal(fetchArgs[1].method);
        expect(superArgs[0].method).to.be.equal('HEAD');

        done();
      })
      .catch(done.fail);
  });
});
