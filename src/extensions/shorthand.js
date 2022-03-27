// Override function
const tokenizer = {
  html(src) {
    let match = src.match(/^:::(\w+)[^\S\n]*(?:{(.*)})?[^\S\n]*(?:\[(.*)\])?[^\S\n]*((.*):::)?/);
    if (match) {
      // console.log(match[1].trim());
      const [a, b, c, d, e, f] = match;
      const className = c ? `class="${c.replace(/\./g, ' ').trim()}"`: '';
      const text = `<${b} ${className}${d?' '+d:''}>${e?`${f}</${b}>`:''}`;
      return {
        type: 'html',
        raw: a,
        text
      };
    }
    match = src.match(/^:::(\/\w+)/);
    if (match) {
      const [a, b] = match;
      return {
        type: 'html',
        raw: a,
        text: `</${b}>`,
      };
    }

    // return false to use original codespan tokenizer
    return false;
  }
};

export default { tokenizer };