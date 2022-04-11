// Override function
const tokenizer = {
  html(src) {
    const match = src.match(/^<!--([\s\S]*?)-->/i);
    if(match) {
      return {
        type: 'html',
        raw: match[0],
        text: match[0].trim(),
      };
    }

    // return false to use original codespan tokenizer
    return false;
  },
};

export default {tokenizer};