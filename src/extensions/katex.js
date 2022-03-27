import katex from 'katex';

export default {
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
  renderer(token) {
    const code = token.text;
    return katex.renderToString(code);
  },
};