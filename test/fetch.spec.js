import FetchIt from '../src/fetch-it.js';
import 'whatwg-fetch';

describe('Default instance fetch() method', () => {
  let url = 'http://example.com/page';

  beforeEach(() => {
    spyOn(window, 'fetch');
  });

  it('should call window.fetch with the same parameters (only url)', (done) => {
    window.fetch(url);
    FetchIt.fetch(url)
      .then(() => {
        let superArgs = window.fetch.calls.argsFor(1);
        let fetchArgs = window.fetch.calls.argsFor(0);

        expect(window.fetch.calls.count()).toBe(2);
        expect(superArgs.length).toBe(1);
        expect(superArgs[0].url).toBe(fetchArgs[0]);
        expect(superArgs[0].method).toBe('GET');
        expect(superArgs[0].headers.getAll().length).toBe(0);

        done();
      });
  });

  it('should add default GET method if not present', (done) => {
    let options = {
      headers: {
        'x-custom-header': 'custom'
      }
    };

    window.fetch(url, options);
    FetchIt.fetch(url, options)
      .then(() => {
        let superArgs = window.fetch.calls.argsFor(1);
        let fetchArgs = window.fetch.calls.argsFor(0);

        expect(window.fetch.calls.count()).toBe(2);
        expect(superArgs.length).toBe(1);
        expect(superArgs[0].url).toBe(fetchArgs[0]);
        expect(superArgs[0].headers.has('x-custom-header')).toBe(true);
        expect(superArgs[0].headers.get('x-custom-header'))
          .toBe(fetchArgs[1].headers['x-custom-header']);
        expect(superArgs[0].method).toBe('GET');

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

    window.fetch(url, options);
    FetchIt.fetch(url, options)
      .then(() => {
        let superArgs = window.fetch.calls.argsFor(1);
        let fetchArgs = window.fetch.calls.argsFor(0);

        expect(window.fetch.calls.count()).toBe(2);
        expect(superArgs.length).toBe(1);
        expect(superArgs[0].url).toBe(fetchArgs[0]);
        expect(superArgs[0].headers.has('x-custom-header')).toBe(true);
        expect(superArgs[0].headers.get('x-custom-header'))
          .toBe(fetchArgs[1].headers['x-custom-header']);
        expect(superArgs[0].method).toBe('PUT');

        done();
      });
  });

  it('should add POST method if no method is specified and there is a body',
      (done) => {
        let options = {
          headers: {
            'x-custom-header': 'custom'
          },
          body: window.JSON.stringify({
            data: 'data'
          })
        };

        window.fetch(url, options);
        FetchIt.fetch(url, options)
          .then(() => {
            let superArgs = window.fetch.calls.argsFor(1);
            let fetchArgs = window.fetch.calls.argsFor(0);

            expect(window.fetch.calls.count()).toBe(2);
            expect(superArgs.length).toBe(1);
            expect(superArgs[0].url).toBe(fetchArgs[0]);
            expect(superArgs[0].headers.has('x-custom-header')).toBe(true);
            expect(superArgs[0].headers.get('x-custom-header'))
              .toBe(fetchArgs[1].headers['x-custom-header']);
            expect(superArgs[0].method).toBe('POST');
            expect(superArgs[0]._bodyText).toBe(fetchArgs[1].body);

            done();
          });
      });
});
