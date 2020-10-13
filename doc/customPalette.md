# 自定义 Palette

由于 `bpmn-js` 构建在两个重要的库之上:`diagram-js` 和 `bpmn-moddle`

`diagram-js` 是一个工具箱，用于在 web 上显示和修改图表。
`diagram-js` 使用`依赖注入(DI)`来连接和发现图组件。
所以为我们扩展 Bpmn 提供了很大方便，包括传递 元素信息、模型信息、Palette 容器信息等，都可以直接在 `new Modeler(option)` 中的 `option` 传递

---

## 思路

主要思路是将源码中的 `Palette` 相关源码拷贝出来，进行自定义修改后，通过 `additionalModules` 再传进去

源码在手，可以为所欲为

可实现自定义工具栏 的`布局、位置、大小颜色等，还能够指定工具栏的容器`

---

## 具体实现

```js
Palette.$inject = ['eventBus', 'canvas', 'config.paletteContainer']
```

注意： `config` 这个对象能够获取 `new Modeler(option)` 中的 `option`

源码已经抽取在 `src\views\bpmn\customBpmn\palette`

TODO: 通过实现配置生成元素，再继续此教程
