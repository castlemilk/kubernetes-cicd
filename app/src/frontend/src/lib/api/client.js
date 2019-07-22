import axios from 'axios'
import uuid from "uuid";
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
      baseURL: this.config.productsBaseURL,
      headers: HEADERS_JSON_BASE,
      crossdomain: true
    })
    this.ratingRequest = axios.create({
      baseURL: this.config.ratingsBaseURL,
      headers: HEADERS_JSON_BASE,
      crossdomain: true
    })
    this.imageRequest = axios.create({
      baseURL: this.config.imagesBaseURL,
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
      headers: { ...HEADERS_JSON_BASE, ...headers, 'Cache-Control': 'no-cache'},
      crossdomain: true
    })
  }
  updateRating(id, rating, headers ={}) {
    const payload = {
      "product_id": id,
      "value": rating
    }
    return this.ratingRequest.post(`/${id}`, payload, {
      headers: { ...HEADERS_JSON_BASE, ...headers},
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