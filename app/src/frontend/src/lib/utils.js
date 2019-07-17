const _makeCancelable = (promise) => {
    let hasCanceled_ = false;
  
    const wrappedPromise = new Promise((resolve, reject) => {
      promise.then((val) =>
        hasCanceled_ ? resolve({isCanceled: true}) : resolve(val)
      );
      promise.catch((error) =>
        hasCanceled_ ? resolve({isCanceled: true}) : reject(error)
      );
    });
  
    return {
      promise: wrappedPromise,
      cancel() {
        hasCanceled_ = true;
      },
    };
  };
export const sleep = (time) => {
    return _makeCancelable(new Promise((resolve) => setTimeout(resolve, time)));
}

export const genUri = (api, version, endpoint) =>{
  return `${api}/${version}/${endpoint}/1`
}
export function findMinMax(arr) {
  let min = arr[0][0], max = arr[0][0]

  for (let i = 1, len=arr.length; i < len; i++) {
    let v = arr[i][0];
    min = (v < min) ? v : min;
    max = (v > max) ? v : max;
  }

  return [min, max];
}
// export const generateStats = (results) => {
//   const minMax = findMinMax(results)
//   return {
//       average: results.reduce(function(a, b) { return a + b; }) / results.length,
//       min: minMax[0],
//       max: minMax[1],
//       timestamp: Date.now()
//   }
// }
export const _isError = (code) => {
    if ((code >= 400 && code <= 600) || code === 0) {
      return true
    } else {
      return false
    }
}
export const calcErrors = (results) => {
  return results.length > 0
    ? Math.floor((results.filter(function (x) { return _isError(x[1]) }).length) * 100) / 100 : 
    0
}

export const calcAverage = (results) => {
  return results.length > 0
    ? Math.ceil((results.reduce(function (a, b) { return a + b[0]},results[0][0]) / results.length))
    : 0
}

export const setConfig = (window, windowValue, defaultValue) => {
  if (window["_env_"]) {
    if (window["_env_"][windowValue]) {
      return window["_env_"][windowValue]
    } else {
      return defaultValue
    }
  }
  return defaultValue
}