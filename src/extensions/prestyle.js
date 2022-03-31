import {getPrefix} from '../utils';

export default {
  name: 'prestyle',
  level: 'block',
  tokenizer(src) {
    let match = src.match(/^<!--((?:\.\w+)*)((?:\[[^\[\]]+\])*)-->/i);
    if(match) {
      return {
        type: 'prestyle',
        raw: match[0],
        className: match[1] ? match[1].replace(/\./g, ' ').trim() : null,
        attributes: match[2] ? match[2].replace(/[\[\]]+/g, ' ').trim() : null,
      };
    }
  },
  renderer(token) {
    // console.log(token);
    const {className, attributes} = getPrefix(token);
    return `<!--##${className}${attributes}-->`;
  }
};