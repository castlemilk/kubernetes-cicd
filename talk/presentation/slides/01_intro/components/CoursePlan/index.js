import React from 'react'
import {
    Markdown,
  } from 'spectacle'

import { 
    Wrapper,
    Card,
    CardWrapper,
    CardRow,
    CardDescription,
 } from './style';

const Header = (index, meta) => <CardWrapper key={`header-${meta.index}`}><Card selected={index===meta.index}>{meta.header}</Card></CardWrapper>
const Description = (index, meta) => <CardDescription key={`desc-${meta.index}`} selected={index===meta.index}><Markdown textAlign="left" >{`${meta.description}`}</Markdown></CardDescription>
class CoursePlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    handleKeyPress(e) {
        e.preventDefault()
        if (e.key === 'ArrowUp') {
            this.setState(prevState => ({ index: (prevState.index < 3 ? prevState.index + 1 : 0)}))
        } else if (e.key === 'ArrowDown') {
            this.setState(prevState => ({ index: (prevState.index > 0 ? prevState.index - 1 : 2)}))
        }
    }
    componentDidMount() {
        document.addEventListener('keydown',this.handleKeyPress, false);
    }
    componentWillUnmount() {
        document.removeEventListener('keydown',this.handleKeyPress, false);
    }
    render() {
        const headers = this.props.content.map( item => Header(this.state.index, item))
        const descriptions = this.props.content.map( item => Description(this.state.index, item))
        return (<Wrapper >
            <CardRow>{headers}</CardRow>
            {descriptions}
        </Wrapper>)
    }
}

export default CoursePlan;