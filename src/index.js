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

WebSlides.config = {
  CDN: 'https://cdn.jsdelivr.net/npm', // https://unpkg.com
  indent: true,
};

window.WebSlides = class MDSlides extends WebSlides {
  static get marked() {
    return marked;
  }
  constructor({marked: markedOptions = {}, ...options} = {}) {
    const container = document.querySelector('#webslides');
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
        if(mermaid.state.hasMermaid) {
          document.addEventListener('DOMContentLoaded',function(){
            const scriptEl = document.createElement('script');
            scriptEl.src = `${WebSlides.config.CDN}/mermaid/dist/mermaid.min.js`;
            scriptEl.crossorigin = "anonymous";
            document.documentElement.appendChild(scriptEl);
          });
        }
      }
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

// export default marked;