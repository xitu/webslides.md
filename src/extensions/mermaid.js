const state = {};

export default {
  name: 'mermaid',
  level: 'block',
  tokenizer(src) {
    const match = src.match(/^<!--mermaid-->([\s\S]+?)<!--\/mermaid-->/);
    if (match) {
      // console.log(match[1].trim());
      return {
        type: 'mermaid',
        raw: match[0],
        text: match[1].trim()
      };
    }
  },
  renderer(token) {
    const code = token.text;
    state.hasMermaid = true;
    return `<div class="mermaid aligncenter">
${code}
</div>`;
  },
  state,
};