function promise2asyncAwait(value, cb) {
  return new Promise((resolve, reject) => {
    cb(value, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
}

module.exports = promise2asyncAwait;
