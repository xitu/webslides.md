function getPrefix(token) {
  let className = '';
  let attributes = '';
  if(token.className) {
    className = ` class="${token.className}"`;
  }
  if(token.attributes) {
    attributes = ` ${token.attributes}`;
  }
  return {className, attributes};
}

export default {
  name: 'prestyle',
  level: 'block',
  tokenizer(src) {
    let match = src.match(/^<!--(?:{(.*?)})?(?:\[(.*?)\])?-->/i);
    if(match) {
      return {
        type: 'prestyle',
        raw: match[0],
        className: match[1] ? match[1].replace(/\./g, ' ').trim() : null,
        attributes: match[2] ? match[2].trim() : null,
      };
    }
    match = src.match(/^<!--([^{}\[\]\n]+?)-->/i);
    if(match) {
      return {
        type: 'prestyle',
        raw: match[0],
        className: match[1] ? match[1].replace(/\./g, ' ').trim() : null,
        attributes: null,
      };
    }
  },
  renderer(token) {
    // console.log(token);
    const {className, attributes} = getPrefix(token);
    return `<!--##${className}${attributes}-->`;
  }
};