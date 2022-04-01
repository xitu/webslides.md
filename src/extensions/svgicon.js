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
    const match = src.match(/^{@\s*([\w_][\w-_]*)(?:\?([\w.]+))?\s*}/i);
    if(match) {
      return {
        type: 'icon',
        raw: match[0],
        file: match[1],
        size: match[2],
      };
    }
  },
  renderer(token) {
    const {file, size} = token;
    let className = "svgicon";
    let attrs = '';
    if(size) {
      const match = size.match(/^(\d+)x(\d+)/i);
      if(match) {
        attrs = ` width=${match[1]} height=${match[2]}`;
      } else if(size === 'large' || size === 'small') {
        className = `${className} ${size}`;
      } else {
        attrs = ` style="width:${size}"`;
      }
    } else {
      className = `${className} small`;
    }
    return `<img class="${className}" src="${WebSlides.config.CDN}/simple-icons@v6/icons/${file}.svg"${attrs}>`;
  }
};
