import katex from 'katex';

function renderer(token) {
  const code = token.text;
  return katex.renderToString(code);
}

export default [{
  name: 'katex',
  level: 'block',
  tokenizer(src) {
    const match = src.match(/^<!--katex-->([\s\S]+?)<!--\/katex-->/);
    if (match) {
      return {
        type: 'katex',
        raw: match[0],
        text: match[1].trim()
      };
    }
  },
  renderer,
}, {
  name: 'katex-inline',
  level: 'inline',
  tokenizer(src) {
    const match = src.match(/^\$\$([^\n]+?)\$\$/);
    if (match) {
      return {
        type: 'katex',
        raw: match[0],
        text: match[1].trim()
      };
    }
  },
  renderer,
}];