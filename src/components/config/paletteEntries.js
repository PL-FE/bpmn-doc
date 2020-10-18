
import { is } from 'bpmn-js/lib/util/ModelUtil'
import {
  assign
} from 'min-dash'
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg'

const TASK_BORDER_RADIUS = 2

export default {
  'create.start-event': createAction(
    'bpmn:StartEvent',
    'event',
    'bpmn-icon-start-event-none',
    'Create StartEvent',
    '',
    drawShape // 📌
  ),
  'create.task': createAction(
    'bpmn:Task',
    'activity',
    'bpmn-icon-task-custom', // 🙋‍♂️ 使用图片后，记得修改成自己的类名
    'Create Task',
    require('../img/task.png'),
    drawShape // 📌
  )
}

function createAction (type, group, className, title, imageUrl = '', drawShape) {
  // 还记得 CustomPalette.js 吗？便是这里回调 createListener 函数
  // if (action === 'click') {
  // handler(originalEvent, autoActivate, elementFactory, create)
  // }
  function createListener (event, autoActivate, elementFactory, create) {
    var shape = elementFactory.createShape({ type })

    create.start(event, shape)
  }

  const config = {
    type, // 📌
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
    }
    )
  }
  if (drawShape) {
    assign(config, {
      drawShape
    }
    )
  }

  return config
}

function drawShape (parentNode, element, bpmnRenderer) {
  const shape = bpmnRenderer.drawShape(parentNode, element)

  if (is(element, 'bpmn:Task')) {
    const height = 80
    const width = 100
    element.width = width
    element.height = height

    const rect = drawRect(parentNode, width, height, TASK_BORDER_RADIUS, '#52B415')

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

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect (parentNode, width, height, borderRadius, strokeColor) {
  const rect = svgCreate('rect')

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || '#000',
    strokeWidth: 2,
    fill: '#fff'
  })

  svgAppend(parentNode, rect)

  return rect
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
function prependTo (newNode, parentNode, siblingNode) {
  parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild)
}
