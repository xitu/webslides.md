import {trimIndent, zoom} from '../utils';

const state = {};

export default {
  name: 'mermaid',
  level: 'block',
  // start(src) { return src.match(/:[^:\n]/)?.index; },
  tokenizer(src) {
    const match = src.match(/^:@mermaid\s*?((?:\n(?:[^\S\n]+[^\n]+)?)+)/i);
    if(match) {
      return {
        type: 'mermaid',
        raw: match[0],
        text: trimIndent(match[1]).trim(),
      };
    }
  },
  renderer(token) {
    const code = `<div class="mermaid aligncenter">
${token.text}
</div>`;
    if(!state.hasMermaid) {
      state.hasMermaid = true;
      const scriptEl = document.createElement('script');
      scriptEl.src = `${WebSlides.config.CDN}/mermaid/dist/mermaid.min.js`;
      scriptEl.crossorigin = 'anonymous';
      document.documentElement.appendChild(scriptEl);
      scriptEl.onload = () => {
        mermaid.startOnLoad = false;
        mermaid.initialize({});
        mermaid.parseError = function (err) {
          console.error(err);
        };
        const mermaidGraphs = document.querySelectorAll('.slide.current .mermaid');
        mermaid.init(mermaidGraphs);
        if(mermaidGraphs.length && WebSlides.config.zoom) zoom(document.querySelector('.slide.current'));
      };
    }
    return code;
  },
  state,
};