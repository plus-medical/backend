function promise2asyncAwait(value, cb, options = null) {
  return new Promise((resolve, reject) => {
    cb(value, options, (error, result) => {
      console.log('result: ', result);
      if (error) reject(error);
      else resolve(result);
    });
  });
}

module.exports = promise2asyncAwait;
