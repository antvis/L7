function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

import AbstractKeyEventStrategy from './AbstractKeyEventStrategy';
import KeyEventBitmapIndex from '../../const/KeyEventBitmapIndex';
import KeyEventCounter from '../KeyEventCounter';
import describeKeyEventType from '../../helpers/logging/describeKeyEventType';
import Configuration from '../Configuration';
import Logger from '../Logger';
import printComponent from '../../helpers/logging/printComponent';
import isUndefined from '../../utils/isUndefined';
import normalizeKeyName from '../../helpers/resolving-handlers/normalizeKeyName';
import isCmdKey from '../../helpers/parsing-key-maps/isCmdKey';
import describeKeyEvent from '../../helpers/logging/describeKeyEvent';
import EventResponse from '../../const/EventResponse';
/**
 * Defines behaviour for dealing with key maps defined in focus-only HotKey components
 * @class
 */

var FocusOnlyKeyEventStrategy =
/*#__PURE__*/
function (_AbstractKeyEventStra) {
  _inherits(FocusOnlyKeyEventStrategy, _AbstractKeyEventStra);

  /********************************************************************************
   * Init & Reset
   ********************************************************************************/
  function FocusOnlyKeyEventStrategy() {
    var _this;

    var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var keyEventManager = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, FocusOnlyKeyEventStrategy);

    /**
     * Set state that DOES get cleared on each new focus tree
     */
    _this = _possibleConstructorReturn(this, _getPrototypeOf(FocusOnlyKeyEventStrategy).call(this, configuration, keyEventManager));
    /**
     * State that doesn't get cleared on each new focus tree
     */

    /**
     * Unique identifier given to each focus tree - when the focus in the browser
     * changes, and a different tree of elements are focused, a new id is allocated
     * @typedef {Number} FocusTreeId
     */

    /**
     * Counter to keep track of what focus tree ID should be allocated next
     * @type {FocusTreeId}
     */

    _this.focusTreeId = 0;
    /**
     * Record of the event currently bubbling up through the React application (and
     * beyond). This state is *not* cleared when the event propagation is finished
     * or when the component focus tree changes. It persists until it is overridden
     * by a new event, so that the global strategy is able to inspect the last
     * event seen by the React application, even after focus is lost.
     */

    _this.currentEvent = {
      /**
       * The name of the key the event belongs to
       * @type {ReactKeyName}
       */
      key: null,

      /**
       * The event bitmap index of the type of key event
       * @type {KeyEventBitmapIndex}
       */
      type: null,
      handled: false,
      ignored: false
    };
    return _this;
  }
  /**
   * Clears the internal state, wiping any history of key events and registered handlers
   * so they have no effect on the next tree of focused HotKeys components
   * @private
   */


  _createClass(FocusOnlyKeyEventStrategy, [{
    key: "_reset",
    value: function _reset() {
      _get(_getPrototypeOf(FocusOnlyKeyEventStrategy.prototype), "_reset", this).call(this);

      this.keypressEventsToSimulate = [];
      /**
       * Increase the unique ID associated with each unique focus tree
       * @type {number}
       */

      this.focusTreeId += 1;

      this._clearEventPropagationState();
    }
    /**
     * Clears the history that is maintained for the duration of a single keyboard event's
     * propagation up the React component tree towards the root component, so that the
     * next keyboard event starts with a clean state.
     * @private
     */

  }, {
    key: "_clearEventPropagationState",
    value: function _clearEventPropagationState() {
      /**
       * Object containing state of a key events propagation up the render tree towards
       * the document root
       * @type {{previousComponentPosition: number, actionHandled: boolean}}}
       */
      this.eventPropagationState = {
        /**
         * Index of the component last seen to be handling a key event
         * @type {ComponentId}
         */
        previousComponentPosition: -1,

        /**
         * Whether the keyboard event currently being handled has already matched a
         * handler function that has been called
         * @type {Boolean}
         */
        actionHandled: false,

        /**
         * Whether the keyboard event current being handled should be ignored
         * @type {Boolean}
         */
        ignoreEvent: false,

        /**
         * Whether the keyboard event current being handled should be observed, even
         * if matches the ignoreEventCondition
         * @type {Boolean}
         */
        forceObserveEvent: false,

        /**
         * Whether the strategy is in the process of stopping propagation and tidying
         * up
         */
        stopping: false
      };
    }
    /********************************************************************************
     * Registering key maps and handlers
     ********************************************************************************/

    /**
     * Registers the actions and handlers of a HotKeys component that has gained focus
     * @param {ComponentId} componentId - Id of the component that the keyMap belongs to
     * @param {KeyMap} actionNameToKeyMap - Map of actions to key expressions
     * @param {HandlersMap} actionNameToHandlersMap - Map of actions to handler functions
     * @param {Object} options Hash of options that configure how the actions
     *        and handlers are associated and called.
     * @returns {[FocusTreeId, ComponentId]} The current focus tree's ID and a unique
     *         component ID to assign to the focused HotKeys component and passed back
     *         when handling a key event
     */

  }, {
    key: "enableHotKeys",
    value: function enableHotKeys(componentId) {
      var actionNameToKeyMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var actionNameToHandlersMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 ? arguments[3] : undefined;

      if (this.resetOnNextFocus || this.keyMaps) {
        /**
         * We know components have just lost focus or keymaps have already been built,
         * meaning we are either anticipating a new set of components to be focused or
         * we are receiving notice of a component being focused when we aren't expecting it.
         * In either case, the internal state needs to be reset.
         */
        this._reset();

        this.resetOnNextFocus = false;
      }

      this._addComponentToList(componentId, actionNameToKeyMap, actionNameToHandlersMap, options);

      this.logger.debug(this._logPrefix(componentId, {
        eventId: false
      }), 'Focused. \n');

      var component = this._getComponent(componentId);

      this.logger.verbose(this._logPrefix(componentId, {
        eventId: false
      }), 'Component options:\n', printComponent(component));
      return this.focusTreeId;
    }
    /**
     * Handles when a HotKeys component that is in focus updates its props and changes
     * either the keyMap or handlers prop value
     * @param {FocusTreeId} focusTreeId - The ID of the focus tree the component is part of.
     *        Used to identify (and ignore) stale updates.
     * @param {ComponentId} componentId - The component index of the component to
     *        update
     * @param {KeyMap} actionNameToKeyMap - Map of key sequences to action names
     * @param {HandlersMap} actionNameToHandlersMap - Map of action names to handler
     *        functions
     * @param {Object} options Hash of options that configure how the actions
     *        and handlers are associated and called.
     */

  }, {
    key: "updateEnabledHotKeys",
    value: function updateEnabledHotKeys(focusTreeId, componentId) {
      var actionNameToKeyMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var actionNameToHandlersMap = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var options = arguments.length > 4 ? arguments[4] : undefined;

      var componentPosition = this._getComponentPosition(componentId);

      if (focusTreeId !== this.focusTreeId || isUndefined(componentPosition)) {
        return;
      }

      this.componentList[componentPosition] = this._buildComponentOptions(componentId, actionNameToKeyMap, actionNameToHandlersMap, options);
      this.logger.debug(this._logPrefix(componentId, {
        focusTreeId: focusTreeId,
        eventId: false
      }), 'Received new props.');

      var component = this._getComponent(componentId);

      this.logger.verbose(this._logPrefix(componentId, {
        focusTreeId: focusTreeId,
        eventId: false
      }), 'Component options:\n', printComponent(component));
    }
    /**
     * Handles when a component loses focus by resetting the internal state, ready to
     * receive the next tree of focused HotKeys components
     * @param {FocusTreeId} focusTreeId - Id of focus tree component thinks it's
     *        apart of
     * @param {ComponentId} componentId - Index of component that is blurring
     * @returns {Boolean} Whether the component still has event propagation yet to handle
     */

  }, {
    key: "disableHotKeys",
    value: function disableHotKeys(focusTreeId, componentId) {
      if (!this.resetOnNextFocus) {
        this.resetOnNextFocus = true;
      }

      var componentPosition = this._getComponentPosition(componentId);

      var previousComponentPosition = this.eventPropagationState.previousComponentPosition;
      var outstandingEventPropagation = previousComponentPosition !== -1 && previousComponentPosition + 1 < componentPosition;
      this.logger.debug("".concat(this._logPrefix(componentId, {
        focusTreeId: focusTreeId,
        eventId: false
      })), "Lost focus".concat(outstandingEventPropagation ? ' (Key event has yet to propagate through it)' : '', "."));
      return outstandingEventPropagation;
    }
    /********************************************************************************
     * Recording key events
     ********************************************************************************/

    /**
     * @typedef {KeyboardEvent} SyntheticKeyboardEvent
     * @property {Function} persist
     */

    /**
     * Records a keydown keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called many times as a keyboard event bubbles up through the React
     * render tree. The event is only registered the first time it is seen and results
     * of some calculations are cached. The event is matched against the handlers registered
     * at each component level, to ensure the proper handler declaration scoping.
     * @param {SyntheticKeyboardEvent} event - Event containing the key name and state
     * @param {FocusTreeId} focusTreeId - Id of focus tree component thinks it's apart of
     * @param {ComponentId} componentId - The id of the component that is currently handling
     *        the keyboard event as it bubbles towards the document root.
     * @param {Object} options - Hash of options that configure how the event is handled.
     * @returns Whether the event was discarded because it was part of an old focus tree
     */

  }, {
    key: "handleKeydown",
    value: function handleKeydown(event, focusTreeId, componentId) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      var _key = normalizeKeyName(event.key);

      if (focusTreeId !== this.focusTreeId) {
        this.logger.debug(this._logPrefix(componentId), "Ignored ".concat(describeKeyEvent(event, _key, KeyEventBitmapIndex.keydown), " event because it had an old focus tree id: ").concat(focusTreeId, "."));

        this._ignoreEvent(event, componentId);

        return true;
      }

      var responseAction = this._howToHandleKeyDownEvent(event, focusTreeId, componentId, _key, options, KeyEventBitmapIndex.keydown);

      if (responseAction === EventResponse.handled) {
        var keyInCurrentCombination = !!this._getCurrentKeyState(_key);

        if (keyInCurrentCombination || this.keyCombinationIncludesKeyUp) {
          this._startAndLogNewKeyCombination(_key, KeyEventBitmapIndex.keydown, focusTreeId, componentId);
        } else {
          this._addToAndLogCurrentKeyCombination(_key, KeyEventBitmapIndex.keydown, focusTreeId, componentId);
        }

        this._callHandlerIfActionNotHandled(event, _key, KeyEventBitmapIndex.keydown, componentId, focusTreeId);
      }

      this._simulateKeyPressesMissingFromBrowser(event, _key, focusTreeId, componentId, options);

      this._updateEventPropagationHistory(componentId);

      return false;
    }
  }, {
    key: "_howToHandleKeyDownEvent",
    value: function _howToHandleKeyDownEvent(event, focusTreeId, componentId, key, options, keyEventBitmapIndex) {
      if (this._shouldIgnoreEvent()) {
        this.logger.debug(this._logPrefix(componentId), "Ignored ".concat(describeKeyEvent(event, key, keyEventBitmapIndex), " event because ignoreEventsFilter rejected it."));

        this._ignoreEvent(event, componentId);

        return EventResponse.ignored;
      }

      if (this._isNewKeyEvent(componentId)) {
        this._setNewEventParameters(event, keyEventBitmapIndex);
        /**
         * We know that this is a new key event and not the same event bubbling up
         * the React render tree towards the document root, so perform actions specific
         * to the first time an event is seen
         */


        this._setIgnoreEventFlag(event, options);

        if (this._shouldIgnoreEvent()) {
          this.logger.debug(this._logPrefix(componentId), "Ignored ".concat(describeKeyEvent(event, key, keyEventBitmapIndex), " event because ignoreEventsFilter rejected it."));

          this._ignoreEvent(event, componentId);

          return EventResponse.ignored;
        }

        this.logger.debug(this._logPrefix(componentId), "New ".concat(describeKeyEvent(event, key, keyEventBitmapIndex), " event."));

        this._checkForModifierFlagDiscrepancies(event);
      }

      return EventResponse.handled;
    }
    /**
     * Records a keypress keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called many times as a keyboard event bubbles up through the React
     * render tree. The event is only registered the first time it is seen and results
     * of some calculations are cached. The event is matched against the handlers registered
     * at each component level, to ensure the proper handler declaration scoping.
     * @param {KeyboardEvent} event - Event containing the key name and state
     * @param {FocusTreeId} focusTreeId Id - of focus tree component thinks it's apart of
     * @param {ComponentId} componentId - The index of the component that is currently handling
     *        the keyboard event as it bubbles towards the document root.
     * @param {Object} options - Hash of options that configure how the event
     *        is handled.
     * @return {Boolean} Whether the HotKeys component should discard its current focus
     *        tree Id, because it belongs to an old focus tree.
     */

  }, {
    key: "handleKeypress",
    value: function handleKeypress(event, focusTreeId, componentId, options) {
      var _key = normalizeKeyName(event.key);

      var shouldDiscardFocusTreeId = focusTreeId !== this.focusTreeId;
      /**
       * We first decide if the keypress event should be handled (to ensure the correct
       * order of logging statements)
       */

      var responseAction = this._howToHandleKeyDownEvent(event, focusTreeId, componentId, _key, options, KeyEventBitmapIndex.keypress);

      if (this._isNewKeyEvent(componentId) && this._getCurrentKeyState(_key)) {
        this._addToAndLogCurrentKeyCombination(_key, KeyEventBitmapIndex.keypress, focusTreeId, componentId);
      }
      /**
       * We attempt to find a handler of the event, only if it has not already
       * been handled and should not be ignored
       */


      if (responseAction === EventResponse.handled) {
        this._callHandlerIfActionNotHandled(event, _key, KeyEventBitmapIndex.keypress, componentId, focusTreeId);
      }

      this._updateEventPropagationHistory(componentId);

      return shouldDiscardFocusTreeId;
    }
    /**
     * Records a keyup keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called many times as a keyboard event bubbles up through the React
     * render tree. The event is only registered the first time it is seen and results
     * of some calculations are cached. The event is matched against the handlers registered
     * at each component level, to ensure the proper handler declaration scoping.
     * @param {KeyboardEvent} event Event containing the key name and state
     * @param {FocusTreeId} focusTreeId Id of focus tree component thinks it's apart of
     * @param {ComponentId} componentId The index of the component that is currently handling
     *        the keyboard event as it bubbles towards the document root.
     * @param {Object} options Hash of options that configure how the event
     *        is handled.
     * @return {Boolean} Whether HotKeys component should discard its current focusTreeId
     *        because it's stale (part of an old focus tree)
     */

  }, {
    key: "handleKeyup",
    value: function handleKeyup(event, focusTreeId, componentId, options) {
      var _key = normalizeKeyName(event.key);

      var shouldDiscardFocusId = focusTreeId !== this.focusTreeId;
      /**
       * We first decide if the keyup event should be handled (to ensure the correct
       * order of logging statements)
       */

      var responseAction = this._howToHandleKeyDownEvent(event, focusTreeId, componentId, _key, options, KeyEventBitmapIndex.keyup);
      /**
       * We then add the keyup to our current combination - regardless of whether
       * it's to be handled or not. We need to do this to ensure that if a handler
       * function changes focus to a context that ignored events, the keyup event
       * is not lost (leaving react hotkeys thinking the key is still pressed).
       */


      if (this._isNewKeyEvent(componentId) && this._getCurrentKeyState(_key)) {
        this._addToAndLogCurrentKeyCombination(_key, KeyEventBitmapIndex.keyup, focusTreeId, componentId);
      }
      /**
       * We attempt to find a handler of the event, only if it has not already
       * been handled and should not be ignored
       */


      if (responseAction === EventResponse.handled) {
        this._callHandlerIfActionNotHandled(event, _key, KeyEventBitmapIndex.keyup, componentId, focusTreeId);
      }
      /**
       * We simulate any hidden keyup events hidden by the command key, regardless
       * of whether the event should be ignored or not
       */


      this._simulateKeyUpEventsHiddenByCmd(event, _key, focusTreeId, componentId, options);

      this._updateEventPropagationHistory(componentId);

      return shouldDiscardFocusId;
    }
  }, {
    key: "_simulateKeyPressesMissingFromBrowser",
    value: function _simulateKeyPressesMissingFromBrowser(event, key, focusTreeId, componentId, options) {
      this._handleEventSimulation('keypressEventsToSimulate', 'simulatePendingKeyPressEvents', this._shouldSimulate(KeyEventBitmapIndex.keypress, key), {
        event: event,
        key: key,
        focusTreeId: focusTreeId,
        componentId: componentId,
        options: options
      });
    }
  }, {
    key: "_simulateKeyUpEventsHiddenByCmd",
    value: function _simulateKeyUpEventsHiddenByCmd(event, key, focusTreeId, componentId, options) {
      var _this2 = this;

      if (isCmdKey(key)) {
        /**
         * When the command key is pressed down with other non-modifier keys, the browser
         * does not trigger the keyup event of those keys, so we simulate them when the
         * command key is released
         */
        Object.keys(this._getCurrentKeyCombination().keys).forEach(function (keyName) {
          if (isCmdKey(keyName)) {
            return;
          }

          _this2._handleEventSimulation('keyupEventsToSimulate', 'simulatePendingKeyUpEvents', _this2._shouldSimulate(KeyEventBitmapIndex.keyup, keyName), {
            event: event,
            key: keyName,
            focusTreeId: focusTreeId,
            componentId: componentId,
            options: options
          });
        });
      }
    }
  }, {
    key: "_ignoreEvent",
    value: function _ignoreEvent(event, componentId) {
      this.currentEvent.ignored = true;

      if (this._stopEventPropagationAfterIgnoringIfEnabled(event, componentId)) {
        this._updateEventPropagationHistory(componentId, {
          forceReset: true
        });
      } else {
        this._updateEventPropagationHistory(componentId);
      }
    }
    /**
     * Whether KeyEventManager should ignore the event that is currently being handled
     * @returns {Boolean} Whether to ignore the event
     *
     * Do not override this method. Use setIgnoreEventsCondition() instead.
     * @private
     */

  }, {
    key: "_shouldIgnoreEvent",
    value: function _shouldIgnoreEvent() {
      var _this$eventPropagatio = this.eventPropagationState,
          ignoreEvent = _this$eventPropagatio.ignoreEvent,
          forceObserveEvent = _this$eventPropagatio.forceObserveEvent;
      return !forceObserveEvent && ignoreEvent;
    }
    /**
     * Returns whether this is a previously seen event bubbling up to render tree towards
     * the document root, or whether it is a new event that has not previously been seen.
     * @param {ComponentId} componentId Index of the component currently handling
     *        the keyboard event
     * @return {Boolean} If the event has been seen before
     * @private
     */

  }, {
    key: "_isNewKeyEvent",
    value: function _isNewKeyEvent(componentId) {
      var previousComponentPosition = this.eventPropagationState.previousComponentPosition;
      return previousComponentPosition === -1 || previousComponentPosition >= this._getComponentPosition(componentId);
    }
  }, {
    key: "_updateEventPropagationHistory",
    value: function _updateEventPropagationHistory(componentId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        forceReset: false
      };

      if (options.forceReset || this._isFocusTreeRoot(componentId)) {
        this._clearEventPropagationState();
      } else {
        this.eventPropagationState.previousComponentPosition = this._getComponentPosition(componentId);
      }
    }
    /**
     * Sets the ignoreEvent flag so that subsequent handlers of the same event
     * do not have to re-evaluate whether to ignore the event or not as it bubbles
     * up towards the document root
     * @param {KeyboardEvent} event The event to decide whether to ignore
     * @param {Object} options Options containing the function to use
     *        to set the ignoreEvent flag
     * @param {Function} options.ignoreEventsCondition Function used to for setting
     *        the ignoreEvent flag
     * @private
     */

  }, {
    key: "_setIgnoreEventFlag",
    value: function _setIgnoreEventFlag(event, options) {
      this.eventPropagationState.ignoreEvent = options.ignoreEventsCondition(event);
    }
  }, {
    key: "ignoreEvent",
    value: function ignoreEvent() {
      this.eventPropagationState.ignoreEvent = true;
    }
  }, {
    key: "forceObserveEvent",
    value: function forceObserveEvent() {
      this.eventPropagationState.forceObserveEvent = true;
    }
  }, {
    key: "_isFocusTreeRoot",
    value: function _isFocusTreeRoot(componentId) {
      return this._getComponentPosition(componentId) >= this.componentList.length - 1;
    }
  }, {
    key: "_setNewEventParameters",
    value: function _setNewEventParameters(event, type) {
      KeyEventCounter.incrementId();
      this.currentEvent = {
        key: event.key,
        type: type,
        handled: false,
        ignored: false
      };
    }
  }, {
    key: "_startAndLogNewKeyCombination",
    value: function _startAndLogNewKeyCombination(keyName, eventBitmapIndex, focusTreeId, componentId) {
      this._startNewKeyCombination(keyName, eventBitmapIndex);

      this.logger.verbose(this._logPrefix(componentId, {
        focusTreeId: focusTreeId
      }), "Started a new combination with '".concat(keyName, "'."));
      this.logger.verbose(this._logPrefix(componentId, {
        focusTreeId: focusTreeId
      }), "Key history: ".concat(printComponent(this.keyCombinationHistory), "."));
    }
  }, {
    key: "_addToAndLogCurrentKeyCombination",
    value: function _addToAndLogCurrentKeyCombination(keyName, eventBitmapIndex, focusTreeId, componentId) {
      this._addToCurrentKeyCombination(keyName, eventBitmapIndex);

      if (eventBitmapIndex === KeyEventBitmapIndex.keydown) {
        this.logger.verbose(this._logPrefix(componentId, {
          focusTreeId: focusTreeId
        }), "Added '".concat(keyName, "' to current combination: '").concat(this._getCurrentKeyCombination().ids[0], "'."));
      }

      this.logger.verbose(this._logPrefix(componentId, {
        focusTreeId: focusTreeId
      }), "Key history: ".concat(printComponent(this.keyCombinationHistory), "."));
    }
    /********************************************************************************
     * Event simulation
     ********************************************************************************/

  }, {
    key: "_stopEventPropagation",
    value: function _stopEventPropagation(event, componentId) {
      if (!this.eventPropagationState.stopping) {
        this.eventPropagationState.stopping = true;
        this.logger.debug(this._logPrefix(componentId), 'Stopping further event propagation.');

        if (!event.simulated) {
          event.stopPropagation();
        }
      }
    }
  }, {
    key: "_handleEventSimulation",
    value: function _handleEventSimulation(listName, handlerName, shouldSimulate, _ref) {
      var event = _ref.event,
          key = _ref.key,
          focusTreeId = _ref.focusTreeId,
          componentId = _ref.componentId,
          options = _ref.options;

      if (shouldSimulate && Configuration.option('simulateMissingKeyPressEvents')) {
        /**
         * If a key does not have a keypress event, we save the details of the keydown
         * event to simulate the keypress event, as the keydown event bubbles through
         * the last focus-only HotKeysComponent
         */
        var _event = this._cloneAndMergeEvent(event, {
          key: key,
          simulated: true
        });

        this[listName].push({
          event: _event,
          focusTreeId: focusTreeId,
          componentId: componentId,
          options: options
        });
      }

      if (this._isFocusTreeRoot(componentId) || this.eventPropagationState.stopping) {
        if (!this.keyEventManager.isGlobalListenersBound()) {
          this[handlerName]();
        }
        /**
         * else, we wait for keydown event to propagate through global strategy
         * before we simulate the keypress
         */

      }
    }
  }, {
    key: "simulatePendingKeyPressEvents",
    value: function simulatePendingKeyPressEvents() {
      this._simulatePendingKeyEvents('keypressEventsToSimulate', 'handleKeypress');
    }
  }, {
    key: "simulatePendingKeyUpEvents",
    value: function simulatePendingKeyUpEvents() {
      this._simulatePendingKeyEvents('keyupEventsToSimulate', 'handleKeyup');
    }
  }, {
    key: "_simulatePendingKeyEvents",
    value: function _simulatePendingKeyEvents(listName, handlerName) {
      var _this3 = this;

      if (this[listName].length > 0) {
        KeyEventCounter.incrementId();
      }

      this[listName].forEach(function (_ref2) {
        var event = _ref2.event,
            focusTreeId = _ref2.focusTreeId,
            componentId = _ref2.componentId,
            options = _ref2.options;

        _this3[handlerName](event, focusTreeId, componentId, options);
      });
      this[listName] = [];
      /**
       * If an event gets handled and causes a focus shift, then subsequent components
       * will ignore the event (including the root component) and the conditions to
       * reset the propagation state are never met - so we ensure that after we are done
       * simulating the keypress event, the propagation state is reset
       */

      this._clearEventPropagationState();
    }
    /********************************************************************************
     * Matching and calling handlers
     ********************************************************************************/

    /**
     * Calls the first handler that matches the current key event if the action has not
     * already been handled in a more deeply nested component
     * @param {KeyboardEvent} event Keyboard event object to be passed to the handler
     * @param {NormalizedKeyName} keyName Normalized key name
     * @param {KeyEventBitmapIndex} eventBitmapIndex The bitmap index of the current key event type
     * @param {FocusTreeId} focusTreeId Id of focus tree component thinks it's apart of
     * @param {ComponentId} componentId Index of the component that is currently handling
     *        the keyboard event
     * @private
     */

  }, {
    key: "_callHandlerIfActionNotHandled",
    value: function _callHandlerIfActionNotHandled(event, keyName, eventBitmapIndex, componentId, focusTreeId) {
      var eventName = describeKeyEventType(eventBitmapIndex);

      var combinationName = this._describeCurrentKeyCombination();

      if (this.keyMapEventBitmap[eventBitmapIndex]) {
        if (this.eventPropagationState.actionHandled) {
          this.logger.debug(this._logPrefix(componentId, {
            focusTreeId: focusTreeId
          }), "Ignored '".concat(combinationName, "' ").concat(eventName, " as it has already been handled."));
        } else {
          this.logger.verbose(this._logPrefix(componentId, {
            focusTreeId: focusTreeId
          }), "Attempting to find action matching '".concat(combinationName, "' ").concat(eventName, " . . ."));
          var previousComponentPosition = this.eventPropagationState.previousComponentPosition;

          var componentPosition = this._getComponentPosition(componentId);

          var handlerWasCalled = this._callMatchingHandlerClosestToEventTarget(event, keyName, eventBitmapIndex, componentPosition, previousComponentPosition === -1 ? 0 : previousComponentPosition);

          if (handlerWasCalled) {
            this.eventPropagationState.actionHandled = true;
            this.currentEvent.handled = true;
          }
        }
      } else {
        this.logger.verbose(this._logPrefix(componentId, {
          focusTreeId: focusTreeId
        }), "Ignored '".concat(combinationName, "' ").concat(eventName, " because it doesn't have any ").concat(eventName, " handlers."));
      }
    }
    /********************************************************************************
     * Logging
     ********************************************************************************/

  }, {
    key: "_logPrefix",
    value: function _logPrefix(componentId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var logIcons = Logger.logIcons;
      var eventIcons = Logger.eventIcons;
      var componentIcons = Logger.componentIcons;
      var base = 'HotKeys (';

      if (options.focusTreeId !== false) {
        var focusTreeId = isUndefined(options.focusTreeId) ? this.focusTreeId : options.focusTreeId;
        base += "F".concat(focusTreeId).concat(logIcons[focusTreeId % logIcons.length], "-");
      }

      if (options.eventId !== false) {
        var eventId = isUndefined(options.eventId) ? KeyEventCounter.getId() : options.eventId;
        base += "E".concat(eventId).concat(eventIcons[eventId % eventIcons.length], "-");
      }

      base += "C".concat(componentId).concat(componentIcons[componentId % componentIcons.length]);

      var position = this._getComponentPosition(componentId);

      if (!isUndefined(position)) {
        base += "-P".concat(position).concat(componentIcons[position % componentIcons.length], ":");
      }

      return "".concat(base, ")");
    }
  }]);

  return FocusOnlyKeyEventStrategy;
}(AbstractKeyEventStrategy);

export default FocusOnlyKeyEventStrategy;