# MiniMap

这里比较简单，直接使用官方的插件即可，适用于流程较多较复杂的场景

# 使用

```cmd
npm install --save diagram-js-minimap
```

```js
import BpmnModeler from 'bpmn-js/lib/Modeler'

import minimapModule from 'diagram-js-minimap'

var bpmnModeler = new BpmnModeler({
  container: '#canvas',
  additionalModules: [minimapModule]
})

await bpmnModeler.importXML(xml)

// 打开 minimap, 默认不打开
bpmnModeler.get('minimap').open()
```

别忘了引入样式

```js
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
```

---

## 最后

[在线预览](http://bpmn-doc.pl-fe.cn/)
