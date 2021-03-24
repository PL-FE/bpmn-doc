# 指定 Palette 容器

开始之前可以[了解一下自定义 Palette](./customPalette.md)

## 开始

1. 去除默认工具栏

```js
 // 去除默认工具栏
      const modules = BpmnModeler.prototype._modules
      const index = modules.findIndex(it => it.paletteProvider)
      modules.splice(index, 1)

      this.bpmnModeler = new BpmnModeler({..})
```

2. 声明容器

```html
<div ref="palette"></div>

<div class="canvas" ref="canvas"></div>
```

```js
const canvas = this.$refs.canvas
const palette = this.$refs.palette
// 建模
this.bpmnModeler = new BpmnModeler({
  // 主要容器
  container: canvas,
  // 工具栏容器
  paletteContainer: palette

  // ...
})
```

3. 让 bpmn 使用指定的容器

[CustomPalette.js](https://github.com/PL-FE/bpmn-doc/blob/dev/src/views/bpmn/customBpmn/palette/CustomPalette.js)

```js
// 注入需要的数据，其中有指定的容器
Palette.$inject = [
  'eventBus',
  'canvas',
  'elementFactory',
  'create',
  'config.paletteContainer', // canvas 容器
  'config.paletteEntries' // palette 容器
]

// 拿到容器
function Palette(
  // ...
  paletteContainer,
  paletteEntries
) {
  this._entries = paletteEntries
  this._paletteContainer = paletteContainer
  // ..
}

// 使用指定的容器
Palette.prototype._init = function() {
  // ...
  // var parentContainer = this._getParentContainer()
  // 获取传入的工具栏容器
  var container = (this._container = this._paletteContainer)
  // 未找到 使用默认
  if (!container) {
    container = this._container = domify(Palette.HTML_MARKUP)
  } else {
    // 为传入的工具栏容器 创建子元素
    addClasses(container, 'custom-palette')
    const entries = domQuery('.custom-palette-entries', container)
    const toggle = domQuery('.custom-palette-toggle', container)

    if (!entries) {
      container.appendChild(
        domify('<div class="custom-palette-entries"></div>')
      )
    }
    if (!toggle) {
      container.appendChild(domify('<div class="custom-palette-toggle"></div>'))
    }
  }
  // parentContainer.appendChild(container) // 这句会将 palette 加入 canvas
  // ...
}

Palette.HTML_MARKUP =
  '<div class="custom-palette">' +
  '<div class="custom-palette-entries"></div>' +
  '<div class="custom-palette-toggle"></div>' +
  '</div>'
```

其中容器的样式随便写，我修改成了 `custom-palette` 这个类名，需要自己去修改 `css`
这里我为了简单，直接找到 [源码 css](https://github.com/bpmn-io/diagram-js/blob/develop/assets/diagram-js.css) 直接全局替换 成我的类名[修改后的 diagram-js.less](https://github.com/PL-FE/bpmn-doc/blob/dev/src/assets/css/diagram-js.less)

强烈建议拿官方源码直接改 [Palette.js](https://github.com/bpmn-io/diagram-js/blob/develop/lib/features/palette/Palette.js)

以下是源码，是短短的两句，可以对比一下

```js
Palette.prototype._init = function() {
  // ...

  var container = (this._container = domify(Palette.HTML_MARKUP))
  parentContainer.appendChild(container)

  // ...
}
```

## 最后

代码 [CustomPalette.js](https://github.com/PL-FE/bpmn-doc/blob/dev/src/views/bpmn/customBpmn/palette/CustomPalette.js)

建议直接取官方代码修改，安全又保险！:[Palette.js](https://github.com/bpmn-io/diagram-js/blob/develop/lib/features/palette/Palette.js)

完整目录： 👉 [点击这里](https://github.com/PL-FE/bpmn-doc/blob/main/README.md)
