export function _fitViewport (center) {
  var vbox = this.viewbox(false)
  var outer = vbox.outer
  var inner = vbox.inner
  var newScale
  var newViewbox

  // display the complete diagram without zooming in.
  // instead of relying on internal zoom, we perform a
  // hard reset on the canvas viewbox to realize this
  //
  // if diagram does not need to be zoomed in, we focus it around
  // the diagram origin instead

  if (inner.x >= 0 &&
    inner.y >= 0 &&
    inner.x + inner.width <= outer.width &&
    inner.y + inner.height <= outer.height &&
    !center) {
    newViewbox = {
      x: 0,
      y: 0,
      width: Math.max(inner.width + inner.x, outer.width),
      height: Math.max(inner.height + inner.y, outer.height)
    }
  } else {
    newScale = Math.min(1, outer.width / inner.width, outer.height / inner.height)
    newViewbox = {
      x: inner.x + (center ? inner.width / 2 - outer.width / newScale / 2 : 0),
      y: inner.y + (center ? inner.height / 2 - outer.height / newScale / 2 : 0),
      width: outer.width / newScale,
      height: outer.height / newScale
    }
  }

  this.viewbox(newViewbox)

  return this.viewbox(false).scale
};
