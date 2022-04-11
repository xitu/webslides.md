import 'webslides';
// import 'webslides/static/css/webslides.css';
import 'prismjs/themes/prism.css';
import 'katex/dist/katex.css';
import './css/webslides.css';
import './css/fix.css';

import {marked} from 'marked';
import mermaid from './extensions/mermaid';
import katex from './extensions/katex';
import attr from './extensions/attr';
import html from './extensions/html';
import comment from './extensions/comment';
import wrapper from './extensions/wrapper';
import svgicon from './extensions/svgicon';

import config from './config';
import {addCSS, htmlDecode, trimIndent, zoom} from './utils';

const blockTags = 'address|article|aside|base|basefont|blockquote|body|caption'
+ '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption'
+ '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe'
+ '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option'
+ '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr'
+ '|track|ul';

const blockReg = new RegExp(`(<\\s*(?:(?:\\/\\s*(?:${blockTags})\\s*)|(?:(?:${blockTags})\\s*\\/\\s*)|hr)>\\s*?)\\n`, 'ig');

class Renderer extends marked.Renderer {
  code(code, infostring, escaped) {
    code = code.replace(blockReg, '$1'); // 代码中去掉在Block元素后补的回车
    return super.code(code, infostring, escaped);
  }
}

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
    renderer: new Renderer(),
    highlight(code, lang) {
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
    xhtml: false,
    headerIds: false,
  },
};

function applyConfig(config, el) {
  Object.keys(config).forEach((key) => {
    if(el.hasAttribute(key)) {
      const value = el.getAttribute(key);
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
  if(el.hasAttribute('stroke')) {
    svg.style.stroke = el.getAttribute('stroke');
  }
  el.parentNode.insertBefore(frag.childNodes[0], el);
  el.remove();
}

function findSibling(el, pos = el.getAttribute('position')) {
  const node = pos === '^' ? el.nextElementSibling : el.previousElementSibling;
  if(node) {
    if(node.tagName.toLowerCase() === 'br') {
      return findSibling(node, pos);
    }
    return node;
  }
  if(pos === '$') {
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
      const sections = container.querySelectorAll('article > section');
      if(sections.length) {
        const markedOpts = Object.assign({}, defaultMarkedOptions, markedOptions);
        marked.setOptions(markedOpts);
        marked.use(html);
        marked.use(comment);
        marked.use({extensions: [wrapper, attr, mermaid, svgicon, ...katex]});

        sections.forEach((section) => {
          let content = htmlDecode(section.innerHTML);
          if(WebSlides.config.indent) {
            content = trimIndent(content);
          }

          content = content
            .replace(blockReg, (a) => {
              return `${a}\n`;
            }); // 需要在Block元素后补一个回车，不然解析会有问题

          section.innerHTML = marked.parse(content);

          const precode = section.querySelectorAll('pre:not([class*=lang-]) code');
          precode.forEach((el) => {
            if(!el.parentNode.className) el.parentNode.className = 'lang-plaintext';
          });

          const preattrs = section.querySelectorAll('script[type="text/webslides-attrs"]');
          preattrs.forEach((el) => {
            const parent = el.parentElement;
            if(parent && parent.tagName.toLowerCase() === 'p' && parent.childNodes.length === 1) {
              parent.setAttribute('position', el.getAttribute('position'));
              el = parent;
            }
            const node = findSibling(el);
            if(node) {
              const attrs = JSON.parse(el.textContent);
              for(const [k, v] of Object.entries(attrs)) {
                if(k === 'className') {
                  node.className = node.className ? `${node.className} ${v}` : v;
                } else node.setAttribute(k, v);
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
        const section = document.querySelector('#webslides section.current');
        // load svgicon
        const svgicons = section.querySelectorAll('img.svgicon[fill],img.svgicon[stroke]');
        svgicons.forEach((el) => {
          if(el.clientHeight > 0) {
            loadSvgIcon(el);
          } else {
            el.onload = loadSvgIcon.bind(null, el);
          }
        });
        if(window.mermaid && window.mermaid.init) {
          const mermaidGraphs = document.querySelectorAll('.slide.current .mermaid');
          window.mermaid.init(mermaidGraphs);
          if(mermaidGraphs.length && !section.style.zoom) {
            if(config.zoom) zoom(section);
          }
        }
      });
      // zoom
      if(config.zoom) sections.forEach(zoom);
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

document.addEventListener('DOMContentLoaded', () => {
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