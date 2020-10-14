# 自定义 Palette

由于 `bpmn-js` 构建在两个重要的库之上:`diagram-js` 和 `bpmn-moddle`

`diagram-js` 是一个工具箱，用于在 web 上显示和修改图表。
`diagram-js` 使用`依赖注入(DI)`来连接和发现图组件。
为扩展 Bpmn 提供了很大方便，包括传递 元素信息、模型信息、Palette 容器信息等，都可以直接在 `new Modeler(option)` 中的 `option` 传递

---

## 思路

主要思路是将源码中的 `Palette` 相关源码拷贝出来，进行自定义修改后，通过 `additionalModules` 再传进去

源码在手，为所欲为

可自定义工具栏的 `布局、位置、大小颜色、指定工具栏的容器等`

---

## 开始

#### 1. 入口

```js
import entries from '@/views/bpmn/config/paletteEntries'
import customPalette from '@/views/bpmn/customBpmn/palette'

const canvas = this.$refs.canvas
const palette = this.$refs.palette
// 建模
this.bpmnModeler = new BpmnModeler({
  // 主要容器
  container: canvas,
  // 工具栏容器
  paletteContainer: palette,
  // 工具栏配置及实现自定义渲染方法
  paletteEntries: entries,
  additionalModules: [
    // 自定义工具栏
    customPalette,
    {
      // 去掉左侧默认工具栏
      paletteProvider: ['value', '']
    }
  ]
})
```

#### 2. CustomPaletteProvider 接收

> `Provider` 是 `提供器;医疗服务提供者;属性;提供者;提供程序` 的意思，是给 `Palette` 提供数据的

```js
PaletteProvider.$inject = [
  'config.paletteEntries'
  // 其他代码...
```

通过注入 `$inject` 拿到传入的工具条目 `paletteEntries`

```js
PaletteProvider.prototype.getPaletteEntries = function(element) {
  return this._entries
}
```

重写`PaletteProvider.prototype.getPaletteEntries`

#### 3. CustomPalette 实现样式

首先看一下注入：

```js
Palette.$inject = [
  // 创建元素需要
  'eventBus',
  'canvas',
  'elementFactory',
  'create',
  // 创建元素和指定工具栏容器需要
  'config.paletteContainer', // 对应 new BpmnModeler 的 paletteContainer: palette,
  'config.paletteEntries' // 对应 new BpmnModeler 的 paletteEntries: entries,
]
```

有了上面的数据，下面开始使用

```js
// 工具栏样式主要由这两个方法实现，工具栏是 `HTML` 实现的，我们可以直接修改源码
// 目前只支持 img ，可以自己扩展支持 SVG 等等
Palette.prototype._update()
```

修改完了，不要忘记修改样式，尤其是修改了默认工具栏类名，需要引入 `diagram-js.css` ，修改成想同的类名

#### 4. CustomPalette 实现拖拽生成元素

实现上面三点可以成功展示一个全新的工具栏

那么拖拽生成元素，怎么实现呢？

一开始传入了 `paletteEntries`，作为生成工具栏的条目， 其中也传入了生成元素的方法，只需要调用对应的方法即可。

关键代码：

```js
// 初始化的时候绑定一些事件
domDelegate.bind(container, ELEMENT_SELECTOR, 'click', function(event) {
  // 其他代码...
  self.trigger('click', event)
})

domDelegate.bind(container, ENTRY_SELECTOR, 'dragstart', function(event) {
  self.trigger('dragstart', event)
})

Palette.prototype.trigger = function(action, event, autoActivate) {
  // 其他代码...
  var elementFactory = this._elementFactory
  var create = this._create
  handler = entry.action
  var originalEvent
  if (isFunction(handler)) {
    if (action === 'click') {
      // 调用 click: click自定义渲染方法
      handler(originalEvent, autoActivate, elementFactory, create)
    }
  } else {
    if (handler[action]) {
      // 调用  dragstart: dragstart自定义渲染方法
      handler[action](originalEvent, autoActivate, elementFactory, create)
    }
  }

  // silence other actions
  event.preventDefault()
}
```

## 最后

你将拥有一个全新的工具栏。
可能对你有帮助的官方资源：
- [bpmn-js-example-custom-elements ](https://github.com/bpmn-io/bpmn-js-example-custom-elements)
