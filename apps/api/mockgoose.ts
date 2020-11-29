const mongoose = require("mongoose");

function mockOnce(func) {
  // @ts-ignore
  mongoose.Collection.prototype[func] = jest.fn().mockImplementationOnce(
    function(docs, options, callback) {
      callback(null, docs);
    }
  );
}

// @ts-ignore
export { mockOnce }
