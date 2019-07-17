import axios from 'axios';

export class AuthClient {
    constructor (baseURL) {
      this.request = axios.create({
        baseURL,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        },
        crossdomain: true
      })
    }
    login (username, password, config) {
      const params = new URLSearchParams();
      params.append('username', username)
      params.append('password', password)
      params.append('grant_type', config.grantType)
      params.append('scope', 'frontend.read')
      params.append('client_id', config.clientId)
      params.append('client_secret', config.clientSecret)
      const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
      }
      return this.request.post('token', params, headers)
    }
  }
  
  export default AuthClient
  