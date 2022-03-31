import 'webslides';
import 'webslides/static/css/webslides.css';
import 'prismjs/themes/prism.css';
import 'katex/dist/katex.css';
import './css/fix.css';

import {marked} from 'marked';
import mermaid from './extensions/mermaid';
import katex from './extensions/katex';
import html from './extensions/html';
import wrapper from './extensions/wrapper';

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
        marked.use({extensions: [mermaid, wrapper, ...katex]});
        marked.use(html);

        sections.forEach((section) => {
          let content = htmlDecode(section.innerHTML);
          if(WebSlides.config.indent) {
            content = trimIndent(content);
          }
          content = content
            .replace(/(\w-_)\s*>[^\S\n]*$/img,"$1>\n")
            .replace(/<!--([\^\$])?(\.[^\[\]\s]+)?((?:\[[^\[\]\n]+\])*)-->/img, (a, b, c, d) => {
              const className = c ? c.replace(/\./g, ' ').trim() : null;
              const attrsJson = {};
              if(className) attrsJson.className = className;
              d.split(/[\[\]]+/g).forEach((f) => {
                if(f) {
                  const [k, v] = f.split('=');
                  attrsJson[k] = v.replace(/^\s*"(.*)"$/i, "$1");
                }
              });
              const attrs = JSON.stringify(attrsJson);
              return (!b || b === '^') ? `<!--^${attrs}-->` : `<!--$${attrs}-->`;
            });

          section.innerHTML = marked.parse(content)
            .replace(/<!--([\^\$])\s*([^\n]*?)-->/img, '<textarea type="webslides-attrs" style="display:none" position="$1">$2</textarea>');

          const preattrs = section.querySelectorAll('textarea[type="webslides-attrs"]');
          preattrs.forEach((el) => {
            const node = el.getAttribute('position') === '^' ? el.nextElementSibling : el.previousElementSibling;
            if(node) {
              const attrs = JSON.parse(el.textContent);
              for(const [k, v] of Object.entries(attrs)) {
                if(k === 'className') {
                  node.className = node.className ? `${node.className} ${v}` : v;
                }
                else node.setAttribute(k, v);
              }
              el.remove();
            }
          });
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