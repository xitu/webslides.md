// :tag.classA.classB[attrA="a"][attrB="b"]
import {getPrefix, trimIndent} from '../utils';
import {marked} from 'marked';

export default {
  name: 'wrapper',
  level: 'block',
  tokenizer(src) {
    let match = src.match(/^:([\w-_]*)(?:(\.[^\[\]\s]+)*)((?:\[[^\[\]]+\])*)((?:[^\S\n]*[\S][^\n]*)?)\s*?\n((?:\s+[^\n]+\n)*)/i);
    if(match) {
      return {
        type: 'wrapper',
        raw: match[0],
        tagName: match[1] ? match[1] : 'div',
        className: match[2] ? match[2].replace(/\./g, ' ').trim() : null,
        attributes: match[3] ? match[3].replace(/[\[\]]+/g, ' ').trim() : null,
        text: match[4],
        body: trimIndent(match[5]),
      };
    }
  },
  renderer(token) {
    console.log(token);
    const {tagName, text, body} = token;
    const {className, attributes} = getPrefix(token);

    return `<${tagName}${className}${attributes}>${text}${marked.parse(body)}</${tagName}>\n`;
  }
};