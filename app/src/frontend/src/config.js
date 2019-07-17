import { setConfig } from './lib/utils';
export const productAPIConfig = (window) => ({
    productUri: setConfig(window, "REACT_APP_PRODUCT_BASE_URI",'http://api.demo.local:8080/api/v1/products'),
    imagesUri: setConfig(window,"REACT_APP_IMAGES_BASE_URI",'http://api.demo.local:8080/api/v1/images'),
})

export const APIConfig = (window) => ({
    baseURL: setConfig(window, "REACT_APP_API_BASE_URI",'http://api.training.local:8080/api/v1'),
    apis: {
        product: {
            api: 'product',
            endpoint: 'product'
        },
        rating: {
            api: 'rating',
            endpoint: 'rating'
        },
        images: {
            api: 'information',
            endpoint: 'information'
        },
    }
})