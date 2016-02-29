import FetchIt from '../src/fetch-it.js';
import 'whatwg-fetch';

describe('Default instance patch() method', () => {
  let url = 'http://example.com/page';

  beforeEach(() => {
    spyOn(window, 'fetch');
  });

  it('should call window.fetch with the same parameters', (done) => {
    let data = {
      data: 'data'
    };

    window.fetch(url, { body: window.JSON.stringify(data), method: 'PATCH' });
    FetchIt.patch(url, data)
      .then(() => {
        let superArgs = window.fetch.calls.argsFor(1);
        let fetchArgs = window.fetch.calls.argsFor(0);

        expect(window.fetch.calls.count()).toBe(2);
        expect(superArgs.length).toBe(1);
        expect(superArgs[0].url).toBe(fetchArgs[0]);
        expect(superArgs[0].method).toBe(fetchArgs[1].method);
        expect(superArgs[0].method).toBe('PATCH');
        expect(superArgs[0]._bodyText).toBe(fetchArgs[1].body);
        expect(superArgs[0]._bodyText).toBe(window.JSON.stringify(data));
        expect(superArgs[0].headers.getAll().length).toBe(0);

        done();
      });
  });

  it('should not change the method if it is specified in options', (done) => {
    let options = {
      method: 'POST',
    };

    let data = {
      data: 'data'
    };

    window.fetch(url, { body: window.JSON.stringify(data), method: 'PATCH' });
    FetchIt.patch(url, data, options)
      .then(() => {
        let superArgs = window.fetch.calls.argsFor(1);
        let fetchArgs = window.fetch.calls.argsFor(0);

        expect(window.fetch.calls.count()).toBe(2);
        expect(superArgs.length).toBe(1);
        expect(superArgs[0].url).toBe(fetchArgs[0]);
        expect(superArgs[0].method).toBe(fetchArgs[1].method);
        expect(superArgs[0].method).toBe('PATCH');
        expect(superArgs[0]._bodyText).toBe(fetchArgs[1].body);
        expect(superArgs[0]._bodyText).toBe(window.JSON.stringify(data));
        expect(superArgs[0].headers.getAll().length).toBe(0);

        done();
      });
  });
});
