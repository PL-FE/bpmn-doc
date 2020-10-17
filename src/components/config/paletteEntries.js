export default {
  'create.start-event': createAction(
    'bpmn:StartEvent',
    'event',
    'bpmn-icon-start-event-none',
    'Create StartEvent'
  ),
  'create.task': createAction(
    'bpmn:Task',
    'activity',
    'bpmn-icon-task-custom', // 🙋‍♂️ 使用图片后，记得修改成自己的类名
    'Create Task',
    require('../img/task.png') // 📌
  )
}

function createAction (type, group, className, title, imageUrl) {
  // 还记得 CustomPalette.js 吗？便是这里回调 createListener 函数
  // if (action === 'click') {
  // 		handler(originalEvent, autoActivate, elementFactory, create)
  // 	}
  function createListener (event, autoActivate, elementFactory, create) {
    var shape = elementFactory.createShape({ type })

    create.start(event, shape)
  }

  return {
    group: group,
    className: className,
    title: title,
    imageUrl, // 📌
    action: {
      dragstart: createListener,
      click: createListener
    }
  }
}