import { cloneElement } from 'react';
import Intro from './01_intro';

const slides = [].concat(
  Intro,
);

export default slides.map((slide, i) => cloneElement(slide, { key: i }));