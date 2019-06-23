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
        margin-top: 5%;
    }
    @media only screen and (min-width: 1600px) {
        margin-top: 13%;
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
    width: 100%;
    transform: scale(${props => props.scale > 1.5 ? 1.5 : props.scale});
    @media only screen and (min-width: 1200px) {
        transform: scale(${props => props.scale > 2.3 ? 2.3 : props.scale});
    }
    @media only screen and (min-width: 1920px) {
        transform: scale(1.8);
    }
    
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
      font-family: Avenir Next, sans-serif;
      background: #2d2d2d;
    }
`;
export const DiagramLabel = styled.div`
    display: flex;
    align-items: flex-start;
    margin-top: 10px;
    @media only screen and (max-width: 640px) {
      margin-top: 50px;
    }


`;
export const APIProductImageWrapper = styled.img`
  position: absolute;
  top: 70%;
  grid-area: image;
  filter: ${props =>
    props.selected
      ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))`
      : `none`};
  &:hover {
    filter: drop-shadow(0 3px 2px rgb(85, 72, 132))
      drop-shadow(0 2px 2px rgb(85, 72, 132));
  }
`
export const APIInformationImageWrapper = styled.img`
  grid-area: image;
  top: 10%;
  position: absolute;
  filter: ${props =>
    props.selected
      ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))`
      : `none`};
  &:hover {
    filter: drop-shadow(0 3px 2px rgb(85, 72, 132))
      drop-shadow(0 2px 2px rgb(85, 72, 132));
  }
`
export const APIPricingImageWrapper = styled.img`
  position: absolute;
  grid-area: image;
  top: 10%;
  filter: ${props =>
    props.selected
      ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))`
      : `none`};
  &:hover {
    filter: drop-shadow(0 3px 2px rgb(85, 72, 132))
      drop-shadow(0 2px 2px rgb(85, 72, 132));
  }
`
export const APIRatingImageWrapper = styled.img`
  position: absolute;
  grid-area: image;
  top: 10%;
  filter: ${props =>
    props.selected
      ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))`
      : `none`};
  &:hover {
    filter: drop-shadow(0 3px 2px rgb(85, 72, 132))
      drop-shadow(0 2px 2px rgb(85, 72, 132));
  }
`
export const APIStockImageWrapper = styled.img`
  position: absolute;
  top: -40%;
  grid-area: image;
  filter: ${props =>
    props.selected
      ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))`
      : `none`};
  &:hover {
    filter: drop-shadow(0 3px 2px rgb(85, 72, 132))
      drop-shadow(0 2px 2px rgb(85, 72, 132));
  }
`
export const APIAuthImageWrapper = styled.img`
  position: absolute;
  top: 44%;
  grid-area: image;
  filter: ${props =>
    props.selected
      ? `drop-shadow(0 3px 2px rgb(85, 72, 132)) drop-shadow(0 2px 2px rgb(85, 72, 132))`
      : `none`};
  &:hover {
    filter: drop-shadow(0 3px 2px rgb(85, 72, 132))
      drop-shadow(0 2px 2px rgb(85, 72, 132));
  }
`