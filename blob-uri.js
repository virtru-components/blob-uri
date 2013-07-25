var Q = require('q');
var Binary = require('binary').Binary;

/**
 * Takes a {Binary} and creates a Blob URL for it.
 *
 * @param binary
 * @returns {String} Blob Object URL
 */
function binaryToBlobUri(binary) {
  var blob = new Blob([binary.asArrayBuffer()]);
  return window.URL.createObjectURL(blob);
}

/**
 * Retrieves the data located at the Blob URL and then
 * revokes it.  So this is effectively a call once
 * function for Blob URLs.
 *
 * @param blobUrl
 * @returns A promise to resolve a {Binary} containing the
 * data
 */
function blobUriToBinary(blobUrl) {

  var deferred = Q.defer();

  var req = new XMLHttpRequest();
  req.open('GET', blobUrl, true);
  req.responseType = 'blob';

  // Handler for successful retrieval of the blob
  req.onload = function(response){
    if (req.status == 404) {
      // This only occurs on Chrome, Firefox just fails
      deferred.reject('Blob does not exist.');
    }

    var blob = new Blob([req.response]);

    var reader = new FileReader();

    // Successful reading of the blob
    reader.onload = function(event) {
      var binary = Binary.fromArrayBuffer(event.target.result);
      revokeUrl(blobUrl);
      deferred.resolve(binary);
    };

    // Failure reading the blob
    reader.onerror = function(error) {
      revokeUrl(blobUrl);
      deferred.reject(error);
    };
    reader.readAsArrayBuffer(blob);
  };

  // Handler for it the request to the browser for the blob fails
  req.onerror = function (err) {
    revokeUrl(blobUrl);
    deferred.reject(err);
  }

  req.send();

  return deferred.promise;
}

function revokeUrl(blobUrl) {
  // Clean up object URL
  window.URL.revokeObjectURL(blobUrl);
}


module.exports = exports;
exports.binaryToBlobUri = binaryToBlobUri;
exports.blobUriToBinary = blobUriToBinary;
