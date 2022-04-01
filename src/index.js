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
import svgicon from './extensions/svgicon';

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

async function loadSvgIcon(el) {
  const res = await (await fetch(el.src)).text();
  const frag = document.createElement('div');
  frag.innerHTML = res;
  const svg = frag.childNodes[0];
  svg.style = `width:${el.clientWidth}px;height:${el.clientHeight}px;vertical-align:text-bottom;margin:0 0.25em;${el.dataset.style ? el.dataset.style : ''}`;
  if(el.hasAttribute('fill')) {
    svg.style.fill = el.getAttribute('fill');
  }
  el.parentNode.insertBefore(frag.childNodes[0], el);
  el.remove();
}

function findSibling(el, pos = el.getAttribute('position')) {
  const node = pos === '^' ? el.nextElementSibling : el.previousElementSibling;
  if(node) {
    if(node.nodeName.toLowerCase() === 'br') {
      return findSibling(node, pos);
    }
    return node;
  } else if(pos === '$') {
    return el.parentNode;
  }
  return null;
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
        marked.use(html);
        marked.use({extensions: [wrapper, mermaid, svgicon, ...katex]});

        sections.forEach((section) => {
          let content = htmlDecode(section.innerHTML);
          if(WebSlides.config.indent) {
            content = trimIndent(content);
          }
          content = content
            .replace(/([\w_][\w-_"]*)\s*>[^\S\n]*\n(?![^\S\n]*<)/img,(a, b) => {
              if(b === 'div' || b === 'p' || /^h/.test(b)) {
                return `${b}>\n\n`;
              }
              return `${b}>\n`;
            }); //尽量在HTML标签后补回车
          
          content = content.replace(/{([\^\$])(\.[^\[\]\s]+)?((?:\[[^\[\]\n]+\])*)}/img, (a, b, c, d) => {
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
            .replace(/<!--([\^\$])\s*([^\n]*?)-->/img, '<script type="text/webslides-attrs" position="$1">$2</script>');
          
          const preattrs = section.querySelectorAll('script[type="text/webslides-attrs"]');
          preattrs.forEach((el) => {
            const node = findSibling(el);
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

          // svgicon
          const svgicons = section.querySelectorAll('img.svgicon');
          svgicons.forEach(async (el) => {
            if(el.clientHeight > 0) {
              loadSvgIcon(el);
            } else {
              el.onload = loadSvgIcon.bind(null, el);
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

console.log(`WebSlides.md - 能运行在任意 Playground 上的演示文稿
支持 Markdown 扩展语法
与【码上掘金】平台搭配使用更佳
当前版本：${VERSION}
代码仓库：https://github.com/xitu/webslides.md
官网：http://slides.juejin.fun
`);
// export default marked;