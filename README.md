blob-uri
========

This library is a very simple utility that converts a [Binary](https://github.com/virtru/binary.js) to a blob URL and 
from a blob URL back to a [Binary](https://github.com/virtru/binary.js).  This is useful for extensions that need to
transfer binary data between content and background scripts.

Usage
=====

To include in your component add this to your `component.json` file:

    "dependencies": [
      "virtru-components/blob-uri": "*"
    ]

This function can be used as follows:

    var BlobUriUtil = require('blob-uri')

    var message = 'asdf';
    var binary = Binary.fromString(message);
    blobUri = BlobUriUtil.binaryToBlobUri(binary);

    // And to get it back...
    BlobUriUtil.blobUriToBinary(blobUri)
    .then(function(result) {
      assert.equal(message, result.asString());
    });
    
The `blobUriToBinary` function returns a Q promise.


Building
========

To build you'll need [component](https://github.com/component/component) installed and should run:

`$ component install --dev`

Then run:

`$ component build`

To test run:

```
$ component test-build
$ component karma-run
```

To run this final command you should install the virtru/component-karma-run component found here: https://github.com/virtru/component-karma-run

`$ npm install component-karma-run`
