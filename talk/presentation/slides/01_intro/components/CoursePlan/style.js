import styled from 'styled-components'
const DAY_ONE_BOTTOM = 5
const DAY_ONE_BOTTOM_SELECTED = 6
const CARD_SIZE = 100;
export const Wrapper = styled.div`
    display: grid;
    height: 400px;
    margin-top: 100px;
    grid-template-columns: 1fr;
    grid-template-rows: 100px 1fr;
    grid-template-areas:
        /* 'one two three' */
        'card-row'
        'description';
    grid-column-gap: 40px;
    grid-row-gap: 10px;
    align-items: center;
    justify-content: center;
    p {
        margin: 0;
        font-family: Avenir Next, sans-serif
    }
`;
export const CardRow = styled.div`
    grid-area: card-row;
    display: flex;
`
export const CardWrapper = styled.div`
    display: flex;
    width: ${CARD_SIZE}%;
    justify-content: center;
`;
export const CardDescription = styled.div`
    grid-area: description;
    display: ${props => props.selected ? `inline-table` : `none`};
    float: left;
    margin: 0;
    
    p {
        font-size: 23px;
    }
    li {
        font-size: 23px;
    }
    ul {
        margin-left: 80px;
        list-style-position: initial;
    }
    @media only screen and (max-width: 1200px) {
        p {
            font-size: 20px;
        }
        li {
            font-size: 20px;
        }
        }
    `;
export const Card = styled.div`
    /* grid-area: ${props => props.area}; */
    bottom: ${props => props.selected ? DAY_ONE_BOTTOM_SELECTED : DAY_ONE_BOTTOM}%;
    filter: ${props => props.selected ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))` : `none`};
    &:hover {
        filter: drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132));
        bottom: ${DAY_ONE_BOTTOM_SELECTED}%;
    }
    width: 100%;
    max-width: 260px;
    background: #a0a0e9;
    border-radius: 20px;
    padding: 20px;
    font-size: 32px;
    @media only screen and (max-width: 1200px) {
        font-size: 3vw;
    }
    font-weight: bold;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
`;