export function addCSS(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.documentElement.appendChild(link);
}

export function htmlDecode(input) {
  const e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
}

export function trimIndent(input) {
  const lines = input.split(/\n/g).filter(l => l.trim());
  let spaces = Infinity;
  lines.forEach((line) => {
    spaces = Math.min(spaces, line.match(/^\s*/)[0].length);
  });
  if(spaces > 0) {
    input = input.replace(new RegExp(`^[^\\S\\n]{${spaces}}`, 'mg'), '');
  }
  return input;
}

export function getAttrs(token) {
  let className = '';
  let attributes = '';
  if(token.className) {
    className = ` class="${token.className}"`;
  }
  if(token.attributes) {
    attributes = ` ${token.attributes}`;
  }
  return `${className}${attributes}`;
}

export function zoom(section) {
  const h1 = section.clientHeight;
  const h2 = section.parentElement.clientHeight;
  if(WebSlides.config.debug) console.log(h1, h2);
  if(h1 > h2) {
    const zoomed = 0.925 * Math.sqrt(h2 / h1);
    section.style.zoom = zoomed;
  }
}