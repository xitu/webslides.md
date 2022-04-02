// https://github.com/simple-icons/simple-icons

export default {
  name: 'icon',
  level: 'inline',
  start(src) {
    const match = src.match(/{@[^@\n]/);
    if(match) return match.index;
  },
  tokenizer(src) {
    // console.log(src);
    const match = src.match(/^{@\s*([\w_][\w-_]*)(?:\?([^\s]+))?\s*?}/i);
    if(match) {
      return {
        type: 'icon',
        raw: match[0],
        file: match[1],
        query: match[2],
      };
    }
  },
  renderer(token) {
    const {file, query} = token;
    let className = "svgicon";
    let attrs = '';
    if(query) {
      const {searchParams} = new URL(`svgicon://svgicon?${query}`);
      for(let [key, value] of searchParams.entries()) {
        attrs = `${attrs} ${key}="${value}"`;
        if(key === 'style') {
          attrs = `${attrs} data-style=${value}`;
        }
      }
    } else {
      className = `${className} small`;
    }
    return `<img class="${className}" src="${WebSlides.config.CDN}/bootstrap-icons/icons/${file}.svg"${attrs}>`;
  }
};
