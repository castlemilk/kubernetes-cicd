import styled from 'styled-components';

export const ProductCardWrapper = styled.div`
    
`;
export const ProductCardStockWrapper = styled.div`
`;
export const ProductImageWrapper = styled.img`
    height: 120px;
    margin-bottom: 10px;
    grid-area: image;
`

export const ProductLoadingWrapper = styled.div`
    height: 254px;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .image-placeholder {
        height: 120px;
        width: 120px;
        background: #E9E9E9;
        margin-top: 20px;
        animation-duration: 1.25s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeHolderShimmer;
        animation-timing-function: linear;
        background: #F6F6F6;
        background: linear-gradient(to right, #F6F6F6 8%, #F0F0F0 18%, #F6F6F6 33%);
        background-size: 800px 104px;
        height: 96px;
        position: relative;
    }
    .product-title {
        width: 100px;
        height: 30px;
        margin-top: 20px;
        margin-bottom: 20px;
        background: #E9E9E9;
        animation-duration: 1.25s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeHolderShimmer;
        animation-timing-function: linear;
        background: #F6F6F6;
        background: linear-gradient(to right, #F6F6F6 8%, #F0F0F0 18%, #F6F6F6 33%);
        background-size: 800px 104px;
        position: relative;


    }
    .product-description {
        width: 140px;
        height: 50px;
        background: #E9E9E9;
        animation-duration: 1.25s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: placeHolderShimmer;
        animation-timing-function: linear;
        background: #F6F6F6;
        background: linear-gradient(to right, #F6F6F6 8%, #F0F0F0 18%, #F6F6F6 33%);
        background-size: 800px 104px;
        position: relative;

    }
    // Animation
    @keyframes placeHolderShimmer{
        0%{
            background-position: -120px 0
        }
        100%{
            background-position: 120px 0
        }
    }
`;

export const ProductHeader = styled.div`
    display: grid;
    grid-template-areas:
        'price image';
`;
export const ProductPriceWrapper = styled.div`
    grid-area: price;
    background: #66d36a;
    color: white;
    height: 30px;
    width: 70px;
    position: absolute;
    border-radius: 30px;
    justify-content: center;
    text-align: center;
    display: flex;
    vertical-align: middle;
    align-items: center;
    font-family: Avenir Next, sans-serif;
    font-size: 25px;
    font-weight: bold;
`;

export const ProductRatingWrapper = styled.div`
display: flex;
height: 34px;
flex-direction: row;
justify-content: center;
align-items: center;
margin-top: 10px;
`;
export const ProductRatingCount = styled.div`
    height: 100%;
    margin-left: 10px;
    margin-top: 4px;
    align-content: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    font-weight: bold;
    font-family: Avenir Next, sans-serif;
    font-size: 18px;

`;
export const ProductStockCardWrapper = styled.div`
    display: grid;
    height: 250px;
    grid-template-areas:
        'card-title'
        'stock-header'
        'stock-value'
        'time-header'
        'time-value';
    justify-content: center;
    align-items: center;
    text-align: center;
`;
export const ProductStockHeader = styled.div`
    grid-area: card-title;
    font-weight: bold;
    font-family: Avenir Next, sans-serif;
    font-size: 18px;

`;
export const ProductStockTitle = styled.div`
    grid-area: stock-header;
    font-family: Avenir Next, sans-serif;
    font-size: 25px;
    font-weight: bold;
`;
export const ProductStockValue = styled.div`
    grid-area: stock-value;
    font-family: Avenir Next, sans-serif;
    font-size: 22px;
`;
export const ProductStockRestockTitle = styled.div`
    grid-area: time-header;
    font-family: Avenir Next, sans-serif;
    font-size: 25px;
    font-weight: bold;
`;
export const ProductStockRestockValue = styled.div`
    grid-area: time-value;
    font-family: Avenir Next, sans-serif;
    font-size: 22px;
`;