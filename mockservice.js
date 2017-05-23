/**
 * mockService
 */
function mockRequest(endpoint, timeout) { 
  return new Promise((resolve, reject) => {
    setTimeout(()=>{
      let data = Math.random()*1000;
      resolve(data);
    }, timeout);
  });
}

function mock(opts) {
  const promise = mockRequest(opts, opts.delay);
  // return promise
  return promise;
};

function mockall(opts) {
  let promises = [];
  let urls = opts.urls;
  let params = opts.params;

  urls.forEach(url => {
    promises.push(mockRequest({ url, params }));
  });

  return Promise.all(promises);
}

exports = module.exports = { mock, mockall };