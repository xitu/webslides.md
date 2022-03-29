export function addCSS(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  document.documentElement.appendChild(link);
}

export function htmlDecode(input){
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
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