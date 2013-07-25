var _ = require('underscore');
var assert = require('chai').assert;
var itAsync = require('mocha-promises-kit').itAsync;
var Q = require('q');
var Binary = require('binary').Binary;
var BlobUriUtil = require('../blob-uri');


describe('Blob Uris', function() {

  var blobUri = null;

  beforeEach(function() {
    blobUri = null;
  });

  afterEach(function() {
    window.URL.revokeObjectURL(blobUri);
  });

  it ('Creates an object Uri', function() {
    var binary = Binary.fromString("asdf");
    blobUri = BlobUriUtil.binaryToBlobUri(binary);
    assert.ok(blobUri);
  });

  itAsync('Reads out a blob binary', function() {
    var message = 'asdf';
    var binary = Binary.fromString(message);
    blobUri = BlobUriUtil.binaryToBlobUri(binary);

    var deferred = Q.defer();

    var q = BlobUriUtil.blobUriToBinary(blobUri);
    q.then(function(result) {
      assert.equal(message, result.asString());
      deferred.resolve();
    })
    .fail(function(error){
      deferred.reject(error);
    });

    return deferred.promise;
  });

  itAsync('Fails to read a blob binary', function() {
    var message = 'asdf';
    var binary = Binary.fromString(message);
    blobUri = BlobUriUtil.binaryToBlobUri(binary);

    var deferred = Q.defer();

    try {
      var q = BlobUriUtil.blobUriToBinary(blobUri + 'FAIL');
      q.then(function() {
        deferred.reject();
      })
      .fail(function(error){
        console.log(['error', error]);
        deferred.resolve(error);
      });
    } catch (error) {
      // This is expected in FireFox, it fails completely
      // whereas Chrome returns a 404

      // Clean up object URL
      console.log(['Cleaning up object URL : ', blobUri]);
      window.URL.revokeObjectURL(blobUri);
      deferred.resolve(error);
    }

    return deferred.promise;
  });

});