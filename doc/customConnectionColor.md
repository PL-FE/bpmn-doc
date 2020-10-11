# 自定义连线和箭头的颜色

`NavigatedViewer`、`Viewer`、`Modeler`三种模式都适用
配合自定义渲染加上不同的类名，能够达到每条线有不一样的颜色
或者遍历链路获取节点的颜色，与节点保持相同颜色

---

## 思路

主要 通过 css 改变颜色

1. 引入 css

```css
.djs-connection {
  path {
    stroke: blue !important;
    marker-end: url(#sequenceflow-arrow-normal) !important;
  }
}
```

注意 `#sequenceflow-arrow-normal` 为箭头下面要创建的箭头的 id

2. 创建自定义箭头

```js
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'

 initArrow () {
      const marker = svgCreate('marker')

      svgAttr(marker, {
        id: '#sequenceflow-arrow-normal',
        viewBox: '0 0 20 20',
        refX: '11',
        refY: '10',
        markerWidth: '10',
        markerHeight: '10',
        orient: 'auto'
      })

      const path = svgCreate('path')

      svgAttr(path, {
        d: 'M 1 5 L 11 10 L 1 15 Z',
        style:
          ' stroke-width: 1px; stroke-linecap: round; stroke-dasharray: 10000, 1; '
      })

      const defs = domQuery('defs')
      svgAppend(marker, path)
      svgAppend(defs, marker)
    },
```

---

## 最后

具体可以尝试运行一下项目或者[在线预览](http://vue.pengliang.online/)
