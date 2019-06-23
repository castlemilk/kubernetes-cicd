import React, { Component } from 'react'
import Client from './images/client.svg';
import Microservices from './images/microservices.svg';
import Background from './images/background.svg';
import Ingress from './images/ingress.svg';
import IngressGateway from './images/ingress-gateway.svg';
import Service from './images/service.svg';
import { 
    Wrapper,
    LabelWrapper,
    DiagramWrapper,
    DiagramLabel,
    BackgroundImageWrapper,
    ClientImageWrapper,
    IngressImageWrapper,
    IngressGatewayImageWrapper,
    ServiceImageWrapper,
    MicroservicesImageWrapper,

 } from './style';
import { Markdown } from 'spectacle';

const Label = (props) => <LabelWrapper key={`label-${props.label.index}`} selected={props.index===props.label.index}><div className="header">{props.label.header}</div><div className="description"><Markdown>{props.label.description}</Markdown></div></LabelWrapper>

class Architecture extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 6,
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
                }
                
            ],
            width: 0,
            height: 0,
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    }
    handleKeyPress(e) {
        if (e.key === 'ArrowUp') {
            this.setState(prevState => ({ index: (prevState.index < 6 ? prevState.index + 1 : 0)}))
        } else if (e.key === 'ArrowDown') {
            this.setState(prevState => ({ index: (prevState.index > 0 ? prevState.index - 1 : 5)}))
        }
    }
    handleHover(index) {
        this.setState({ index: index});
    }
    updateWindowDimensions() {
        // console.log((window.innerWidth / window.innerHeight) * (395/526))
        this.setState({ width: window.innerWidth, height: window.innerHeight, scale: (window.innerWidth / window.innerHeight) * (526/395) * (0.90)})
    }
    componentDidMount() {
        this.updateWindowDimensions()
        document.addEventListener('keydown',this.handleKeyPress, false);
        window.addEventListener('resize', this.updateWindowDimensions)
    }
    componentWillUnmount() {
        document.removeEventListener('keydown',this.handleKeyPress, false);
        window.removeEventListener('resize', this.updateWindowDimensions)
    }
    render() {
        const labelView = this.props.labels.map(label => <Label key={`label-${label.index}`} index={this.state.index} label={label} />)
        return (<Wrapper >
            <DiagramWrapper scale={this.state.scale}>
                <BackgroundImageWrapper src={Background} onMouseOver={() => this.handleHover(0)} selected={this.state.index===0}/>
                <ClientImageWrapper src={Client} onMouseOver={() => this.handleHover(1)} selected={this.state.index===1}/>
                <IngressImageWrapper src={Ingress} onMouseOver={() => this.handleHover(2)} selected={this.state.index===2}/>
                <IngressGatewayImageWrapper src={IngressGateway} onMouseOver={() => this.handleHover(3)} selected={this.state.index===3}/>
                <ServiceImageWrapper src={Service} onMouseOver={() => this.handleHover(4)} selected={this.state.index===4}/>
                <MicroservicesImageWrapper src={Microservices} onMouseOver={() => this.handleHover(5)} selected={this.state.index===5}/>
            </DiagramWrapper>
            <DiagramLabel>
            {labelView}
            </DiagramLabel>
        </Wrapper>)
    }
}

export default Architecture;