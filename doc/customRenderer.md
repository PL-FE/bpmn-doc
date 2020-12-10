# 自定义 Renderer

在 [自定义 Palette](./customPalette.md) 的基础上继续修改

案例代码在这里取：

[customRenderer](https://github.com/PL-FE/bpmn-doc/tree/customRenderer)

## 开始

由于画布中的图形为 `SVG`，不像 `Palette` 是使用 `HTML`，所以需要学习 [SVG 的基础知识](https://www.runoob.com/w3c/w3c-tutorial.html)

并且需要用到 `BPMN` 提供的一个 SVG 库 [tiny-svg](https://github.com/bpmn-io/tiny-svg)

#### 1. 创建相关文件

建立自定义渲染的相关文件，结构如下

```cmd
| -- renderer
    |-- CustomRenderer.js
    |-- index.js
```

这里比较方便直接去官方的 Demo 中取代码
[bpmn-js-example-custom-rendering](https://github.com/bpmn-io/bpmn-js-example-custom-rendering/blob/master/app/custom)

---

#### 2. 引用

引入刚刚创建的文件

```js
import customRenderer from './renderer'
```

```js
export default {
  // ...
  init() {
    this.bpmnModeler = new BpmnModeler({
      additionalModules: [customRenderer]
    })
    // ...
  }
}
```

你会发现自定义渲染已经成功了

[customRenderer_init](./img/customRenderer_init.png)

当然，我们需要的不仅如此

我们仔细看 `CustomRenderer.js` 的 `drawShape()` 方法，这个是渲染的核心方法， 返回一个 `shape`，即一个 `SVG`

```js
drawShape (parentNode, element) {
  const shape = this.bpmnRenderer.drawShape(parentNode, element);

  if (is(element, 'bpmn:Task')) { // 当元素类型是 bpmn:Task 时
    const rect = drawRect(parentNode, 100, 80, TASK_BORDER_RADIUS, '#52B415'); // 创建一个带绿色边框的矩形

    prependTo(rect, parentNode);

    svgRemove(shape);

    return shape;
  }

  // 其他不属于 bpmn:Task 的元素，如开始事件
  // 也创建一个 红色小矩形
  const rect = drawRect(parentNode, 30, 20, TASK_BORDER_RADIUS, '#cc0000');
 // 放置于左上角
  svgAttr(rect, {
    transform: 'translate(-20, -10)'
  });

  return shape;
}
```

#### 3. 修改 paletteEntries

我们主要对 `drawShape` 这个方法进行修改，期望能统一在一个文件中同时配置工具栏和自定义渲染

在 `paletteEntries.js` 增加一个 `drawShape` 功能，也就是将创建 SVG 的工作交给 `paletteEntries.js` 实现

paletteEntries.js

```js
export default {
  'create.start-event': createAction(
    'bpmn:StartEvent',
    'event',
    'bpmn-icon-start-event-none',
    'Create StartEvent'
  ),
  'create.task': createAction(
    'bpmn:Task',
    'activity',
    'bpmn-icon-task-custom', // 🙋‍♂️ 使用图片后，记得修改成自己的类名
    'Create Task',
    require('../img/task.png'),
    drawShape
  )
}

function createAction(type, group, className, title, imageUrl = '', drawShape) {
  function createListener(event, autoActivate, elementFactory, create) {
    var shape = elementFactory.createShape({ type })

    create.start(event, shape)
  }

  const config = {
    type, // 📌 渲染的时候需要判断
    group: group,
    className: className,
    title: title,
    drawShape: drawShape, // 📌
    action: {
      dragstart: createListener,
      click: createListener
    }
  }
  if (imageUrl) {
    assign(config, {
      imageUrl
    })
  }
  if (drawShape) {
    assign(config, {
      drawShape
    })
  }

  return config
}

// 这里将 CustomRenderer.js 渲染的方法搬到 paletteEntries
function drawShape(parentNode, element, bpmnRenderer) {
  const shape = bpmnRenderer.drawShape(parentNode, element)

  if (is(element, 'bpmn:Task')) {
    const height = 80
    const width = 100
    // 真实元素的宽高
    element.width = width
    element.height = height

    // 显示元素的宽高与真实的宽高需要一致
    const rect = drawRect(
      parentNode,
      width,
      height,
      TASK_BORDER_RADIUS,
      '#52B415'
    )

    prependTo(rect, parentNode)

    svgRemove(shape)

    return shape
  }

  const rect = drawRect(parentNode, 30, 20, TASK_BORDER_RADIUS, '#cc0000')

  svgAttr(rect, {
    transform: 'translate(-20, -10)'
  })

  return shape
}
```

#### 4. 修改 CustomRenderer

注入需要的数据

```js
CustomRenderer.$inject = ['eventBus', 'bpmnRenderer', 'config.paletteEntries']

 constructor(eventBus, bpmnRenderer, paletteEntries) {
  //  ...
    this.paletteEntries = paletteEntries;
  }

  drawShape (parentNode, element) {
  const paletteEntries = this.paletteEntries
  // 通过 type 找到对应的配置
  const shape = find(paletteEntries, (entry) => {
    return is(element, entry.type)
  })
  // 如果传入自定义方法，则回调该方法
  if (shape && shape.drawShape instanceof Function) {
    return shape.drawShape(parentNode, element, this.bpmnRenderer)
  }
  // 否则调用默认渲染的方法
  return this.bpmnRenderer.drawShape(parentNode, element)
}
```

## 最后

自定义渲染已经完成，更多的是思考如何绘制 SVG ,给每个不同的元素不同的 `drawShape`

下面开始如何 [自定义 contextPad](./customContextPad.md)

完整目录： 👉 [点击这里](https://github.com/PL-FE/bpmn-doc/blob/main/README.md)

### 相关

对于自定义渲染有较多业务场景，如： 点击`SVG 元素`下的 `svg`，一个很有用的 `CSS 样式` [pointer-events](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events) （`穿透` ）可以帮助你。

可能对你有帮助的官方资源：

- [bpmn-js-example-custom-rendering](https://github.com/bpmn-io/bpmn-js-example-custom-rendering/blob/master/app/custom)
- [bpmn-js-example-custom-elements ](https://github.com/bpmn-io/bpmn-js-example-custom-elements)
