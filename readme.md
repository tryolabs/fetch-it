# fetch-it
An enhanced HTTP client based on fetch.

Blogpost: [fetch-it an enhanced http client based on fetch] (http://blog.tryolabs.com/2016/03/02/fetch-it-enhanced-http-client-based-on-fetch/)

## Features
You can do all the same thing that you do with fetch, plus:

- Add middleware, to intercept requests and responses
- Create custom config instances

## Installation

using npm:
```
$ npm install --save fetch-it
```

## Examples

GET request
```js
fetchIt.get('http://httpbin.org/get?param1=param1')
  .then((response) => response.json())
  .then((json) => console.log(json))
  .catch((error) => console.error(error));
```

POST request
```js
fetchIt.post('http://httpbin.org/post?param1=param1', {
  param2: 'param2',
  param3: 'param3'
}).then((response) => response.json())
  .then((json) => console.log(json))
  .catch((error) => console.error(error));
```

## API

### Request methods

### `fetchIt.fetch(url[, options])`
### `fetchIt.fetch(request)`
You can perform requests the same way as you do with fetch().

```js
fetchIt.fetch(url, {
  method: 'POST',
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json'
  }
}).then((response) => {
  // handle response
}).catch((error) => {
  // handle error
});
```

And we provide some convenience aliases for the supported methods.

### `fetchIt.get(url[, options])`
### `fetchIt.get(request)`

### `fetchIt.post(url[, data[, options]])`
### `fetchIt.post(request)`

### `fetchIt.put(url[, data[, options]])`
### `fetchIt.put(request)`

### `fetchIt.patch(url[, data[, options]])`
### `fetchIt.patch(request)`

### `fetchIt.delete(url[, options])`
### `fetchIt.delete(request)`

### `fetchIt.head(url[, options])`
### `fetchIt.head(request)`


### Creating custom config instances
You can create a custom config instance of fetchIt

### `fetchIt.create([options])`

```js
let apiFetch = fetchIt.create({
  headers: {
    'Authorization': 'Bearer ' + getAPIToken(),
    'X-My-Custom-Header': 'CustomHeader'
  }
});

apiFetch.get(url).then((response) => {
  // handle response
}).catch((error) => {
  // handle error
});
```

### Middleware
You can add middleware objects to any instance, to intercept requests and responses.

The middleware object must have defined at least one of these methods:
- `request(request)`, to intercept a request,
- `requestError(error)`, to intercept an error from a previous middleware,
- `response(response)`, to intercept a response,
- `responseError(error)`, to intercept an error from a previous middleware.

```js
let jsonMiddleware = {
  response(res) {
    return res.json().catch((e) => {
      return e;
    });
  }
};
```

### `fetchIt.addMiddlewares(ArrayOfMiddlewares)`

```js
fetchIt.addMiddlewares([jsonMiddleware]);
```

### `fetchIt.clearMiddlewares()`

## Roadmap
- Better docs
- Add more middlewares
- Add better tests
- Add travis and coveralls
- Create another project to create something similar to $resource based on fetch-it.

## Credits
`fetchIt` is heavily based on [Axios](https://github.com/mzabriskie/axios), but based on [`fetch()`](http://github.github.io/fetch).


## License
MIT © [Tryolabs](http://github.com/tryolabs)
