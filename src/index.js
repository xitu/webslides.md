import 'webslides';
import 'webslides/static/css/webslides.css';
import 'prismjs/themes/prism.css';
import 'katex/dist/katex.css';
import './css/fix.css';

import {marked} from 'marked';
import mermaid from './extensions/mermaid';
import katex from './extensions/katex';
import html from './extensions/html';
import shorthand from './extensions/shorthand';

import {addCSS, htmlDecode, trimIndent} from './utils';

const defaultOptions = {
  loop: false,
  marked: {
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
      const Prism = require('prismjs');
      const language = Prism.languages[lang];
      if(language) {
        return Prism.highlight(code, language, lang);
      }
      return code;
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

const config = {
  CDN: 'https://cdn.jsdelivr.net/npm', // https://unpkg.com
  indent: true,
};

window.WebSlides = class MDSlides extends WebSlides {
  static get marked() {
    return marked;
  }
  static get config() {
    return config;
  }
  constructor({marked: markedOptions = {}, ...options} = {}) {
    const container = document.querySelector('#webslides:not([done="done"])');
    const {marked: defaultMarkedOptions, ...defaultOpts} = defaultOptions;
    if(container) {
      const sections = container.querySelectorAll('section');
      if(sections.length) {
        const markedOpts = Object.assign({}, defaultMarkedOptions, markedOptions);
        marked.setOptions(markedOpts);
        marked.use({extensions: [mermaid, ...katex]});
        marked.use(html);
        marked.use(shorthand);

        sections.forEach((section) => {
          let content = htmlDecode(section.innerHTML);
          if(WebSlides.config.indent) {
            content = trimIndent(content);
          }
          content = content.replace(/>[^\S\n]*$/img,">\n");
          
          section.innerHTML = marked.parse(content);
        });
      }
      container.setAttribute('done', 'done');
      if(!options.codeTheme && container.hasAttribute('codeTheme')) {
        options.codeTheme = container.getAttribute('codeTheme');
      }
      container.addEventListener('ws:slide-change', () => {
        if(window.mermaid && window.mermaid.init) {
          const mermaidGraphs = document.querySelectorAll('.slide.current .mermaid');
          window.mermaid.init(mermaidGraphs);
        }
      });
    }
    options = Object.assign({}, defaultOpts, options);
    let {codeTheme} = options;
    if(codeTheme) {
      if(!/^http(s?):\/\//.test(codeTheme)) {
        codeTheme = `${WebSlides.config.CDN}/prism-themes@1.9.0/themes/${codeTheme}.css`;
      }
      addCSS(codeTheme);
    }
    super(options);
  }
};

document.addEventListener('DOMContentLoaded',function(){
  const container = document.querySelector('#webslides:not([done="done"])');
  if(container) new WebSlides();
});
// export default marked;