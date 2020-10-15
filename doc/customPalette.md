# 自定义 Palette

由于 `bpmn-js` 构建在两个重要的库之上:`diagram-js` 和 `bpmn-moddle`

`diagram-js` 是一个工具箱，用于在 web 上显示和修改图表。
`diagram-js` 使用`依赖注入(DI)`来连接和发现图组件。
为扩展 Bpmn 提供了很大方便，包括传递 元素信息、模型信息、Palette 容器信息等，统一在 `new Modeler(option)` 中的 `option` 传递

---

## 思路

主要思路是将源码中的 `Palette` 相关源码拷贝出来，进行自定义修改后，通过 `additionalModules` 再传进去

可自定义工具栏的 `布局、位置、大小颜色、指定工具栏的容器等`

注意：标记 🎯 的地方为重点

---

## 开始

#### 1. 入口

[index.vue](../src/views/bpmn/index.vue)

```js
import entries from '@/views/bpmn/config/paletteEntries'
import customPalette from '@/views/bpmn/customBpmn/palette'

// 🎯 去除默认工具栏
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
			// 去掉左侧默认工具栏
			// paletteProvider: ['value', ''] // 这个去除不干净、还是会生成默认 palette
		}
	]
})
```

主要是初始化 `BpmnModeler` 时传入自定义模块

#### 2. CustomPaletteProvider 接收

> `Provider` 是 `提供器;医疗服务提供者;属性;提供者;提供程序` 的意思，是给 `Palette` 提供数据的

[CustomPaletteProvider.js](../src/views/bpmn/customBpmn/palette/CustomPaletteProvider.js)

```js
PaletteProvider.$inject = [
	'config.paletteEntries'
	// 其他代码...
]
```

`$inject` 注入需要的数据（工具栏的元素） `paletteEntries`

```js
PaletteProvider.prototype.getPaletteEntries = function(element) {
	return this._entries 🎯
}
```

重写`PaletteProvider.prototype.getPaletteEntries` 方法

将工具栏的元素提供给 `CustomPalette.js`

#### 3. CustomPalette 实现样式

这个函数是 `重点`

[CustomPalette.js](../src/views/bpmn/customBpmn/palette/CustomPalette.js)

首先看一下注入：

```js
Palette.$inject = [
	// ...其他代码

	// 🎯 创建元素和指定工具栏容器需要
	'config.paletteContainer', //  对应 new BpmnModeler 的 paletteContainer: palette,
	'config.paletteEntries' //  对应 new BpmnModeler 的 paletteEntries: entries,
]
```

有了上面的数据，下面开始修改工具栏布局的主要方法

[Palette.prototype.\_update()](https://github.com/bpmn-io/diagram-js/blob/develop/lib/features/palette/Palette.js#L221)

注意 `domQuery、domify、domAttr`等来自 `min-dom`, 是 `bpmn` 的工具函数

```js
Palette.prototype._update = function() {
// 搜索 canves 也就是指定的 bpmn 容器内有没有 .custom-palette-entries
  var entriesContainer = domQuery('.custom-palette-entries', this._container)
  var entries = this._entries = this.getEntries()
  domClear(entriesContainer);

// 开始对每一个工具栏的元素遍历
  forEach(entries, function(entry, id) {

// 接下来对他进行样式添加、属性的添加、一些列操作
// 大家可以在这里动手修改自己想要的工具栏
    var grouping = entry.group || 'default';
    //  设置分组
    var container = domQuery('[data-group=' + grouping + ']', entriesContainer);
    if (!container) {
      container = domify('<div class="group" data-group="' + grouping + '"></div>');
      entriesContainer.appendChild(container);
    }

// 如果传入 不是 separator 分割线，就代表是元素
// <div class="entry" draggable="true"></div> 是元素本体
    var html = entry.html || (
      entry.separator ?
        '<hr class="separator" />' :
        '<div class="entry" draggable="true"></div>');


    var control = domify(html);
    container.appendChild(control);

    if (!entry.separator) {
      domAttr(control, 'data-action', id);

      if (entry.title) {
        domAttr(control, 'title', entry.title);
      }

      if (entry.className) {
        addClasses(control, entry.className);
      }
  // 这里支持图片、大家可以自行扩展 svg 我认为 svg 更好看，当然字体图标也是不错的选择
      if (entry.imageUrl) {
        control.appendChild(domify('<img src="' + entry.imageUrl + '">'));
      }
    }
  });
```

#### 4. CustomPalette 实现拖拽生成元素

实现上面三点可以成功展示一个全新的工具栏

那么拖拽生成元素，怎么实现呢？

一开始传入了 `paletteEntries`，作为生成工具栏的条目， 其中也传入了生成元素的方法，只需要调用对应的方法即可。

关键代码：

```js
Palette.prototype._init = function() {
	var self = this

	var eventBus = this._eventBus

	var parentContainer = this._getParentContainer()
	// 🎯 获取传入的工具栏容器
	var container = (this._container = this._paletteContainer)
	// 未找到 使用默认
	if (!container) {
		container = this._container = domify(Palette.HTML_MARKUP)
	} else {
		// 为 传入的工具栏容器 创建子元素
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
	// 在 大容器 加入工具栏
	parentContainer.appendChild(container)

	// 下面是绑定 click 、 dragstart
	domDelegate.bind(container, ELEMENT_SELECTOR, 'click', function(event) {
		var target = event.delegateTarget

		if (domMatches(target, TOGGLE_SELECTOR)) {
			return self.toggle()
		}

		self.trigger('click', event) //  关键方法 trigger 如下
	})

	// prevent drag propagation
	domDelegate.bind(container, ENTRY_SELECTOR, 'dragstart', function(event) {
		self.trigger('dragstart', event)
	})
}

Palette.prototype.trigger = function(action, event, autoActivate) {
	handler = entry.action

	originalEvent = event.originalEvent || event

	// simple action (via callback function)
	//  🎯 传入 action 的 dragstart方法 click 方法
	if (isFunction(handler)) {
		if (action === 'click') {
			handler(originalEvent, autoActivate, elementFactory, create)
		}
	} else {
		if (handler[action]) {
			handler[action](originalEvent, autoActivate, elementFactory, create)
		}
	}

	// silence other actions
	event.preventDefault()
}
```

#### 5. 配置文件 paletteEntries.js

这个文件就是我们主要做配置的地方，如自定义工具栏及其功能、自定义渲染等

`paletteEntries.js` 返回的是一个对象，也可以是一个数组

对象的内容可以由自己修改 [CustomPalette.js](../src/views/bpmn/customBpmn/palette/CustomPalette.js) 决定

一般我们的对象大概长这样 👇

```js
{
 'create.data-object': {
        type:'bpmn:DataObjectReference',
        group: 'data-object',
        className: 'inShape custom-icon-data-object',
        title: 'Create DataObjectReference',
         action: {
            dragstart: createShape,
            click: createShape
        }
        }
}

function createShape (event, autoActivate, elementFactory, create) {
        var shape = elementFactory.createShape(assign({ type: type }, options))

        // 可以设置默认值
        shape.businessObject.name = type
        create.start(event, shape)
        // 执行完就可以创建一个新元素了
    }
```

如果你使用的是默认的元素类名，那么一切大功告成

但是修改了默认工具栏类名，需要引入 [diagram-js.css](https://github.com/bpmn-io/diagram-js/blob/develop/assets/diagram-js.css) ，修改成`相同的类名`

结合在 `className` 写上对应的类名，使用 `css` 来美化它，或者图片。

---

## 最后

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
