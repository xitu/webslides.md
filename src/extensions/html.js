// Override function
const tokenizer = {
  html(src) {
    const match = src.match(/^:\@html\s*?((?:\n(?:[^\S\n]+[^\n]+)?)+)/i);
    // console.log(src, match);
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