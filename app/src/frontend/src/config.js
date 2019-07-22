import { setConfig } from './lib/utils';
export const productAPIConfig = (window) => {
    return {
    productsBaseURL: setConfig(window, "PRODUCT_BASE_URI",'http://api.demo.local:8080/api/v1/products'),
    imagesBaseURL: setConfig(window,"IMAGES_BASE_URI",'http://api.demo.local:8080/api/v1/images'),
    ratingsBaseURL: setConfig(window,"RATING_BASE_URI",'http://api.demo.local:8080/api/v1/ratings'),
    }
}

export const APIConfig = (window) => ({
    baseURL: setConfig(window, "API_BASE_URI",'http://api.training.local:8080/api/v1'),
    apis: {
        product: {
            api: 'products',
            endpoint: 'products'
        },
        rating: {
            api: 'ratings',
            endpoint: 'ratings'
        },
        images: {
            api: 'images',
            endpoint: 'images'
        },
    }
})