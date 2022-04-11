export default {
  name: 'attr',
  level: 'inline',
  start(src) {
    const match = src.match(/{[\^$][^^$]/);
    if(match) return match.index;
  },
  tokenizer(src) {
    const match = src.match(/^{([\^$])(\.[^[\]\s]+)?((?:\[[^[\]\n]+\])*)}/i);
    if(match) {
      const [b, c, d] = match.slice(1);
      const className = c ? c.replace(/\./g, ' ').trim() : null;
      const attrsJson = {};
      if(className) attrsJson.className = className;
      d.split(/[[\]]+/g).forEach((f) => {
        if(f) {
          const [k, v] = f.split('=');
          attrsJson[k] = v.replace(/^\s*"(.*)"$/i, '$1');
        }
      });

      const attrs = JSON.stringify(attrsJson);
      return {
        type: 'attr',
        raw: match[0],
        text: `<script type="text/webslides-attrs" position="${b}">${attrs}</script>`,
        // text: (!b || b === '^') ? `<!--^${attrs}-->` : `<!--$${attrs}-->`,
      };
    }
  },
  renderer(token) {
    return token.text;
  },
};
