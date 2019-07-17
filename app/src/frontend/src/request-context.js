import React from 'react';
import uuidv4 from 'uuid'
import { productAPIConfig, APIConfig, AuthConfig } from './config';
import { ProductClient, APIClient } from './lib/api/client';
import AuthClient from './lib/api/auth';

const DEFAULT_HEADERS = {
  'X-user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
}
const JWT_HEADER = 'X-jwt-assertion'

export const defaultRequestState = {
    isAuth: false,
    token: {},
    status: '',
    productVersion: 'v1',
    requestResults: [],
    headers: DEFAULT_HEADERS, 
}
export const LINE_BUFFER_LENGTH = 2000;
export const RequestContext = React.createContext(defaultRequestState);


class RequestProvider extends React.Component {
    constructor(props) {
      super(props);
      this.api_client = new ProductClient(productAPIConfig(window))
      this.api_config = APIConfig(window) 
      this.stream_client = new APIClient(this.api_config.baseURL)
      this.auth_client = new AuthClient(
        `${this.api_config.baseURL}/${this.api_config.apis['auth'].api}/v1/${this.api_config.apis['auth'].endpoint}/`
      )
      this.state = {
        isAuth: false,
        token: {},
        status: '',
        productVersion: 'v1',
        requestResults:  [],
        headers: {
          'X-user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
        }
      }
      this.auth_client = new AuthClient(
      `${this.api_config.baseURL}/${this.api_config.apis['auth'].api}/v1/${this.api_config.apis['auth'].endpoint}/`
      )
    }
    getLogin(username, password) {
      this.auth_client.login(username, password, AuthConfig(window))
        .then(response => this.handleSuccess(response))
        .catch( err => this.handleError());
    };
    listProducts() {
      return this.api_client.listProducts(this.state.headers, this.state.productVersion)
    }
    getProduct(id) {
      return this.api_client.getProduct(id, {...this.state.headers, ...{ 'X-product-id': id}}, this.state.productVersion)
    }
    getImage(name) {
      return this.api_client.getImage(name, {...this.state.headers, ...{ 'X-image-id': name}})
    }
    updateRequestResults(result) {
      var newLines = this.state.requestResults;
      if (newLines.length === LINE_BUFFER_LENGTH) {
        newLines = []
      }
      if (newLines.length < LINE_BUFFER_LENGTH) {
        newLines.push(result)
        this.setState({ requestResults: newLines})
      } else {
        newLines.shift()
        newLines.push(result)
        this.setState({ requestResults: newLines})
      }
    }
    getStream(path) {
      return this.stream_client
        .get(`${path}/?${uuidv4()}-${Math.random()}`, this.state.headers)
        .then( result => {
          this.parseStreamResult(result)
          return result
        })
    }
    cancelStream() {
      return this.stream_client.cancelRequest()
    }
    handleError() {
      setTimeout(() => this.setState({isAuth: false, status: 'ERROR'}), 700)
    }
    handleSuccess(response) {
      setTimeout(() => this.setState({
        status: 'SUCCESS',
        token: {
          access: response.data.access_token,
          refresh: response.data.refresh_token,
          expires_in: response.data.expires_in,
          type: response.data.token_type
        }
      }), 700)
      setTimeout(() => this.setState({ isAuth: true}), 1300)
      const jwt_header = {}
      jwt_header[JWT_HEADER] = `${response.data.access_token}`
      this.setState({headers: { ...this.state.headers, ...jwt_header }})
    }
    login(username, password) {
      this.setState({ status: 'LOADING' }, this.getLogin(username, password))

    }
    setProductHeaders(headers) {
      this.setState({ headers: {...this.state.headers, ...headers} });

    }
    setProductVersion(version) {
      this.setState({ productVersion: version})
    }
    logout() {
      var newHeaders = delete this.state.headers[JWT_HEADER]
      this.setState({ isAuth: false, status: '', token: {}, headers: newHeaders})
    }
    render() {
      return (
        <RequestContext.Provider
          value={{ 
            isAuth: this.state.isAuth,
            login: (username, password) => this.login(username, password),
            logout: () => this.logout(),
            status: this.state.status,
            token: this.state.token,
            getProduct: (id) => this.getProduct(id),
            listProducts: () => this.listProducts(),
            setProductVersion: (version) => this.setProductVersion(version),
            setProductHeaders: (headers) => this.setProductHeaders(headers),
            streamHeaders: this.state.headers,
            streamClient: this.stream_client,
            updateRequestResults: (result) => this.updateRequestResults(result),
            requestResults: this.state.requestResults,
          }}
        >
          {this.props.children}
        </RequestContext.Provider>
      )
    }
  }
  const RequestConsumer = RequestContext.Consumer
  export { RequestProvider, RequestConsumer }
