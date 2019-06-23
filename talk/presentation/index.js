import React from "react";
import {
  Deck,
} from "spectacle";
import createTheme from "spectacle/lib/themes/default";
import { cloneElement } from 'react';
import Intro from './slides/01_intro';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-vim';
import './prism-tomorrow-night.css';

require("normalize.css");

const TYPES = {
  theory: 'THEORY',
  workshops: 'WORKSHOPS'
}

const introduction_deck = [].concat(
  Intro,
).map((slide, i) => cloneElement(slide, { key: i }));

const theme = createTheme({
  primary: "white",
  secondary: "#1F2022",
  tertiary: "#03A9FC",
  quaternary: "#CECECE",
  codeBackground: '#2d2d2d',
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});

export class Introduction extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (<Deck transition={["zoom", "slide"]} transitionDuration={500} contentWidth={1500} maxWidth={1500} theme={theme}>
    { introduction_deck }
    </Deck>)
  }
}