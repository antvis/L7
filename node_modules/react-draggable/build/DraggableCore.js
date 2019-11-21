"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _domFns = require("./utils/domFns");

var _positionFns = require("./utils/positionFns");

var _shims = require("./utils/shims");

var _log = _interopRequireDefault(require("./utils/log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Simple abstraction for dragging events names.
const eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  }
}; // Default to mouse events.

let dragEventFor = eventsFor.mouse;
/*:: type DraggableCoreState = {
  dragging: boolean,
  lastX: number,
  lastY: number,
  touchIdentifier: ?number
};*/

/*:: export type DraggableBounds = {
  left: number,
  right: number,
  top: number,
  bottom: number,
};*/

/*:: export type DraggableData = {
  node: HTMLElement,
  x: number, y: number,
  deltaX: number, deltaY: number,
  lastX: number, lastY: number,
};*/

/*:: export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void;*/

/*:: export type ControlPosition = {x: number, y: number};*/

/*:: export type PositionOffsetControlPosition = {x: number|string, y: number|string};*/

/*:: export type DraggableCoreProps = {
  allowAnyClick: boolean,
  cancel: string,
  children: ReactElement<any>,
  disabled: boolean,
  enableUserSelectHack: boolean,
  offsetParent: HTMLElement,
  grid: [number, number],
  handle: string,
  onStart: DraggableEventHandler,
  onDrag: DraggableEventHandler,
  onStop: DraggableEventHandler,
  onMouseDown: (e: MouseEvent) => void,
};*/

//
// Define <DraggableCore>.
//
// <DraggableCore> is for advanced usage of <Draggable>. It maintains minimal internal state so it can
// work well with libraries that require more control over the element.
//
class DraggableCore extends _react.default.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      dragging: false,
      // Used while dragging to determine deltas.
      lastX: NaN,
      lastY: NaN,
      touchIdentifier: null
    });

    _defineProperty(this, "handleDragStart", e => {
      // Make it possible to attach event handlers on top of this one.
      this.props.onMouseDown(e); // Only accept left-clicks.

      if (!this.props.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false; // Get nodes. Be sure to grab relative document (could be iframed)

      const thisNode = _reactDom.default.findDOMNode(this);

      if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
        throw new Error('<DraggableCore> not mounted on DragStart!');
      }

      const {
        ownerDocument
      } = thisNode; // Short circuit if handle or cancel prop was provided and selector doesn't match.

      if (this.props.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || this.props.handle && !(0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.handle, thisNode) || this.props.cancel && (0, _domFns.matchesSelectorAndParentsTo)(e.target, this.props.cancel, thisNode)) {
        return;
      } // Set touch identifier in component state if this is a touch event. This allows us to
      // distinguish between individual touches on multitouch screens by identifying which
      // touchpoint was set to this element.


      const touchIdentifier = (0, _domFns.getTouchIdentifier)(e);
      this.setState({
        touchIdentifier
      }); // Get the current drag point from the event. This is used as the offset.

      const position = (0, _positionFns.getControlPosition)(e, touchIdentifier, this);
      if (position == null) return; // not possible but satisfies flow

      const {
        x,
        y
      } = position; // Create an event object with all the data parents need to make a decision here.

      const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
      (0, _log.default)('DraggableCore: handleDragStart: %j', coreEvent); // Call event handler. If it returns explicit false, cancel.

      (0, _log.default)('calling', this.props.onStart);
      const shouldUpdate = this.props.onStart(e, coreEvent);
      if (shouldUpdate === false) return; // Add a style to the body to disable user-select. This prevents text from
      // being selected all over the page.

      if (this.props.enableUserSelectHack) (0, _domFns.addUserSelectStyles)(ownerDocument); // Initiate dragging. Set the current x and y as offsets
      // so we know how much we've moved during the drag. This allows us
      // to drag elements around even if they have been moved, without issue.

      this.setState({
        dragging: true,
        lastX: x,
        lastY: y
      }); // Add events to the document directly so we catch when the user's mouse/touch moves outside of
      // this element. We use different events depending on whether or not we have detected that this
      // is a touch-capable device.

      (0, _domFns.addEvent)(ownerDocument, dragEventFor.move, this.handleDrag);
      (0, _domFns.addEvent)(ownerDocument, dragEventFor.stop, this.handleDragStop);
    });

    _defineProperty(this, "handleDrag", e => {
      // Prevent scrolling on mobile devices, like ipad/iphone.
      if (e.type === 'touchmove') e.preventDefault(); // Get the current drag point from the event. This is used as the offset.

      const position = (0, _positionFns.getControlPosition)(e, this.state.touchIdentifier, this);
      if (position == null) return;
      let {
        x,
        y
      } = position; // Snap to grid if prop has been provided

      if (Array.isArray(this.props.grid)) {
        let deltaX = x - this.state.lastX,
            deltaY = y - this.state.lastY;
        [deltaX, deltaY] = (0, _positionFns.snapToGrid)(this.props.grid, deltaX, deltaY);
        if (!deltaX && !deltaY) return; // skip useless drag

        x = this.state.lastX + deltaX, y = this.state.lastY + deltaY;
      }

      const coreEvent = (0, _positionFns.createCoreData)(this, x, y);
      (0, _log.default)('DraggableCore: handleDrag: %j', coreEvent); // Call event handler. If it returns explicit false, trigger end.

      const shouldUpdate = this.props.onDrag(e, coreEvent);

      if (shouldUpdate === false) {
        try {
          // $FlowIgnore
          this.handleDragStop(new MouseEvent('mouseup'));
        } catch (err) {
          // Old browsers
          const event = ((document.createEvent('MouseEvents')
          /*: any*/
          )
          /*: MouseTouchEvent*/
          ); // I see why this insanity was deprecated
          // $FlowIgnore

          event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          this.handleDragStop(event);
        }

        return;
      }

      this.setState({
        lastX: x,
        lastY: y
      });
    });

    _defineProperty(this, "handleDragStop", e => {
      if (!this.state.dragging) return;
      const position = (0, _positionFns.getControlPosition)(e, this.state.touchIdentifier, this);
      if (position == null) return;
      const {
        x,
        y
      } = position;
      const coreEvent = (0, _positionFns.createCoreData)(this, x, y);

      const thisNode = _reactDom.default.findDOMNode(this);

      if (thisNode) {
        // Remove user-select hack
        if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(thisNode.ownerDocument);
      }

      (0, _log.default)('DraggableCore: handleDragStop: %j', coreEvent); // Reset the el.

      this.setState({
        dragging: false,
        lastX: NaN,
        lastY: NaN
      }); // Call event handler

      this.props.onStop(e, coreEvent);

      if (thisNode) {
        // Remove event handlers
        (0, _log.default)('DraggableCore: Removing handlers');
        (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
        (0, _domFns.removeEvent)(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
      }
    });

    _defineProperty(this, "onMouseDown", e => {
      dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

      return this.handleDragStart(e);
    });

    _defineProperty(this, "onMouseUp", e => {
      dragEventFor = eventsFor.mouse;
      return this.handleDragStop(e);
    });

    _defineProperty(this, "onTouchStart", e => {
      // We're on a touch device now, so change the event handlers
      dragEventFor = eventsFor.touch;
      return this.handleDragStart(e);
    });

    _defineProperty(this, "onTouchEnd", e => {
      // We're on a touch device now, so change the event handlers
      dragEventFor = eventsFor.touch;
      return this.handleDragStop(e);
    });
  }

  componentWillUnmount() {
    // Remove any leftover event handlers. Remove both touch and mouse handlers in case
    // some browser quirk caused a touch event to fire during a mouse move, or vice versa.
    const thisNode = _reactDom.default.findDOMNode(this);

    if (thisNode) {
      const {
        ownerDocument
      } = thisNode;
      (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.move, this.handleDrag);
      (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.move, this.handleDrag);
      (0, _domFns.removeEvent)(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
      (0, _domFns.removeEvent)(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
      if (this.props.enableUserSelectHack) (0, _domFns.removeUserSelectStyles)(ownerDocument);
    }
  }

  render() {
    // Reuse the child provided
    // This makes it flexible to use whatever element is wanted (div, ul, etc)
    return _react.default.cloneElement(_react.default.Children.only(this.props.children), {
      style: (0, _domFns.styleHacks)(this.props.children.props.style),
      // Note: mouseMove handler is attached to document so it will still function
      // when the user drags quickly and leaves the bounds of the element.
      onMouseDown: this.onMouseDown,
      onTouchStart: this.onTouchStart,
      onMouseUp: this.onMouseUp,
      onTouchEnd: this.onTouchEnd
    });
  }

}

exports.default = DraggableCore;

_defineProperty(DraggableCore, "displayName", 'DraggableCore');

_defineProperty(DraggableCore, "propTypes", {
  /**
   * `allowAnyClick` allows dragging using any mouse button.
   * By default, we only accept the left button.
   *
   * Defaults to `false`.
   */
  allowAnyClick: _propTypes.default.bool,

  /**
   * `disabled`, if true, stops the <Draggable> from dragging. All handlers,
   * with the exception of `onMouseDown`, will not fire.
   */
  disabled: _propTypes.default.bool,

  /**
   * By default, we add 'user-select:none' attributes to the document body
   * to prevent ugly text selection during drag. If this is causing problems
   * for your app, set this to `false`.
   */
  enableUserSelectHack: _propTypes.default.bool,

  /**
   * `offsetParent`, if set, uses the passed DOM node to compute drag offsets
   * instead of using the parent node.
   */
  offsetParent: function (props
  /*: DraggableCoreProps*/
  , propName
  /*: $Keys<DraggableCoreProps>*/
  ) {
    if (props[propName] && props[propName].nodeType !== 1) {
      throw new Error('Draggable\'s offsetParent must be a DOM Node.');
    }
  },

  /**
   * `grid` specifies the x and y that dragging should snap to.
   */
  grid: _propTypes.default.arrayOf(_propTypes.default.number),

  /**
   * `handle` specifies a selector to be used as the handle that initiates drag.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *         return (
   *            <Draggable handle=".handle">
   *              <div>
   *                  <div className="handle">Click me to drag</div>
   *                  <div>This is some other content</div>
   *              </div>
   *           </Draggable>
   *         );
   *       }
   *   });
   * ```
   */
  handle: _propTypes.default.string,

  /**
   * `cancel` specifies a selector to be used to prevent drag initialization.
   *
   * Example:
   *
   * ```jsx
   *   let App = React.createClass({
   *       render: function () {
   *           return(
   *               <Draggable cancel=".cancel">
   *                   <div>
   *                     <div className="cancel">You can't drag from here</div>
   *                     <div>Dragging here works fine</div>
   *                   </div>
   *               </Draggable>
   *           );
   *       }
   *   });
   * ```
   */
  cancel: _propTypes.default.string,

  /**
   * Called when dragging starts.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onStart: _propTypes.default.func,

  /**
   * Called while dragging.
   * If this function returns the boolean false, dragging will be canceled.
   */
  onDrag: _propTypes.default.func,

  /**
   * Called when dragging stops.
   * If this function returns the boolean false, the drag will remain active.
   */
  onStop: _propTypes.default.func,

  /**
   * A workaround option which can be passed if onMouseDown needs to be accessed,
   * since it'll always be blocked (as there is internal use of onMouseDown)
   */
  onMouseDown: _propTypes.default.func,

  /**
   * These properties should be defined on the child, not here.
   */
  className: _shims.dontSetMe,
  style: _shims.dontSetMe,
  transform: _shims.dontSetMe
});

_defineProperty(DraggableCore, "defaultProps", {
  allowAnyClick: false,
  // by default only accept left click
  cancel: null,
  disabled: false,
  enableUserSelectHack: true,
  offsetParent: null,
  handle: null,
  grid: null,
  transform: null,
  onStart: function () {},
  onDrag: function () {},
  onStop: function () {},
  onMouseDown: function () {}
});