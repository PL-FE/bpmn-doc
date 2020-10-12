import { assign } from 'min-dash'

function createAction (type, group, className, title, translate, options) {
    var shortType = type.replace(/^bpmn:/, '')

    function createListener (event, autoActivate, elementFactory, create) {
        var shape = elementFactory.createShape(assign({ type: type }, options))

        if (options) {
            shape.businessObject.di.isExpanded = options.isExpanded
        }

        create.start(event, shape)
    }
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

export default {
    'create.start-event2': createAction(
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
        'custom-icon-task',
        'Create Task'
    ),
    'create.exclusive-gateway': createAction(
        'bpmn:ExclusiveGateway',
        'gateway',
        'custom-icon-gateway-none',
        'Create Gateway'
    ),
    'create.data-object': createAction(
        'bpmn:DataObjectReference',
        'data-object',
        'custom-icon-data-object',
        'Create DataObjectReference'
    )
}
