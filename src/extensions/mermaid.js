const renderer = {
  code(code, info) {
    if(info === 'mermaid') {
      this.hasMermaid = true;
      return `<div class="mermaid aligncenter">
${code}
</div>`;
    }
    return false;
  },
};

export default {renderer};