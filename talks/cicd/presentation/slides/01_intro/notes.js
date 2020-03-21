import React from 'react';
import { Heading, Markdown } from 'spectacle'
import example from './code-examples/example.md';
const one = [
<Heading caps fit size={1} textColor="primary">
Inline Markdown
</Heading>,
<Markdown>{example}</Markdown>
];

export default { one } ;