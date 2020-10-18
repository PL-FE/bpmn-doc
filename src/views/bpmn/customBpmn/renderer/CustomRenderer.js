import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer'
import { getRoundRectPath } from 'bpmn-js/lib/draw/BpmnRenderUtil'

import { some, find } from 'min-dash'

import { is } from 'bpmn-js/lib/util/ModelUtil'

const HIGH_PRIORITY = 1500
const TASK_BORDER_RADIUS = 2
export default function CustomRenderer (
  config, eventBus, styles, pathMap,
  canvas, textRenderer, paletteEntries) {
  BpmnRenderer.call(this, config, eventBus, styles, pathMap,
    canvas, textRenderer, HIGH_PRIORITY)

  this._paletteEntries = paletteEntries
  this._textRenderer = textRenderer
}

CustomRenderer.prototype.canRender = function (element) {
  // only render tasks and events (ignore labels)
  const paletteEntries = this._paletteEntries

  return some(paletteEntries, (entry) => {
    return is(element, entry.type)
  }) && !element.labelTarget
}

CustomRenderer.prototype.drawShape = function (parentNode, element) {
  const paletteEntries = this._paletteEntries
  const textRenderer = this._textRenderer
  const shape = find(paletteEntries, (entry) => {
    return is(element, entry.type)
  })

  if (shape && shape.drawShape instanceof Function) {
    return shape.drawShape(parentNode, element, textRenderer, paletteEntries)
  }
  return BpmnRenderer.prototype.drawShape.call(this, parentNode, element)
}

CustomRenderer.prototype.getShapePath = function (shape) {
  if (is(shape, 'bpmn:Task')) {
    return getRoundRectPath(shape, TASK_BORDER_RADIUS)
  }

  return BpmnRenderer.prototype.getShapePath.call(this, shape)
}

CustomRenderer.$inject = [
  'config.bpmnRenderer',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer',
  'config.paletteEntries'
]
