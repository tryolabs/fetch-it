import FetchIt from '../src/fetch-it.js';
import 'whatwg-fetch';

describe('Default instance delete() method', () => {
  let url = 'http://example.com/page';

  beforeEach(() => {
    spyOn(window, 'fetch');
  });

  it('should call window.fetch with the same parameters', (done) => {
    window.fetch(url, { method: 'DELETE' });
    FetchIt.delete(url)
      .then(() => {
        let superArgs = window.fetch.calls.argsFor(1);
        let fetchArgs = window.fetch.calls.argsFor(0);

        expect(window.fetch.calls.count()).toBe(2);
        expect(superArgs.length).toBe(1);
        expect(superArgs[0].url).toBe(fetchArgs[0]);
        expect(superArgs[0].method).toBe(fetchArgs[1].method);
        expect(superArgs[0].method).toBe('DELETE');
        expect(superArgs[0].headers.getAll().length).toBe(0);

        done();
      });
  });

  it('should not change the method if it is specified in options', (done) => {
    let options = {
      method: 'PUT',
    };

    window.fetch(url, { method: 'DELETE' });
    FetchIt.delete(url, options)
      .then(() => {
        let superArgs = window.fetch.calls.argsFor(1);
        let fetchArgs = window.fetch.calls.argsFor(0);

        expect(window.fetch.calls.count()).toBe(2);
        expect(superArgs.length).toBe(1);
        expect(superArgs[0].url).toBe(fetchArgs[0]);
        expect(superArgs[0].method).toBe(fetchArgs[1].method);
        expect(superArgs[0].method).toBe('DELETE');
        expect(superArgs[0].headers.getAll().length).toBe(0);

        done();
      });
  });
});
