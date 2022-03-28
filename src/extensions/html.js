// Override function
const tokenizer = {
  html(src) {
    const match = src.match(/^<!--html-->([\s\S]+?)<!--\/html-->/);
    if (match) {
      return {
        type: 'html',
        raw: match[0],
        text: match[1].trim()
      };
    }

    // return false to use original codespan tokenizer
    return false;
  }
};

export default { tokenizer };