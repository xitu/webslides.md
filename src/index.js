import 'webslides';
import 'webslides/static/css/webslides.css';
import 'prismjs/themes/prism.css';
import 'katex/dist/katex.css';
import './css/fix.css';

import {marked} from 'marked';
import mermaid from './extensions/mermaid';
import katex from './extensions/katex';

function addCSS(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.head.appendChild(link);
}

function htmlDecode(input){
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

const defaultOptions = {
  loop: false,
  marked: {
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
      const Prism = require('prismjs');
      return Prism.highlight(code, Prism.languages[lang], lang);
    },
    // langPrefix: 'language-',
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  },
};

Object.defineProperty(WebSlides.prototype, 'marked', {
  value: marked,
  writable: false,
  configurable: false,
  enumerable: true,
});

window.WebSlides = class MDSlides extends WebSlides {
  constructor({marked: markedOptions = {}, ...options} = {}) {
    const container = document.querySelector('#webslides[type=markdown]');
    const {marked: defaultMarkedOptions, ...defaultOpts} = defaultOptions;
    if(container) {
      const markedOpts = Object.assign({}, defaultMarkedOptions, markedOptions);
      marked.setOptions(markedOpts);
      marked.use(mermaid);
      marked.use(katex);
      const markdownText = htmlDecode(container.innerHTML).replace(/>\s*$/img,">\n")
        .replace(/^:::(\w+)\s*(?:{(.*)})?\s*(?:\[(.*)\])?/im, function(a, b, c, d) {
          const className = c ? `class="${c.replace(/\./g, ' ').trim()}"`: '';
          return `<${b} ${className} ${d}>\n`;
        }).replace(/^:::(\/\w+)/im, "<$1>");

      const slidesContent = markdownText.split(/^------/img).filter(c => c.trim());
      slidesContent.forEach((text) => {
        // console.log(text);
        let className, attributes;
        text = text.replace(/^:::\s*(?:{(.*)})?\s*(?:\[(.*)\])?/im, function(a, b, c) {
          className = b;
          if(c) {
            attributes = c.split(/\s+/).map(s => s.split('='));
          }
          return '';
        });
        const html = marked.parse(text);
        const section = document.createElement('section');
        // section.className = "slide-top";
        if(className) section.className = className.replace(/\./g, ' ').trim();
        if(attributes) {
          attributes.forEach(([k, v]) => {
            section.setAttribute(k, v);
          });
        }
        section.innerHTML = html;
        container.appendChild(section);
      });
      if(markedOpts.renderer.hasMermaid) {
        document.addEventListener('DOMContentLoaded',function(){
          const scriptEl = document.createElement('script');
          scriptEl.src = 'https://unpkg.com/mermaid/dist/mermaid.min.js';
          scriptEl.crossorigin = "anonymous";
          document.documentElement.appendChild(scriptEl);
        });
      }
    }
    options = Object.assign({}, defaultOpts, options);
    let {codeTheme} = options;
    if(codeTheme) {
      if(!/^http(s?):\/\//.test(codeTheme)) {
        codeTheme = `https://unpkg.com/prism-themes@1.9.0/themes/${codeTheme}.css`;
      }
      addCSS(codeTheme);
    }
    super(options);
  }
};

// export default marked;