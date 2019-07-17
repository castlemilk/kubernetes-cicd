import axios from 'axios'
const HEADERS_JSON_BASE = {
  'Content-Type': 'application/json',
  'Accept': 'application/json' 
}
const HEADERS_IMG_BASE = {
    'Content-Type': 'image/png',
    'Accept': 'image/png'
}
const CancelToken = axios.CancelToken;
let cancel;
export class ProductClient {
  constructor (config) {
    this.config = config
    this.productRequest = axios.create({
      baseURL: this.config.productUri,
      headers: HEADERS_JSON_BASE,
      crossdomain: true
    })
    this.imageRequest = axios.create({
      baseURL: this.config.imagesUri,
      headers: HEADERS_IMG_BASE,
      crossdomain: true
    })
  }
  listProducts (headers = {}) {
    return this.productRequest.get(`/`, {
      headers: { ...HEADERS_JSON_BASE, ...headers},
      crossdomain: true
    });
  }
  getProduct (id, headers = {}) {
    return this.productRequest.get(`/${id}`, {
      headers: { ...HEADERS_JSON_BASE, ...headers, ...{ 'X-product-id': id}},
      crossdomain: true
    })
  }
  getImage (name, headers = {}) {
    return this.imageRequest.get(`/${name}`, {
      headers: { ...HEADERS_JSON_BASE, ...headers},
      crossdomain: true
    })
  }
}

export class APIClient {
  constructor (baseURL, headers = {}) {
    this.request = axios.create({
      baseURL,
      headers: { ...HEADERS_JSON_BASE, ...headers},
      crossdomain: true
    })
  }
  get (path, headers = {}) {
    return this.request.get(path, {
      headers: { ...HEADERS_JSON_BASE, ...headers },
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      })
    })
  }
  cancelRequest() {
    cancel()
  }
}

export default ProductClient