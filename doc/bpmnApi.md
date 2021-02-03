# bpmnApi

本篇 API 根据对应源码总结而得，其中部分方法待验证。

---

## 开始

在线预览 bpmn-modeling-api-cn

网址 1 ： [https://pl-fe.github.io/bpmn-modeling-api-cn.github.io/](https://pl-fe.github.io/bpmn-modeling-api-cn.github.io/)

网址 2 ： [http://bpmn-doc-example.pengliang.online/modeling-api/](http://bpmn-doc-example.pengliang.online/modeling-api/)

官方 bpmn-modeling-api

[https://github.com/bpmn-io/bpmn-js-examples/tree/master/modeling-api](https://github.com/bpmn-io/bpmn-js-examples/tree/master/modeling-api)

常用服务:

- [Canvas](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/Canvas.js):提供了添加和删除图形元素的 api;处理元素生命周期，并提供用于缩放和滚动的 api。
- [BpmnFactory](https://github.com/bpmn-io/bpmn-js/blob/develop/lib/features/modeling/BpmnFactory.js): 根据 bpmn-js 的内部数据模型`创建业务对象`的工厂
- [ElementFactory](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementFactory.js): 根据 bpmn-js 的内部数据模型`创建形状和连接`的工厂。
- [ElementRegistry](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementRegistry.js): 知道添加到图中的所有元素，并提供 api 来根据 id `检索元素及其图形表示`。
- [Modeling](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/modeling/Modeling.js): 提供用于`更新`画布上的元素`(移动、删除)`的 api
- GraphicsFactory: 负责创建图形和连接的图形表示。实际的外观是由渲染器定义的，即绘制模块中的 DefaultRenderer。

### 项目中常用

基础 API 建议先看上面的 [网址](http://bpmn-doc-example.pengliang.online/modeling-api/)

- 还原

```js
bpmnModeler.get('commandStack').redo()
```

- 撤销

```js
bpmnModeler.get('commandStack').undo()
```

- 设置元素颜色

```js
const modeling = this.bpmnModeler.get('modeling')
modeling.setColor(element, {
  fill: '#fff',
  stroke: '#fff'
})
```

- 对齐

```js
// {Array} elements
// {String} position:  left/top/right/bottom/cneter/middle
bpmnModeler.get('alignElements').trigger(elements, position)
```

- 水平垂直对齐

```js
// {Array} elements
// {String} axis:  /horizontal/vertical
bpmnModeler.get('distributeElements').trigger(elements, axis)
```

- 缩放

```js
// {Number} radio : 1.0
bpmnModeler.get('canvas').zoom(radio)
```

- 更新元素属性

```js
const modeling = bpmnModeler.get('modeling')
modeling.updateProperties(element, {
  key: value
})
```

- 保存 XML

```js
bpmnModeler.saveXML({ format: true })
```

- 保存为 SVG

```js
bpmnModeler.saveSVG().then(result => {
  const { svg } = result
  const svgBlob = new Blob([svg], {
    type: 'image/svg+xml'
  })
  const downloadLink = document.createElement('a')
  downloadLink.download = `bpmn-${+new Date()}.SVG`
  downloadLink.innerHTML = 'Get BPMN SVG'
  downloadLink.href = window.URL.createObjectURL(svgBlob)
  downloadLink.onclick = function(event) {
    document.body.removeChild(event.target)
  }
  downloadLink.style.visibility = 'hidden'
  document.body.appendChild(downloadLink)
  downloadLink.click()
})
```

- 导入 BOMN 文件

```js
// 事先拿到文件流 file
const reader = new FileReader()
reader.readAsText(file)
reader.onload = function() {
  xml = this.result
  // 这里可以拿到 xml
}
```

- 穿透

对于自定义渲染有较多业务场景，如： 点击`SVG 元素`下的 `svg`，一个很有用的 `CSS` [pointer-events](https://developer.mozilla.org/zh-CN/docs/Web/CSS/pointer-events) （`穿透` ）可以帮助你。

- 手动移动元素

```js
/**
 * @param {Array<djs.mode.Base>} shapes  目标 shape 数组
 * @param {Point} delta {x:0, y: 10} 这里是相对位置
 * @param {djs.model.Base} [target] 这里一般是根元素 根元素 <Root>
 * @param {Object} [hints] {attach: false, oldParent: 根元素 <Root>， primaryShape: 鼠标拖动的 shape }
 * @param {boolean} [hints.attach=false]
 */
Modeling.prototype.moveElements = function(shapes, delta, target, hints) {}
```

### Index

建议使用<kbd>Ctrl</kbd> + <kbd>F</kbd> 或  <kbd>command</kbd> + <kbd>F</kbd>搜索

- [canvas.getDefaultLayer](#canvasgetDefaultLayer)
- [canvas.getLayer](#canvasgetLayer)
- [canvas.getContainer](#canvasgetContainer)
- [canvas.addMarker](#canvasaddMarker)
- [canvas.removeMarker](#canvasremoveMarker)
- [canvas.hasMarker](#canvashasMarker)
- [canvas.toggleMarker](#canvastoggleMarker)
- [canvas.setRootElement](#canvassetRootElement)
- [canvas.addShape](#canvasaddShape)
- [canvas.addConnection](#canvasaddConnection)
- [canvas.removeShape](#canvasremoveShape)
- [canvas.removeConnection](#canvasremoveConnection)
- [canvas.getGraphics](#canvasgetGraphics)
- [canvas.viewbox](#canvasviewbox)
- [canvas.getGraphics](#canvasgetGraphics)
- [canvas.scroll](#canvasscroll)
- [canvas.zoom](#canvaszoom)
- [canvas.getSize](#canvasgetSize)
- [canvas.getAbsoluteBBox](#canvasgetAbsoluteBBox)
- [canvas.getAbsoluteBBox](#canvasgetAbsoluteBBox)

* [bpmnFactory.create](#bpmnFactorycreate)

- [elementFactory.createRoot](#elementFactorycreateRoot)
- [elementFactory.createLabel](#elementFactorycreateLabel)
- [elementFactory.createShape](#elementFactorycreateShape)
- [elementFactory.createConnection](#elementFactorycreateConnection)

* [elementRegistry.add](#elementRegistryadd)
* [elementRegistry.remove](#elementRegistryremove)
* [elementRegistry.get](#elementRegistryget)
* [elementRegistry.getAll](#elementRegistrygetAll)
* [elementRegistry.updateId](#elementRegistryupdateId)
* [elementRegistry.filter](#elementRegistryfilter)
* [elementRegistry.forEach](#elementRegistryforEach)
* [elementRegistry.getGraphics](#elementRegistrygetGraphics)

- [modeling.updateProperties](#modelingupdateProperties)
- [modeling.createShape](#modelingcreateShape)
- [modeling.appendShape](#modelingappendShape)
- [modeling.createElements](#modelingmore)
- [modeling.appendShape](#modelingmore)
- [modeling.createLabel](#modelingmore)
- [modeling.removeElements](#modelingmore)
- [modeling.removeShape](#modelingmore)
- [modeling.removeConnection](#modelingmore)
- [modeling.alignElements](#modelingmore)
- [modeling.resizeShape](#modelingmore)
- [modeling.createSpace](#modelingmore)
- [modeling.updateWaypoints](#modelingmore)
- [modeling.reconnect](#modelingmore)
- [modeling.reconnectStart](#modelingmore)
- [modeling.reconnectEnd](#modelingmore)
- [modeling.connect](#modelingmore)
- [modeling.toggleCollapse](#modelingmore)

### Canvas

```js
canvas = modeler.get('canvas')
```

#### canvas.getDefaultLayer

```js
/**
 * Returns the default layer on which
 * all elements are drawn.
 *
 * @returns {SVGElement}
 */
canvas.getDefaultLayer()
```

#### canvas.getLayer

```js
/**
 * Returns a layer that is used to draw elements
 * or annotations on it.
 *
 * Non-existing layers retrieved through this method
 * will be created. During creation, the optional index
 * may be used to create layers below or above existing layers.
 * A layer with a certain index is always created above all
 * existing layers with the same index.
 *
 * @param {string} name
 * @param {number} index
 *
 * @returns {SVGElement}
 */
canvas.getLayer(name, index)
```

#### canvas.getContainer

```js
/**
 * Returns the html element that encloses the
 * drawing canvas.
 *
 * @return {DOMNode}
 */
canvas.getContainer()
```

#### canvas.addMarker

```js
/**
 * Adds a marker to an element (basically a css class).
 *
 * Fires the element.marker.update event, making it possible to
 * integrate extension into the marker life-cycle, too.
 *
 * @example
 * canvas.addMarker('foo', 'some-marker');
 *
 * var fooGfx = canvas.getGraphics('foo');
 *
 * fooGfx; // <g class="... some-marker"> ... </g>
 *
 * @param {string|djs.model.Base} element
 * @param {string} marker
 */
canvas.addMarker(element, marker)
```

#### canvas.removeMarker

```js
/**
 * Remove a marker from an element.
 *
 * Fires the element.marker.update event, making it possible to
 * integrate extension into the marker life-cycle, too.
 *
 * @param  {string|djs.model.Base} element
 * @param  {string} marker
 */
canvas.removeMarker(element, marker)
```

#### canvas.hasMarker

```js
/**
 * Check the existence of a marker on element.
 *
 * @param  {string|djs.model.Base} element
 * @param  {string} marker
 */
canvas.hasMarker(element, marker)
```

#### canvas.toggleMarker

```js
/**
 * Toggles a marker on an element.
 *
 * Fires the element.marker.update event, making it possible to
 * integrate extension into the marker life-cycle, too.
 *
 * @param  {string|djs.model.Base} element
 * @param  {string} marker
 */
canvas.toggleMarker(element, marker)
```

#### canvas.setRootElement

```js
/**
 * Sets a given element as the new root element for the canvas
 * and returns the new root element.
 *
 * @param {Object|djs.model.Root} element
 * @param {boolean} [override] whether to override the current root element, if any
 *
 * @return {Object|djs.model.Root} new root element
 */
canvas.setRootElement(element, override)
```

#### canvas.addShape

```js
/**
 * Adds a shape to the canvas
 *
 * @param {Object|djs.model.Shape} shape to add to the diagram
 * @param {djs.model.Base} [parent]
 * @param {number} [parentIndex]
 *
 * @return {djs.model.Shape} the added shape
 */
canvas.addShape(shape, parent, parentIndex)
```

#### canvas.addConnection

```js
/**
 * Adds a connection to the canvas
 *
 * @param {Object|djs.model.Connection} connection to add to the diagram
 * @param {djs.model.Base} [parent]
 * @param {number} [parentIndex]
 *
 * @return {djs.model.Connection} the added connection
 */
canvas.addConnection(connection, parent, parentIndex)
```

#### canvas.removeShape

```js
/**
 * Removes a shape from the canvas
 *
 * @param {string|djs.model.Shape} shape or shape id to be removed
 *
 * @return {djs.model.Shape} the removed shape
 */
canvas.removeShape(shape)
```

#### canvas.removeConnection

```js
/**
 * Removes a connection from the canvas
 *
 * @param {string|djs.model.Connection} connection or connection id to be removed
 *
 * @return {djs.model.Connection} the removed connection
 */
canvas.removeConnection(shape)
```

#### canvas.getGraphics

```js
/**
 * Return the graphical object underlaying a certain diagram element
 *
 * @param {string|djs.model.Base} element descriptor of the element
 * @param {boolean} [secondary=false] whether to return the secondary connected element
 *
 * @return {SVGElement}
 */
canvas.getGraphics(element, secondary)
```

#### canvas.viewbox

```js
/**
 * Gets or sets the view box of the canvas, i.e. the
 * area that is currently displayed.
 *
 * The getter may return a cached viewbox (if it is currently
 * changing). To force a recomputation, pass `false` as the first argument.
 *
 * @example
 *
 * canvas.viewbox({ x: 100, y: 100, width: 500, height: 500 })
 *
 * // sets the visible area of the diagram to (100|100) -> (600|100)
 * // and and scales it according to the diagram width
 *
 * var viewbox = canvas.viewbox(); // pass `false` to force recomputing the box.
 *
 * console.log(viewbox);
 * // {
 * //   inner: Dimensions,
 * //   outer: Dimensions,
 * //   scale,
 * //   x, y,
 * //   width, height
 * // }
 *
 * // if the current diagram is zoomed and scrolled, you may reset it to the
 * // default zoom via this method, too:
 *
 * var zoomedAndScrolledViewbox = canvas.viewbox();
 *
 * canvas.viewbox({
 *   x: 0,
 *   y: 0,
 *   width: zoomedAndScrolledViewbox.outer.width,
 *   height: zoomedAndScrolledViewbox.outer.height
 * });
 *
 * @param  {Object} [box] the new view box to set
 * @param  {number} box.x the top left X coordinate of the canvas visible in view box
 * @param  {number} box.y the top left Y coordinate of the canvas visible in view box
 * @param  {number} box.width the visible width
 * @param  {number} box.height
 *
 * @return {Object} the current view box
 */
canvas.viewbox(box)
```

---

#### canvas.scroll

```js
/**
 * Gets or sets the scroll of the canvas.
 *
 * @param {Object} [delta] the new scroll to apply.
 *
 * @param {number} [delta.dx]
 * @param {number} [delta.dy]
 */
canvas.scroll(delta)
```

#### canvas.zoom

```js
/**
 * Gets or sets the current zoom of the canvas, optionally zooming
 * to the specified position.
 *
 * The getter may return a cached zoom level. Call it with `false` as
 * the first argument to force recomputation of the current level.
 *
 * @param {string|number} [newScale] the new zoom level, either a number, i.e. 0.9,
 *                                   or `fit-viewport` to adjust the size to fit the current viewport
 * @param {string|Point} [center] the reference point { x: .., y: ..} to zoom to, 'auto' to zoom into mid or null
 *
 * @return {number} the current scale
 */
canvas.zoom(newScale, center)
```

#### canvas.getSize

```js
/**
 * Returns the size of the canvas
 *
 * @return {Dimensions}
 */
canvas.getSize()
```

#### canvas.getAbsoluteBBox

```js
/**
 * Return the absolute bounding box for the given element
 *
 * The absolute bounding box may be used to display overlays in the
 * callers (browser) coordinate system rather than the zoomed in/out
 * canvas coordinates.
 *
 * @param  {ElementDescriptor} element
 * @return {Bounds} the absolute bounding box
 */
canvas.getAbsoluteBBox(element)
```

#### canvas.resized

```js
/**
 * Fires an event in order other modules can react to the
 * canvas resizing
 */
canvas.resized()
```

---

### [BpmnFactory]()

```js
elementFactory = modeler.get('bpmnFactory')
```

#### bpmnFactory.create

```js
bpmnFactory.create(type, attrs)
```

---

### [BpmnFactory](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementFactory.js)

```js
elementFactory = modeler.get('elementFactory')
```

#### elementFactory.createRoot

```js
/**
 * Create a model element with the given type and
 * a number of pre-set attributes.
 *
 * @param  {Object} attrs
 * @return {djs.model.Base} the newly created model instance
 */
elementFactory.createRoot(attrs)
```

#### elementFactory.createLabel

```js
elementFactory.createLabel(attrs)
```

#### elementFactory.createShape

```js
elementFactory.createShape(attrs)
```

#### elementFactory.createConnection

```js
elementFactory.createConnection(attrs)
```

---

### [ElementRegistry](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementRegistry.js)

```js
const elementRegistry = modeler.get('elementRegistry')
```

##### elementRegistry.add

```js
/**
 * Register a pair of (element, gfx, (secondaryGfx)).
 *
 * @param {djs.model.Base} element
 * @param {SVGElement} gfx
 * @param {SVGElement} [secondaryGfx] optional other element to register, too
 */
elementRegistry.add(element, gfx, secondaryGfx)
```

##### elementRegistry.remove

```js
/**
 * Removes an element from the registry.
 *
 * @param {djs.model.Base} element
 */
elementRegistry.remove(element)
```

##### elementRegistry.get

```js
/**
 * Return the model element for a given id or graphics.
 *
 * @example
 *
 * elementRegistry.get('SomeElementId_1');
 * elementRegistry.get(gfx);
 *
 *
 * @param {string|SVGElement} filter for selecting the element
 *
 * @return {djs.model.Base}
 */
elementRegistry.get(filter)
```

##### elementRegistry.getAll

```js
/**
 * Return all rendered model elements.
 *
 * @return {Array<djs.model.Base>}
 */
elementRegistry.getAll()
```

##### elementRegistry.updateId

```js
/**
 * Update the id of an element
 *
 * @param {djs.model.Base} element
 * @param {string} newId
 */
elementRegistry.updateId(element, newId)
```

##### elementRegistry.filter

```js
/**
 * Return all elements that match a given filter function.
 *
 * @param {Function} fn
 *
 * @return {Array<djs.model.Base>}
 */
elementRegistry.filter(fn)
```

##### elementRegistry.forEach

```js
/**
 * Iterate over all diagram elements.
 *
 * @param {Function} fn
 */
elementRegistry.forEach(fn)
```

##### elementRegistry.getGraphics

```js
/**
 * Return the graphical representation of an element or its id.
 *
 * @example
 * elementRegistry.getGraphics('SomeElementId_1');
 * elementRegistry.getGraphics(rootElement); // <g ...>
 *
 * elementRegistry.getGraphics(rootElement, true); // <svg ...>
 *
 *
 * @param {string|djs.model.Base} filter
 * @param {boolean} [secondary=false] whether to return the secondary connected element
 *
 * @return {SVGElement}
 */
elementRegistry.getGraphics(filter, secondary)
```

---

### [Modeling](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/modeling/Modeling.js)

#### modeling.updateProperties

```js
// 更新业务对象属性（常用） 包括 id
modeling.updateProperties(elements, attr)
```

#### modeling.createShape

```js
/**
 * Create a shape at the specified position.
 *
 * @param {djs.model.Shape|Object} shape
 * @param {Point} position
 * @param {djs.model.Shape|djs.model.Root} target
 * @param {number} [parentIndex] position in parents children list
 * @param {Object} [hints]
 * @param {boolean} [hints.attach] whether to attach to target or become a child
 *
 * @return {djs.model.Shape} the created shape
 */
modeling.createShape(shape, position, target, parentIndex, hints)
```

#### modeling.appendShape

```js
/**
 * Append shape to given source, drawing a connection
 * between source and the newly created shape.
 *
 * @param {djs.model.Shape} source
 * @param {djs.model.Shape|Object} shape
 * @param {Point} position
 * @param {djs.model.Shape} target
 * @param {Object} [hints]
 * @param {boolean} [hints.attach]
 * @param {djs.model.Connection|Object} [hints.connection]
 * @param {djs.model.Base} [hints.connectionParent]
 *
 * @return {djs.model.Shape} the newly created shape
 */
modeling.appendShape(source, shape, position, target, hints)
```

#### modeling more

```js
modeling.createElements(shape, position, target, parentIndex, hints)
modeling.createLabel(labelTarget, position, label, parent)
modeling.removeElements(elements)
modeling.removeShape(shape, hints)
modeling.removeConnection(connection, hints)
modeling.alignElements(elements, alignment)
modeling.resizeShape(shape, newBounds, minBounds, hints)
modeling.createSpace(movingShapes, resizingShapes, delta, direction, start)
modeling.updateWaypoints(connection, newWaypoints, hints)
modeling.reconnect(connection, source, target, dockingOrPoints, hints)
modeling.reconnectStart(connection, newSource, dockingOrPoints, hints)
modeling.reconnectEnd(connection, newTarget, dockingOrPoints, hints)
modeling.connect(source, target, attrs, hints)
modeling.toggleCollapse(shape, hints)
```

---
