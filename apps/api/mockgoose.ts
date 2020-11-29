const mongoose = require("mongoose");

function mockOnce(func) {
  mongoose.Collection.prototype[func] = jest.fn().mockImplementationOnce(
    function(docs, options, callback) {
      callback(null, docs);
    }
  );
}

export { mockOnce }
