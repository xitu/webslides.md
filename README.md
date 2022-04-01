# WebSlides.md

集成 [WebSlides](https://github.com/webslides/WebSlides) 和 [Markdown](https://github.com/markedjs/marked)。

## 这个项目做什么用？

简单来说当然是在线分享PPT（Slides）（手动狗头）。

具体来说就是你可以用**任意一个简单的、在线能够运行 Web 代码的 Playground 环境**来当做 PPT 制作工具来写你的 PPT，比如 [CodePen](https://codepen.io/)、[JSBin](https://jsbin.com/?html,js,output)、[CodeSandbox](https://codesandbox.io)、[Stackblitz](https://stackblitz.com/) 以及[稀土掘金](https://juejin.cn)即将推出的一款新的在线编写和分享代码的产品。

所有你需要做的不过是在你的 HTML 文件中引入一个简单的 JS 文件（gzip前300多KB），以及一个 CSS 文件（gzip前100KB)。

[在线演示（左右键翻页）](https://codepen.io/akira-cn/pen/gOoRmmR)
```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/webslides.md/dist/webslides.css">
<script src="https://cdn.jsdelivr.net/npm/webslides.md/dist/webslides.js"></script>  
<article id="webslides">
  <section>
    # 我是第一页
  </section>
  <section class="bg-trans-dark">
    # 我是第二页
  </section>
  <section class="bg-black-blue">
    # 我是第三页
  </section>
</article>
```

## 类似的项目

### WebSlides

[WebSlides](https://github.com/webslides/WebSlides) 是一个基于HTML和CSS的在线写PPT的工具，它基于内建的语义化CSS，让你只需要了解基本的前端页面知识，就可以写出好看的PPT。

实际上，这个项目就是基于 WebSlides 本身，在它的基础上增加了一些特性，最主要的是支持了 Markdown 语法，并且（通过扩展）保留了 WebSlides 纯 HTML 写法。

> WebSlides 关于支持 Markdown 语法的讨论见[这个 issue](https://github.com/webslides/WebSlides/issues/11)，但遗憾的是，这个2017年的需求官方并没有响应。WebSlides.md 通过集成 WebSlides 和 [marked](https://github.com/markedjs/marked)，加入了 Markdown 语法。

### NodePPT

[三水清](https://github.com/ksky521)老师的 [NodePPT](https://github.com/ksky521/nodeppt) 是迄今为止最好用的 Web 演讲工具之一。如果你使用 NodeJS，你可以安装这个工具，用 Markdown 创作 PPT 并运行 Node 服务来演示 PPT。

NodePPT 也是结合了 WebSlides 和 Markdown，它通过 markdown-it 解析 Markdown、通过 posthtml 处理 HTML 标签。

> 如果你需要一个专业的，在个人便携电脑上创作和运行 PPT 的工具，那么推荐 NodePPT，如果你希望在已有在线 Playground 平台上快速演示和分享 PPT，那么 WebSlides.md 是更简单的选择。

### Slidev

[Slidev](https://github.com/slidevjs/slidev) 是 [Anthony Fu](https://github.com/antfu) 大神主导开发的一个新项目，是为开发者打造的演示文稿工具。Slidev 旨在为开发者提供灵活性和交互性，通过使用他们已经熟悉的工具和技术，使他们的演示文稿更加有趣、更具表现力和吸引力。

> 与 NodePPT 一样，Slidev 需要 NodeJS 环境进行项目初始化和本地部署。由于是较新的项目，它与 NodePPT 相比，提供更为丰富的主题、组件和扩展能力。项目的代码采用 TypeScript 编写并基于 Vue3 来渲染应用。

### 声享

[声享](https://ppt.baomitu.com) 原本是最好的制作 Web 演讲的平台，由奇虎360奇舞团开发和运营，可惜因为一些不可抗力，目前已经停止服务。

## WebSlides.md 增加了什么？

1. 基于 Marked 集成了 Markdown 的能力，但仍然保留了完整的 HTML 的能力；并且支持 Markdown 代码在 HTML 中的缩进，以方便书写和阅读。

2. 通过集成 Prism 增加了对代码的支持，并且支持动态加载所有的[ Prism 官方主题](https://github.com/PrismJS/prism-themes/tree/master/themes)。

3. 通过集成 mermaid 支持流程图。

4. 通过集成 KaTex 支持数学公式。

[在线演示](https://codepen.io/akira-cn/pen/ZEvyKbG)
```html
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/webslides.md/dist/webslides.css">
<script src="https://cdn.jsdelivr.net/npm/webslides.md/dist/webslides.js"></script>  
<article id="webslides" codeTheme="prism-solarized-dark-atom">
  <section class="aligncenter">
    # 我是一级标题

    ## 我是二级标题

    - 我是列表

    <!--html-->
    <div>这里面是完整的<strong>HTML</strong>片段</div>
    <!--/html-->
  </section>
  <section class="bg-trans-dark">
    # 我是第二页

    ```js
    console.log('我是代码');
    ```
  </section>
  <section class="bg-black-blue">
    # 我是第三页

    $$ a^2 + b^2 = c^2 $$

    :@KaTex
      % \f is defined as #1f(#2) using the macro
      \f\relax{x} = \int_{-\infty}^\infty
          \f\hat\xi\,e^{2 \pi i \xi x}
          \,d\xi
  </section>
  <section class="bg-black-blue">
    # 我是第四页

    ```mermaid
    graph TD
    A[Client] --> B[Load Balancer]
    B --> C[Server01]
    B --> D[Server02]
    ```
    
    :@mermaid
      graph TD
      A[Client] --> B[Load Balancer]
      B --> C[Server01]
      B --> D[Server02]
  </section>
</article>
```

## 详细用法

可以看 [WebSlides 官网](https://webslides.tv) 教程，有详细的HTML和CSS说明，所有用法都保留了支持。

> 额外支持的详细用法，未完成，等待补充……

---


<h2 align="center">致谢</h2>

这些项目为 WebSlides.md 提供了底层能力或设计思路参考。

- [WebSlides](https://github.com/webslides/WebSlides)
- [marked](https://github.com/markedjs/marked)
- [prism](https://github.com/PrismJS/prism)
- [esbuild](https://github.com/evanw/esbuild)
- [mermaid](https://github.com/mermaid-js/mermaid)
- [simple-icons](https://github.com/simple-icons/simple-icons)
- [KaTex](https://github.com/KaTeX/KaTeX)
- [NodePPT](https://github.com/ksky521/nodeppt)
- [Slidev](https://github.com/slidevjs/slidev) 
