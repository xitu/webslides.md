import 'webslides';
import 'webslides/static/css/webslides.css';
import 'prismjs/themes/prism.css';
import 'katex/dist/katex.css';
import './css/fix.css';

import {marked} from 'marked';
import mermaid from './extensions/mermaid';
import katex from './extensions/katex';
import html from './extensions/html';
import prestyle from './extensions/prestyle';

import config from './config';
import {addCSS, htmlDecode, trimIndent} from './utils';

const defaultOptions = {
  loop: false,
  autoslide: false,
  changeOnClick: false,
  showIndex: true,
  navigateOnScroll: true,
  minWheelDelta: 40,
  scrollWait: 450,
  slideOffset: 50,
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

function applyConfig(config, el) {
  Object.keys(config).forEach((key) => {
    if(el.hasAttribute(key)) {
      let value = el.getAttribute(key);
      const type = typeof config[key];
      if(type === 'boolean') {
        config[key] = value && value !== 'no' && value !== 'false';
      } else if(type === 'number') {
        config[key] = Number(value);
      } else {
        config[key] = value;
      }
    }
  });
}

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
    options = Object.assign({}, defaultOpts, options);
    if(container) {
      applyConfig(config, container);
      applyConfig(options, container);
      const sections = container.querySelectorAll('section');
      if(sections.length) {
        const markedOpts = Object.assign({}, defaultMarkedOptions, markedOptions);
        marked.setOptions(markedOpts);
        marked.use({extensions: [mermaid, prestyle, ...katex]});
        marked.use(html);

        sections.forEach((section) => {
          let content = htmlDecode(section.innerHTML);
          if(WebSlides.config.indent) {
            content = trimIndent(content);
          }
          content = content
            .replace(/^:::(\w+)[^\S\n]*(?:{(.*)})?[^\S\n]*(?:\[(.*)\])?[^\S\n]*((.*):::)?/img, (a, b, c, d, e, f) => {
              const className = c ? `class="${c.replace(/\./g, ' ').trim()}"`: '';
              return `<${b} ${className}${d?' '+d:''}>${e?`${f}</${b}>`:''}`;
            })
            .replace(/^:::(\/\w+)/img, (a, b) => {
              return `<${b}>`;
            })
            .replace(/>[^\S\n]*$/img,">\n");

          section.innerHTML = marked.parse(content)
            .replace(/<!--##\s*(.*?)-->\s*<(\w+)/img, "<$2 $1");
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
    let {codeTheme} = config;
    if(codeTheme && codeTheme !== 'default') {
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