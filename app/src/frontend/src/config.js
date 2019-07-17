import { setConfig } from './lib/utils';
export const productAPIConfig = (window) => ({
    productUri: setConfig(window, "PRODUCT_BASE_URI",'https://api.training.local/api/product'),
    informationUri: setConfig(window,"INFORMATION_BASE_URI",'https://api.training.local/api/information'),
})

export const APIConfig = (window) => ({
    baseURL: setConfig(window, "API_BASE_URI",'https://api.training.local/api'),
    apis: {
        product: {
            api: 'product',
            endpoint: 'product'
        },
        rating: {
            api: 'rating',
            endpoint: 'rating'
        },
        information: {
            api: 'information',
            endpoint: 'information'
        },
        pricing: {
            api: 'pricing',
            endpoint: 'price'
        },
        auth: {
            api: 'auth',
            endpoint: 'auth'
        }
    }
})
export const AuthConfig = (window) => ({
    clientId: setConfig(window, "AUTH_CLIENT_ID",'training-api'),
    clientSecret: setConfig(window, "AUTH_CLIENT_SECRET",'123'),
    grantType: setConfig(window, "AUTH_GRANT_TYPE",'password'),

})