# WebSlides.md

集成 [WebSlides](https://github.com/webslides/WebSlides) 和 [Markdown](https://github.com/markedjs/marked)。

## 这个项目做什么用？

简单来说当然是在线分享PPT（Slides）（手动狗头）。

具体来说就是你可以用**任意一个简单的、在线能够运行 Web 代码的 Playground 环境**来当做 PPT 制作工具来写你的 PPT，比如 [CodePen](https://codepen.io/)、[JSBin](https://jsbin.com/?html,js,output)、[CodeSandbox](https://codesandbox.io)、[Stackblitz](https://stackblitz.com/) 以及[稀土掘金](https://juejin.cn)即将推出的一款新的在线编写和分享代码的产品。

所有你需要做的不过是在你的 HTML 文件中引入一个简单的 JS 文件（gzip前300多KB），以及一个 CSS 文件（gzip前100KB)。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WebSlides.md</title>
  <link rel="stylesheet" type="text/css" href="static/mdslides.css"></link>
  <script src="static/mdslides.js"></script>
</head>
<body>
  <article id="webslides">
    <section>
      # 我是第一页
    </section>
    <section>
      # 我是第二页
    </section>
    <section>
      # 我是第三页
    </section>
  </article>
</body>
</html>
```

**WIP**

---


<h2 align="center">致谢</h2>

- [WebSlides](https://github.com/webslides/WebSlides)
- [marked](https://github.com/markedjs/marked)
- [prism](https://github.com/PrismJS/prism)
- [esbuild](https://github.com/evanw/esbuild)
- [mermaid](https://github.com/mermaid-js/mermaid)
- [KaTex](https://github.com/KaTeX/KaTeX)
- [NodePPT](https://github.com/ksky521/nodeppt)
