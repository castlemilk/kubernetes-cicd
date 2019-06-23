import React from 'react'
import APIProduct from './images/api-product.svg'
import APIInformation from './images/api-information.svg'
import APIPricing from './images/api-pricing.svg'
import APIRating from './images/api-rating.svg'
import APIStock from './images/api-stock.svg'
import APIAuth from './images/api-auth.svg'
import {
  Wrapper,
  LabelWrapper,
  DiagramWrapper,
  DiagramLabel,
  APIProductImageWrapper,
  APIInformationImageWrapper,
  APIPricingImageWrapper,
  APIRatingImageWrapper,
  APIStockImageWrapper,
  APIAuthImageWrapper,
} from './style'
import { Markdown } from 'spectacle'

const Label = props => (
  <LabelWrapper key={`label-${props.label.index}`} selected={props.index === props.label.index}>
    <div className='header'>{props.label.header}</div>
    <div className='description'>
      <Markdown>{props.label.description}</Markdown>
    </div>
  </LabelWrapper>
)
class Topology extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      index: 0,
      items: [
        {
          index: 0
        },
        {
          index: 1
        },
        {
          index: 2
        },
        {
          index: 3
        },
        {
          index: 4
        },
        {
          index: 5
        },
      ],
      width: 0,
      height: 0
    }
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }
  handleKeyPress (e) {
    if (e.key === 'ArrowUp') {
      this.setState(prevState => ({
        index:
          prevState.index < this.state.items.length ? prevState.index + 1 : 0
      }))
    } else if (e.key === 'ArrowDown') {
      this.setState(prevState => ({
        index:
          prevState.index > 0 ? prevState.index - 1 : this.state.items.length
      }))
    }
  }
  handleHover (index) {
    this.setState({ index: index })
  }
  updateWindowDimensions () {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      scale: window.innerWidth >= 1200 ? (window.innerWidth / window.innerHeight) * (480 / 640) : (window.innerWidth / window.innerHeight) * (480 / 640) * 0.7
    })
  }
  componentDidMount () {
    this.updateWindowDimensions()
    document.addEventListener('keydown', this.handleKeyPress, false)
    window.addEventListener('resize', this.updateWindowDimensions)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyPress, false)
    window.removeEventListener('resize', this.updateWindowDimensions)
  }
  render () {
    const labelView = this.props.labels.map(label => (
      <Label key={`arch-label-${label.index}`} index={this.state.index} label={label} />
    ))
    return (
      <Wrapper>
        <DiagramWrapper scale={this.state.scale}>
          <APIProductImageWrapper
            src={APIProduct}
            onMouseOver={() => this.handleHover(0)}
            selected={this.state.index === 0}
          />
          <APIInformationImageWrapper
            src={APIInformation}
            onMouseOver={() => this.handleHover(1)}
            selected={this.state.index === 1}
          />
          <APIPricingImageWrapper
            src={APIPricing}
            onMouseOver={() => this.handleHover(2)}
            selected={this.state.index === 2}
          />
          <APIRatingImageWrapper
            src={APIRating}
            onMouseOver={() => this.handleHover(3)}
            selected={this.state.index === 3}
          />
           <APIStockImageWrapper
            src={APIStock}
            onMouseOver={() => this.handleHover(4)}
            selected={this.state.index === 4}
          />
           <APIAuthImageWrapper
            src={APIAuth}
            onMouseOver={() => this.handleHover(5)}
            selected={this.state.index === 5}
          />

        </DiagramWrapper>
        <DiagramLabel scale={this.state.scale}>{labelView}</DiagramLabel>
      </Wrapper>
    )
  }
}

export default Topology