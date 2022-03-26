import katex from 'katex';

const renderer = {
  code(code, info) {
    if(info === 'katex') {
      const html = katex.renderToString(code);
      return html;
    }
    return false;
  },
};

export default {renderer};