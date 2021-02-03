# addFeatures 为 Viewer 添加一些功能

也许你只是需要只读，但是希望保留放大缩小以及调整位置。
使用 `NavigatedViewer` 和 `Modeler` 显得不是那么灵活，因为需要禁掉多余的功能。

```js
new BpmnModeler({
  additionalModules: [
    {
      // 禁用左侧默认工具栏
      paletteProvider: ['value', '']// 去不干净，还是默认生成空白 dom
      // // 禁用滚轮滚动
      zoomScroll: ['value', ''],
      // // 禁止拖动线
      bendpoints: ['value', ''],
      // // 禁止点击节点出现contextPad
      contextPadProvider: ['value', ''],
      // // 禁止双击节点出现label编辑框
      labelEditingProvider: ['value', '']
    }
  ]
})
```

这样实际显得很僵硬，我们可以使用最少功能的 `Viewer`，需要什么功能我们通过 `additionalModules` 为他增加就好了。

事实上 [Modeler](https://github.com/bpmn-io/bpmn-js/blob/develop/lib/Modeler.js) 就是这么做的。

可以看到 [BaseModeler](https://github.com/bpmn-io/bpmn-js/blob/develop/lib/BaseModeler.js) 这一句

```js
inherits(BaseModeler, BaseViewer)
```

所以我们就拿 `Modeler` 的功能选择性的加到 `Viewer` 就好了。相当于我们自定义了一个全新的 构造器。

---

## 准备

我们先来看看 `Modeler` 有哪些模块

```js
import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import TouchModule from 'diagram-js/lib/navigation/touch'
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll'

import AlignElementsModule from 'diagram-js/lib/features/align-elements'
import AutoPlaceModule from './features/auto-place'
import AutoResizeModule from './features/auto-resize'
import AutoScrollModule from 'diagram-js/lib/features/auto-scroll'
import BendpointsModule from 'diagram-js/lib/features/bendpoints'
import ConnectModule from 'diagram-js/lib/features/connect'
import ConnectionPreviewModule from 'diagram-js/lib/features/connection-preview'
import ContextPadModule from './features/context-pad'
import CopyPasteModule from './features/copy-paste'
import CreateModule from 'diagram-js/lib/features/create'
import DistributeElementsModule from './features/distribute-elements'
import EditorActionsModule from './features/editor-actions'
import GridSnappingModule from './features/grid-snapping'
import InteractionEventsModule from './features/interaction-events'
import KeyboardModule from './features/keyboard'
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection'
import LabelEditingModule from './features/label-editing'
import ModelingModule from './features/modeling'
import MoveModule from 'diagram-js/lib/features/move'
import PaletteModule from './features/palette'
import ReplacePreviewModule from './features/replace-preview'
import ResizeModule from 'diagram-js/lib/features/resize'
import SnappingModule from './features/snapping'
import SearchModule from './features/search'
```

比如我们需要使用 `Viewer` 实现

- 通过 `modeling.setColor` 设置元素和线的颜色（需要引入 `ModelingModule`）
- 拖动元素（需要引入 `MoveModule`）
- 拖动画布（需要引入 `MoveCanvasModule`）
- 禁止鼠标滑轮上下滚动影响画布上下移动（需要引入 `ZoomScrollModule`，并重写 `scroll` 方法）

## 开始

除了需要重写功能的模块，其他的都可以直接引入

```js
import Viewer from 'bpmn-js/lib/Viewer'
import MoveModule from 'diagram-js/lib/features/move'
import ModelingModule from 'bpmn-js/lib/features/modeling'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'

const bpmnViewer = new Viewer({
  additionalModules: [
    MoveModule, // 可以调整元素
    ModelingModule, // 基础工具 MoveModule、SetColor 等依赖于此
    MoveCanvasModule // 移动整个画布
  ]
})
```

#### 编辑某个模块

新建 zoomScroll.js

```js
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll/ZoomScroll'

ZoomScrollModule.prototype.scroll = () => {} // 只要原型链上这个方法为空即可，方法有很多。

export default {
  __init__: ['zoomScroll'],
  zoomScroll: ['type', ZoomScrollModule]
}
```

然后重新将模块注入

```js
import Viewer from 'bpmn-js/lib/Viewer'
import MoveModule from 'diagram-js/lib/features/move'
import ModelingModule from 'bpmn-js/lib/features/modeling'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
import zoomScroll from './zoomScroll.js' // 📌注意是使用自己定义过的哦~

const bpmnViewer = new Viewer({
  additionalModules: [
    MoveModule, // 可以调整元素
    ModelingModule, // 基础工具 MoveModule、SetColor 等依赖于此
    MoveCanvasModule, // 移动整个画布
    zoomScroll // 放大缩小
  ]
})
```

## 最后

一切大功告成，你能够为 `Viewer` 更自由的添加功能。

还有其他的功能， `Modeler` 有的 `Viewer` 也会有。

> 最终 `Viewer` 慢慢变成 `Modeler`

---

### 相关

可能对你有帮助的官方资源：

- [Modeler](https://github.com/bpmn-io/bpmn-js/blob/develop/lib/Modeler.js)

- 完整目录： 👉 [点击这里](../README.md)
