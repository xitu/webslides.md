const state = {};

export default {
  name: 'mermaid',
  level: 'block',
  tokenizer(src) {
    const match = src.match(/^<!--mermaid-->([\s\S]+?)<!--\/mermaid-->/i);
    if (match) {
      return {
        type: 'mermaid',
        raw: match[0],
        text: match[1].trim()
      };
    }
  },
  renderer(token) {
    let code = `<div class="mermaid aligncenter">
${token.text}
</div>`;
    if(!state.hasMermaid) {
      state.hasMermaid = true;
      const scriptEl = document.createElement('script');
      scriptEl.src = `${WebSlides.config.CDN}/mermaid/dist/mermaid.min.js`;
      scriptEl.crossorigin = "anonymous";
      document.documentElement.appendChild(scriptEl);
      scriptEl.onload = () => {
        mermaid.startOnLoad = false;
        mermaid.initialize({});
        const mermaidGraphs = document.querySelectorAll('.slide.current .mermaid');
        mermaid.init(mermaidGraphs);
      };
    }
    return code;
  },
  state,
};