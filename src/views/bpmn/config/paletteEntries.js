import { assign } from 'min-dash'
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg'

export default {
  'create.customtask': createAction(
    'etl:Task', // etl.json 定义
    '自定义',
    'customShape customtask',
    'Create custom Task',
    drawCustomTask
  ),
  'create.start-StartEvent': createAction(
    'bpmn:StartEvent',
    'event',
    'custom-icon-start-event-none',
    'Create StartEvent'
  ),
  'create.end-event': createAction(
    'bpmn:EndEvent',
    'event',
    'custom-icon-end-event-none',
    'Create EndEvent'
  ),
  'create.task': createAction(
    'bpmn:Task',
    'activity',
    'inShape custom-icon-task',
    'Create Task',
    drawTask
  ),
  'create.exclusive-gateway': createAction(
    'bpmn:ExclusiveGateway',
    'gateway',
    'inShape custom-icon-gateway-none',
    'Create Gateway'
  ),
  'create.data-object': createAction(
    'bpmn:DataObjectReference',
    'data-object',
    'inShape custom-icon-data-object',
    'Create DataObjectReference'
  )
}

function createAction (
  type,
  group,
  className,
  title,
  drawShape,
  translate,
  options
) {
  var shortType = type.replace(/^bpmn:/, '')

  function createListener (event, autoActivate, elementFactory, create) {
    var shape = elementFactory.createShape(assign({ type: type }, options))

    if (options) {
      shape.businessObject.di.isExpanded = options.isExpanded
    }

    // TODO: 自定义元模型 需要 实现 createText
    shape.businessObject.name = type

    create.start(event, shape)
  }
  return {
    type,
    group: group,
    className: className,
    title: title || translate('Create {type}', { type: shortType }),
    drawShape,
    action: {
      dragstart: createListener,
      click: createListener
    }
  }
}

function drawCustomTask (parentNode, element, textRenderer, entries) {
  const width = 130
  const height = 60
  const borderRadius = 20
  const strokeColor = '#4483ec'
  const fillColor = !element.businessObject.suitable && '#a2c5fd'

  element.width = width
  element.height = height
  const rect = drawRect(
    parentNode,
    width,
    height,
    borderRadius,
    strokeColor,
    fillColor
  )
  const text = textRenderer.createText(element.businessObject.name || '', {
    box: element,
    align: 'center-middle',
    padding: 5,
    size: {
      width: 100
    }
  })
  svgAppend(parentNode, text)
  return rect
}

function drawTask (parentNode, element, textRenderer, entries) {
  const width = 100
  const height = 80
  const borderRadius = 20
  const strokeColor = element.businessObject.suitable
  const fillColor = '#fff'

  element.width = width
  element.height = height
  const rect = drawRect(
    parentNode,
    width,
    height,
    borderRadius,
    strokeColor,
    fillColor
  )
  const text = textRenderer.createText(element.businessObject.name || '', {
    box: element,
    align: 'center-middle',
    padding: 5,
    size: {
      width: 100
    }
  })
  svgAppend(parentNode, text)
  return rect
}

// helpers //////////

// copied from https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js
function drawRect (
  parentNode,
  width,
  height,
  borderRadius,
  strokeColor,
  fillColor
) {
  const rect = svgCreate('rect')

  svgAttr(rect, {
    width: width,
    height: height,
    rx: borderRadius,
    ry: borderRadius,
    stroke: strokeColor || '#000',
    strokeWidth: 2,
    fill: fillColor
  })

  svgAppend(parentNode, rect)

  return rect
}

// copied from https://github.com/bpmn-io/diagram-js/blob/master/lib/core/GraphicsFactory.js
// function prependTo (newNode, parentNode, siblingNode) {
//   parentNode.insertBefore(newNode, siblingNode || parentNode.firstChild)
// }
