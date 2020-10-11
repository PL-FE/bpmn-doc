import {
  assign
} from 'min-dash'

/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider (
  customPalette, create, elementFactory, translate) {
  this._palette = customPalette
  this._create = create
  this._elementFactory = elementFactory
  this._translate = translate

  customPalette.registerProvider(this)
}

PaletteProvider.$inject = [
  'customPalette',
  'create',
  'elementFactory',
  'translate'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  var create = this._create
  var elementFactory = this._elementFactory
  var translate = this._translate

  function createAction (type, group, className, title, options) {
    function createListener (event) {
      var shape = elementFactory.createShape(assign({ type: type }, options))

      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded
      }

      create.start(event, shape)
    }

    var shortType = type.replace(/^bpmn:/, '')

    return {
      group: group,
      className: className,
      title: title || translate('Create {type}', { type: shortType }),
      action: {
        dragstart: createListener,
        click: createListener
      }
    }
  }

  // 新增一个
  return {
    'create.start-event2': createAction(
      'bpmn:StartEvent', 'event', 'bpmn-icon-start-event-none',
      translate('Create StartEvent')
    ),
    'create.task': createAction(
      'bpmn:Task', 'activity', 'bpmn-icon-task',
      translate('Create Task')
    ),
    'create.end-event': createAction(
      'bpmn:EndEvent', 'event', 'bpmn-icon-end-event-none',
      translate('Create EndEvent')
    ),
    'create.exclusive-gateway': createAction(
      'bpmn:ExclusiveGateway', 'gateway', 'bpmn-icon-gateway-none',
      translate('Create Gateway')
    ),
    'create.data-object': createAction(
      'bpmn:DataObjectReference', 'data-object', 'bpmn-icon-data-object',
      translate('Create DataObjectReference')
    )
  }
}
