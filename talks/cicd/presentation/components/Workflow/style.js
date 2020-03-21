import styled from 'styled-components'

export const Wrapper = styled.div`
    display: grid;
    grid-template-areas:
        'diagram'
        'label';
    grid-template-rows: 80% 250px;
    grid-row-gap: 10px; 
    @media only screen and (min-width: 1200px) {
        grid-template-rows: 80% 250px;
    }
    padding-bottom: 127px;

`;
export const LabelWrapper = styled.div`
    grid-area: label;
    display: ${props => props.selected ? `flex` : `none`};
    flex-direction: column;
    position: relative;
    text-align: left;
    justify-content: center;
    margin-top: -3%;
    @media only screen and (min-width: 1200px) {
        margin-top: 15%;
    }
    @media only screen and (min-width: 1600px) {
        margin-top: 20%;
    }
    
    .header {
        font-size: 25px;
        font-weight: bold;
    }
    .description p {
        font-size: 22px;
    }
    .description code {
        font-size: 22px;
    }
    
`;
export const DiagramWrapper = styled.div`
    grid-area: diagram;
    transform: scale(${props => props.scale > 1.5 ? 1.5 : props.scale});
    @media only screen and (min-width: 1200px) {
        transform: scale(${props => props.scale > 2.3 ? 2.3 : props.scale});
    }
    
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
        font-family: Avenir Next, sans-serif;

    }
`;
export const DiagramLabel = styled.div`
    display: flex;

`;
export const ClientImageWrapper = styled.img`
    position: absolute;
    width: 40px;
    grid-area: image;
    bottom: ${props => props.selected ? 34 : 29}px;
    filter: ${props => props.selected ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))` : `none`};
    &:hover {
        filter: drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132));
    }
`;
export const IngressGatewayImageWrapper = styled.img`
    position: absolute;
    grid-area: image;
    bottom: ${props => props.selected ? 123 : 118}px;
    filter: ${props => props.selected ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))` : `none`};
    &:hover {
        filter: drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132));
    }
`;
export const ServiceImageWrapper = styled.img`
    position: absolute;
    z-index: 11;
    grid-area: image;
    bottom: ${props => props.selected ? 153 : 148}px;
    filter: ${props => props.selected ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))` : `none`};
    &:hover {
        filter: drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132));
    }
`;
export const BackgroundImageWrapper = styled.img`
    filter: ${props => props.selected ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))` : `none`};
    &:hover {
        filter: drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132));
    }
`
export const MicroservicesImageWrapper = styled.img`
    position: absolute;
    z-index: 2;
    bottom: ${props => props.selected ? 197 : 192}px;
    filter: ${props => props.selected ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))` : `none`};
    &:hover {
        filter: drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132));
    }
`;
export const IngressImageWrapper = styled.img`
    position: absolute;
    bottom: ${props => props.selected ? 75 : 70}px;
    filter: ${props => props.selected ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))` : `none`};
    &:hover {
        filter: drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132));
    }
`;