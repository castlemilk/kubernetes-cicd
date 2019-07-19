import React from 'react';
import { productAPIConfig, APIConfig } from './config';
import { ProductClient, } from './lib/api/client';

export const defaultRequestState = {
    isAuth: false,
    token: {},
    status: '',
    requestResults: [],
}
export const RequestContext = React.createContext(defaultRequestState);


class RequestProvider extends React.Component {
    constructor(props) {
      super(props);
      console.log(window["__ENV__"])
      this.api_client = new ProductClient(productAPIConfig(window))
      this.api_config = APIConfig(window) 
      this.state = {
        status: '',
        requestResults:  [],
    }
    }
    listProducts() {
      return this.api_client.listProducts()
    }
    getProduct(id) {
      return this.api_client.getProduct(id)
    }
    getImage(name) {
      return this.api_client.getImage(name)
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
