# bpmnApi

一开始只能望官方 demo 发愣，因为没找到一个完整的 API 文档，所以只能自己慢慢记录

---

## 开始

在线预览 bpmn-modeling-api-cn

[https://pl-fe.github.io/bpmn-modeling-api-cn.github.io/](https://pl-fe.github.io/bpmn-modeling-api-cn.github.io/)

原版 bpmn-modeling-api

[https://github.com/bpmn-io/bpmn-js-examples/tree/master/modeling-api](https://github.com/bpmn-io/bpmn-js-examples/tree/master/modeling-api)

常用到的服务

- [BpmnFactory](): 根据 bpmn-js 的内部数据模型`创建业务对象`的工厂
- [ElementFactory](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementFactory.js): 根据 bpmn-js 的内部数据模型`创建形状和连接`的工厂。
- [ElementRegistry](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementRegistry.js): 知道添加到图中的所有元素，并提供 api 来根据 id `检索元素及其图形表示`。
- Modeling: 提供用于`更新`画布上的元素`(移动、删除)`的 api

### [BpmnFactory]()

- bpmnFactory.create

### [BpmnFactory](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementFactory.js)

- elementFactory.createRoot
- elementFactory.createLabel
- elementFactory.createShape
- elementFactory.createConnection

```js
elementFactory = modeler.get('elementFactory')
```

```js
/**
 * Create a model element with the given type and
 * a number of pre-set attributes.
 *
 * @param  {Object} attrs
 * @return {djs.model.Base} the newly created model instance
 */
elementFactory.createRoot(attrs)
elementFactory.createLabel(attrs)
elementFactory.createShape(attrs)
elementFactory.createConnection(attrs)
```

### [ElementRegistry](https://github.com/bpmn-io/diagram-js/blob/master/lib/core/ElementRegistry.js)

- [elementRegistry.add()](#elementRegistry.add)
- [elementRegistry.remove](#elementRegistry.remove)
- [elementRegistry.get](#elementRegistry.get)
- [elementRegistry.getAll](#[elementRegistry.getAll)
- [elementRegistry.updateId](#elementRegistry.updateId)
- [elementRegistry.filter](#elementRegistry.filter)
- [elementRegistry.forEach](#elementRegistry.forEach)
- [elementRegistry.getGraphics](#elementRegistry.getGraphics)

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

### [Modeling](https://github.com/bpmn-io/diagram-js/blob/master/lib/features/modeling/Modeling.js)
