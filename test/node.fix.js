/**
 * node-fetch v1.3.3 does not have implemented Request.text() method.
 * Since the text() method is needed for some text, here is a easy way
 * to fix the problem.
 * This should be removed as soon as node-fetch implement that method.
 * Probably the next version will have it, since the method is implemented
 * in the master branch of the githb repository.
 */

if (typeof global.Request.prototype.text !== 'function') {
  global.Request.prototype.text = function () {
    return global.Promise.resolve(this.body);
  };
}
