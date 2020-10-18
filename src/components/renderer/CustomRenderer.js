import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'

import { find } from 'min-dash'

import {
  getRoundRectPath
} from 'bpmn-js/lib/draw/BpmnRenderUtil'

import { is } from 'bpmn-js/lib/util/ModelUtil'
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil'

const HIGH_PRIORITY = 1500
const TASK_BORDER_RADIUS = 2

export default class CustomRenderer extends BaseRenderer {
  constructor (eventBus, bpmnRenderer, paletteEntries) {
    super(eventBus, HIGH_PRIORITY)

    this.bpmnRenderer = bpmnRenderer
    this.paletteEntries = paletteEntries
  }

  canRender (element) {
    // only render tasks and events (ignore labels)
    return isAny(element, ['bpmn:Task', 'bpmn:Event']) && !element.labelTarget
  }

  drawShape (parentNode, element) {
    const paletteEntries = this.paletteEntries
    const shape = find(paletteEntries, (entry) => {
      return is(element, entry.type)
    })
    if (shape && shape.drawShape instanceof Function) {
      return shape.drawShape(parentNode, element, this.bpmnRenderer)
    }
    return this.bpmnRenderer.drawShape(parentNode, element)
  }

  getShapePath (shape) {
    if (is(shape, 'bpmn:Task')) {
      return getRoundRectPath(shape, TASK_BORDER_RADIUS)
    }

    return this.bpmnRenderer.getShapePath(shape)
  }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer', 'config.paletteEntries']
