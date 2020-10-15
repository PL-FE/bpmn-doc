import {
  assign
} from 'min-dash'
const COLOR_RED = '#cc0000 '
const COLOR_YELLOW = 'ffc800'
const COLOR_GREEN = '#52b415'
export default class CustomContextPad {
  constructor (bpmnFactory, config, contextPad, create, elementFactory, injector, translate) {
    this.bpmnFactory = bpmnFactory
    this.create = create
    this.elementFactory = elementFactory
    this.translate = translate

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false)
    }

    contextPad.registerProvider(this)
  }

  getContextPadEntries (element) {
    const {
      autoPlace,
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this

    const actions = {}
    if (element.type === 'label') {
      return actions
    }
    function appendServiceTask (suitabilityScore) {
      return function (event, element) {
        console.log('autoPlace', autoPlace)
        if (autoPlace) {
          const businessObject = bpmnFactory.create('bpmn:Task')

          businessObject.suitable = suitabilityScore
          businessObject.name = element.type

          const shape = elementFactory.createShape({
            type: 'bpmn:Task',
            businessObject: businessObject
          })

          autoPlace.append(element, shape)
        } else {
          appendServiceTaskStart(event, element)
        }
      }
    }

    function appendServiceTaskStart (suitabilityScore) {
      return function (event) {
        const businessObject = bpmnFactory.create('bpmn:Task')

        businessObject.suitable = suitabilityScore
        businessObject.name = element.type

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        })

        create.start(event, shape, element)
      }
    }

    if (element.type === 'bpmn:Task') {
      assign(actions, {
        'append.low-task': {
          group: 'model',
          className: 'bpmn-icon-task red',
          title: translate('Append Task with low suitability score'),
          action: {
            click: appendServiceTask(COLOR_RED),
            dragstart: appendServiceTaskStart(COLOR_RED)
          }
        },
        'append.average-task': {
          group: 'model',
          className: 'bpmn-icon-task yellow',
          title: translate('Append Task with average suitability score'),
          action: {
            click: appendServiceTask(COLOR_YELLOW),
            dragstart: appendServiceTaskStart(COLOR_YELLOW)
          }
        },
        'append.high-task': {
          group: 'model',
          className: 'bpmn-icon-task green',
          title: translate('Append Task with high suitability score'),
          action: {
            click: appendServiceTask(COLOR_GREEN),
            dragstart: appendServiceTaskStart(COLOR_GREEN)
          }
        }
      })
    }

    return actions
  }
}

CustomContextPad.$inject = [
  'bpmnFactory',
  'config',
  'contextPad',
  'create',
  'elementFactory',
  'injector',
  'translate'
]
