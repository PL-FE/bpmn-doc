# 自定义 Palette

[了解 BPMN 内部](quickIntroduction.md)后，对一些模块以及它们之间的配合应该有了一定的概念，下面开始动手尝试修改一下 `palette` 工具栏

---

## 开始

你将实现

- 可指定工具栏容器
- 自定义工具栏样式、布局
- 通过配置生成工具栏

注意：标记 🎯 的地方为重点

#### 1. 创建相关文件

**目的： 准备好要修改的模块代码**

建立自定义工具栏的相关文件，结构如下

```cmd
| -- palette
    |-- CustomPaletteProvider.js
    |-- CustomPalette.js
    |-- index.js
```

PaletteProvider 顾名思义 `”调色板提供程序“`，也就是将工具栏的数据告诉 `Palette`，由 `Palette` 构造工具栏。

所以我们需要先将代码准备好，然后去修改它：

- 前往 [bpmn-js](https://github.com/bpmn-io/bpmn-js) 将源码 [PaletteProvider.js ](https://github.com/bpmn-io/bpmn-js/blob/develop/lib/features/palette/PaletteProvider.js) 拷贝至 CustomPaletteProvider.js
- 前往 [diagram-js](https://github.com/bpmn-io/diagram-js) 将源码 [Palette.js ](https://github.com/bpmn-io/diagram-js/blob/develop/lib/features/palette/Palette.js) 拷贝至 CustomPalette.js
- 参考 `PaletteProvider.js`和 `Palette.js` 对应的 `index.js`，将刚刚创建的 `index.js`，修改成如下

```js
import customPalette from './CustomPalette'
import PaletteProvider from './CustomPaletteProvider'
// 除了引进的模块的名字可以修改，其他的不建议修改，会报错
export default {
  __depends__: [customPalette], // 依赖于 customPalette 这个模块
  __init__: ['customPaletteProvider'], // 调用 customPaletteProvider 来初始化
  customPaletteProvider: ['type', PaletteProvider]
}
```

到此三个文件已经准备就绪了，下面我们来修改它。

---

#### 2. 修改数据的提供者 PaletteProvider

**目的：实现工具栏数据的传递**

```js
// 注意： 可以通过 config这个对象拿到 实例化 Modeler 的时候的参数
// 所以这里通过注入 congif.paletteEntries 拿到 paletteEntries 的值
// 后续会介绍如何传入
PaletteProvider.$inject = ['config.paletteEntries', 'customPalette']

export default function PaletteProvider(paletteEntries, customPalette) {
  this._entries = paletteEntries

  customPalette.registerProvider(this)
}

PaletteProvider.prototype.getPaletteEntries = function(element) {
  return this._entries // 🎯 返回工具栏数据
}
```

目的达成，下一步是修改 `CustomPalette.js`

#### 3. 修改工具栏构造者 CustomPalette

**目的：**

- 自定义指定容器
- 自定义工具栏样式、布局
- 自定义生成元素的方法

首先老规则，修改注入需要用的数据

```js
Palette.$inject = [
  'eventBus',
  'canvas',
  // ---------- 自定义区域 ------------
  'elementFactory',
  'create',
  'config.paletteContainer',
  'config.paletteEntries'
  // ---------- 自定义区域 ------------
]
```

默认只注入了两个，其余根据需要来增加。
下面将注入的数据赋值

```js
function Palette(
  eventBus,
  canvas,
  elementFactory,
  create,
  paletteContainer,
  paletteEntries
) {
  this._eventBus = eventBus
  this._canvas = canvas
  this._entries = paletteEntries // 传入的工具栏数据
  this._paletteContainer = paletteContainer // 传入的工具栏容器
  this._elementFactory = elementFactory
  this._create = create
  // ...
}
```

然后就可以在这个函数中数据注入的数据了，
注意顺序别错了哦~

下面开始开始完成目标一 `自定义指定容器`

##### 3.1 自定义指定容器

```js
Palette.prototype._init = function() {
  // ...

  var parentContainer = this._getParentContainer()

  var container = (this._container = domify(Palette.HTML_MARKUP))

  parentContainer.appendChild(container)

  // ...
}

Palette.HTML_MARKUP =
  '<div class="djs-palette">' +
  '<div class="djs-palette-entries"></div>' +
  '<div class="djs-palette-toggle"></div>' +
  '</div>'
```

默认是找到 `Palette.HTML_MARKUP` 这个 dom 元素，找不到就生成一模一样的
，下面我们修改成指向我们传入的

```js
Palette.prototype._init = function() {
  var parentContainer = this._getParentContainer()

  // ---------- 自定义区域 ------------

  // 🎯 获取传入的工具栏容器
  var container = (this._container = this._paletteContainer)
  // 未找到 使用默认
  if (!container) {
    container = this._container = domify(Palette.HTML_MARKUP)
  } else {
    // 为传入的工具栏容器 创建子元素
    // 也就是构造得和 HTML_MARKUP 差不多的样子就 ok 了
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

  // ---------- 自定义区域 ------------
  parentContainer.appendChild(container)
}
```

并且顺便修改了默认类名的，你也可以写上你喜欢的类名，这里我使用了 `custom-` 作为前缀

djs-palette => custom-palette
djs-palette-entries => custom-palette-entries
djs-palette-toggle => custom-palette-toggle

所以 `bpmn` 的样式会失效，后续需要我们引入其样式，修改 css 的选择器，修改成我们目前的类名，后面会说到。

##### 3.2 自定义工具栏样式、布局

```js
Palette.prototype._update = function() {
  // 这里稍稍改一下类名即可 已经将 `djs-palette-entries => custom-palette-entries`
  var entriesContainer = domQuery('.custom-palette-entries', this._container),
    entries = (this._entries = this.getEntries())

  // 下面便是针对每一项工具元素的修改，包括分组、分割线、属性等，这里不再展开
  // 详情可以运行此项目观察此文件
}
```

##### 3.3 自定义生成元素的方法

到此，一个数据以及布局已经准备完毕，接下来该实现它的`拖动或者点击生成元素`的功能了

```js
Palette.prototype._init = function() {
  domDelegate.bind(container, ELEMENT_SELECTOR, 'click', function(event) {
    self.trigger('click', event)
  })

  domDelegate.bind(container, ENTRY_SELECTOR, 'dragstart', function(event) {
    self.trigger('dragstart', event)
  })
}

Palette.prototype.trigger = function(action, event, autoActivate) {
  var entries = this._entries,
    entry,
    handler,
    originalEvent,
    button = event.delegateTarget || event.target

  // ---------- 自定义区域 ------------
  // 创建元素的方法需要这两个构造器
  var elementFactory = this._elementFactory,
    create = this._create
  // ---------- 自定义区域 ------------

  handler = entry.action

  originalEvent = event.originalEvent || event

  // ---------- 自定义区域 ------------
  // simple action (via callback function)
  if (isFunction(handler)) {
    if (action === 'click') {
      handler(originalEvent, autoActivate, elementFactory, create) // 🎯 这里便是回调 action.click 事件
    }
  } else {
    if (handler[action]) {
      handler[action](originalEvent, autoActivate, elementFactory, create) // 🎯 这里便是回调 action.dragstart 或者其他事件
    }
  }
  // ---------- 自定义区域 ------------

  event.preventDefault()
}
```

在 init 的时候绑定了两个事件，当我们点击或在拖动工具栏的时候触发，从而可以生成元素。

`CustomPalette.js` 至此基本完成了。

#### 4. 配置工具栏

在合适的地方新建 `paletteEntries.js`,这里是在同级目录下的 `config` 文件夹新建的

`paletteEntries.js` 的目的是返回一个包含工具数据的集合（对象或数组）
这里简单理解两个工具元素，`开始和结束`

```js
export default {
  'create.task': {
    type: 'bpmn:Task', // 决定元素类型
    group: 'activity', // 3.2 自定义工具栏样式、布局 有使用到，根据这个字段来进行分组
    className: 'custom-icon-task', // 3.2 自定义工具栏样式、布局 有使用到，根据这个字段来为对应的 dom 添加类名
    title: 'Create Task', //  3.2 有用到，title 属性
    action: {
      // 3.3 使用，使生成元素
      dragstart: createListener,
      click: createListener
    }
  }
}

// 还记得 CustomPalette.js 吗？便是这里回调 createListener 函数
// if (action === 'click') {
// 		handler(originalEvent, autoActivate, elementFactory, create) // 🎯 这里便是回调 action.click 事件
// 	}
function createListener(event, autoActivate, elementFactory, create) {
  create.start(event, shape)
}
```

#### 5. 使用

引入依赖

```js
import BpmnModeler from 'bpmn-js/lib/Modeler'
import customPalette from './customBpmn/palette'
import entries from './config/paletteEntries'
import { xmlStr } from './xmlData' // 这里是直接引用了xml字符串
```

```js
export default {
  // ...
  init() {
    // 去除默认工具栏
    const modules = BpmnModeler.prototype._modules
    const index = modules.findIndex(it => it.paletteProvider)
    modules.splice(index, 1)

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
          // 禁用左侧默认工具栏
          // paletteProvider: ['value', '']// 去不干净，还是 会生成 dom 元素
        }
      ]
    })
    // ...
  }
}
```

## 最后

由于修改了工具栏、元素的类名，所以在页面上还不能展示出来们，这里需要我们引入官方的 [diagram-js.css](https://github.com/bpmn-io/diagram-js/blob/develop/assets/diagram-js.css)

这里在全局引用，你可以选择合适的位置引用。

下面是部分样式代码，完整 css 代码 👉 [diagram-js.css](https://github.com/bpmn-io/diagram-js/blob/develop/assets/diagram-js.css)

```css
/**
 * palette
 */

.djs-palette {
  position: absolute;
  left: 20px;
  top: 20px;

  box-sizing: border-box;
  width: 48px;
}

.djs-palette .djs-palette-toggle {
  cursor: pointer;
}

.djs-palette:not(.open) .djs-palette-entries {
  display: none;
}

/* ... */
```

可以看到还存在很多 `djs-palette`、 `.djs-palette-toggle`、`djs-palette-entries` 等，

这些类名在我们自定义的时候已经修改了， 所以我们可以全局替换成

`custom-palette`、 `.custom-palette-toggle`、`custom-palette-entries` 等。

在同文件夹下，新建一个专门修改 `bpmn` 样式的样式文件，尽量不动官方的 css，这里我取名为 `bpmn.less`

给唯一的工具栏元素加个样子吧

```css
// 任务 Task
.custom-icon-task {
  width: 60px;
  height: 40px;
  border: 2px solid #36bbf6;
  border-radius: 10px;
  background-color: #72d3ff;
}
```

注意引用顺序

```js
import '@/assets/css/diagram-js.less'
import '@/assets/css/bpmn.less' // 这里可以覆盖官方的样式
```

一切大功告成，你将拥有一个全新的工具栏。

突然，你发现通过工具栏生成的元素还保持着 `最初` 的样子。

无需担心，因为我们还没告诉 `bpmn` 该怎么渲染它

---

### 相关

自定义 palette 相关代码

- [src\views\bpmn\index.vue](../src/views/bpmn/index.vue)
- [src\views\bpmn\customBpmn\palette](../src/views/bpmn/customBpmn/palette)
- [src\main.js](../src/main.js)
- [src\assets\css](../src/assets/css)

可能对你有帮助的官方资源：

- [bpmn-js-example-custom-elements ](https://github.com/bpmn-io/bpmn-js-example-custom-elements)
