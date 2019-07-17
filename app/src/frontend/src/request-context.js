import React from 'react';
import { productAPIConfig, APIConfig } from './config';
import { ProductClient, } from './lib/api/client';

const DEFAULT_HEADERS = {
  'X-user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
}

export const defaultRequestState = {
    isAuth: false,
    token: {},
    status: '',
    requestResults: [],
    headers: DEFAULT_HEADERS, 
}
export const RequestContext = React.createContext(defaultRequestState);


class RequestProvider extends React.Component {
    constructor(props) {
      super(props);
      this.api_client = new ProductClient(productAPIConfig(window))
      this.api_config = APIConfig(window) 
      this.state = {
        status: '',
        requestResults:  [],
        headers: {
          'X-user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
        }
      }
    }
    listProducts() {
      return this.api_client.listProducts(this.state.headers)
    }
    getProduct(id) {
      return this.api_client.getProduct(id, {...this.state.headers, ...{ 'X-product-id': id}})
    }
    getImage(name) {
      return this.api_client.getImage(name, {...this.state.headers, ...{ 'X-image-id': name}})
    }
    render() {
      return (
        <RequestContext.Provider
          value={{ 
            getProduct: (id) => this.getProduct(id),
            listProducts: () => this.listProducts(),
          }}
        >
          {this.props.children}
        </RequestContext.Provider>
      )
    }
  }
  const RequestConsumer = RequestContext.Consumer
  export { RequestProvider, RequestConsumer }
