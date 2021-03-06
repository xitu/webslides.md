// :tag.classA.classB[attrA="a"][attrB="b"]
import {marked} from 'marked';
import {getAttrs, trimIndent} from '../utils';

export default {
  name: 'wrapper',
  level: 'block',
  // start(src) {
  //   const match = src.match(/>\n:[^:\n]/);
  //   if(match) return match.index;
  // },
  tokenizer(src) {
    const match = src.match(/^:([\w-_]*)(\.[^[\]\s]+)?((?:\[[^[\]]+\])*)[^\S\n]*((?:[^\S\n]*[^\s@][^\n]*)?)\s*?((?:\n(?:[^\S\n]+[^\n]+)?)*)/i);
    if(match) {
      if(match[0] === ':') return; // none match
      return {
        type: 'wrapper',
        raw: match[0],
        tagName: match[1] ? match[1] : 'div',
        className: match[2] ? match[2].replace(/\./g, ' ').trim() : null,
        attributes: match[3] ? match[3].replace(/[[\]]+/g, ' ').trim() : null,
        text: match[4],
        body: trimIndent(match[5]).trim(),
      };
    }
  },
  renderer(token) {
    // console.log(token);
    const {tagName, text, body} = token;
    const attrs = getAttrs(token);

    return `<${tagName}${attrs}>${text}${marked.parse(body)}</${tagName}>\n`;
  },
};