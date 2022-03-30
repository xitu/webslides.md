import katex from 'katex';

function renderer(token) {
  const {text:code, macros} = token;
  let ret = code;
  try {
    return katex.renderToString(code, {
      macros
    });
  } catch(ex) {
    console.error(ex.message);
    return ret;
  }
}

export default [{
  name: 'katex',
  level: 'block',
  tokenizer(src) {
    const match = src.match(/^<!--katex(\s*[\s\S]*)?-->([\s\S]+?)<!--\/katex-->/i);
    if (match) {
      let macros = match[1];
      if(macros) {
        try {
          macros = JSON.parse(match[1]);
        } catch(ex) {
          console.error(ex.message);
        }
      }
      return {
        type: 'katex',
        raw: match[0],
        macros,
        text: match[2].trim()
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