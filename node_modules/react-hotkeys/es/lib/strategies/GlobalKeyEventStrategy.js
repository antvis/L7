function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

import KeyEventBitmapManager from '../KeyEventBitmapManager';
import KeyEventBitmapIndex from '../../const/KeyEventBitmapIndex';
import AbstractKeyEventStrategy from './AbstractKeyEventStrategy';
import capitalize from '../../utils/string/capitalize';
import describeKeyEventType from '../../helpers/logging/describeKeyEventType';
import KeyEventCounter from '../KeyEventCounter';
import Logger from '../Logger';
import removeAtIndex from '../../utils/array/removeAtIndex';
import isUndefined from '../../utils/isUndefined';
import getEventKey from '../../vendor/react-dom/getEventKey';
import printComponent from '../../helpers/logging/printComponent';
import normalizeKeyName from '../../helpers/resolving-handlers/normalizeKeyName';
import Configuration from '../Configuration';
import describeKeyEvent from '../../helpers/logging/describeKeyEvent';
import isCmdKey from '../../helpers/parsing-key-maps/isCmdKey';
import EventResponse from '../../const/EventResponse';
import contains from '../../utils/collection/contains';
/**
 * Defines behaviour for dealing with key maps defined in global HotKey components
 * @class
 */

var GlobalKeyEventStrategy =
/*#__PURE__*/
function (_AbstractKeyEventStra) {
  _inherits(GlobalKeyEventStrategy, _AbstractKeyEventStra);

  /********************************************************************************
   * Init & Reset
   ********************************************************************************/
  function GlobalKeyEventStrategy() {
    var _this;

    var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var keyEventManager = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, GlobalKeyEventStrategy);

    /**
     * Set state that gets cleared every time a component gets mounted or unmounted
     */
    _this = _possibleConstructorReturn(this, _getPrototypeOf(GlobalKeyEventStrategy).call(this, configuration, keyEventManager));
    /**
     * Set state that doesn't get cleared each time a new new component is mounted
     * or unmounted
     * @type {number}
     */

    /**
     * Whether the global key event handlers have been bound to document yet or not
     * @type {boolean}
     */

    _this.listenersBound = false;
    _this.eventOptions = {
      ignoreEventsCondition: Configuration.option('ignoreEventsCondition')
    };
    return _this;
  }
  /********************************************************************************
   * Enabling key maps and handlers
   ********************************************************************************/

  /**
   * Registers the actions and handlers of a HotKeys component that has mounted
   * @param {ComponentId} componentId - Id of the component that the keyMap belongs to
   * @param {KeyMap} actionNameToKeyMap - Map of actions to key expressions
   * @param {HandlersMap} actionNameToHandlersMap - Map of actions to handler functions
   * @param {Object} options Hash of options that configure how the actions
   *        and handlers are associated and called.
   * @param {Object} eventOptions - Options for how the event should be handled
   */


  _createClass(GlobalKeyEventStrategy, [{
    key: "enableHotKeys",
    value: function enableHotKeys(componentId) {
      var actionNameToKeyMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var actionNameToHandlersMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 ? arguments[3] : undefined;
      var eventOptions = arguments.length > 4 ? arguments[4] : undefined;
      this.eventOptions = eventOptions;

      this._addComponentToList(componentId, actionNameToKeyMap, actionNameToHandlersMap, options);

      this._updateDocumentHandlers();

      this.logger.debug(this._logPrefix(componentId, {
        eventId: false
      }), 'Mounted.');
      this.logger.verbose(this._logPrefix(componentId, {
        eventId: false
      }), 'Component options: \n', printComponent(this._getComponent(componentId)));
    }
    /**
     * Handles when a mounted global HotKeys component updates its props and changes
     * either the keyMap or handlers prop value
     * @param {ComponentId} componentId - The component index of the component to
     *        update
     * @param {KeyMap} actionNameToKeyMap - Map of actions to key expressions
     * @param {HandlersMap} actionNameToHandlersMap - Map of actions to handler functions
     * @param {Object} options Hash of options that configure how the actions
     *        and handlers are associated and called.
     * @param {Object} eventOptions - Options for how the event should be handled
     */

  }, {
    key: "updateEnabledHotKeys",
    value: function updateEnabledHotKeys(componentId) {
      var actionNameToKeyMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var actionNameToHandlersMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = arguments.length > 3 ? arguments[3] : undefined;
      var eventOptions = arguments.length > 4 ? arguments[4] : undefined;
      this.eventOptions = eventOptions;

      var componentPosition = this._getComponentPosition(componentId);
      /**
       * Manually update the registered key map state, usually reset using
       * _resetRegisteredKeyMapsState() method
       */


      this.componentList[componentPosition] = this._buildComponentOptions(componentId, actionNameToKeyMap, actionNameToHandlersMap, options);

      this._updateLongestKeySequenceIfNecessary(componentId);
      /**
       * Reset strategy state specific to the global strategy
       */


      this._updateDocumentHandlers();
      /**
       * Reset handler resolution state
       */


      this._initHandlerResolutionState();

      this.logger.debug(this._logPrefix(componentId, {
        eventId: false
      }), "Global component ".concat(componentId, " updated."));
      this.logger.verbose(this._logPrefix(componentId, {
        eventId: false
      }), 'Component options: \n', printComponent(this._getComponent(componentId)));
    }
    /**
     * Handles when a component is unmounted
     * @param {ComponentId} componentId - Index of component that is being unmounted
     */

  }, {
    key: "disableHotKeys",
    value: function disableHotKeys(componentId) {
      var _this$_getComponentAn = this._getComponentAndPosition(componentId),
          _this$_getComponentAn2 = _slicedToArray(_this$_getComponentAn, 2),
          keyMapEventBitmap = _this$_getComponentAn2[0].keyMapEventBitmap,
          componentPosition = _this$_getComponentAn2[1];
      /**
       * Manually update the registered key map state, usually reset using
       * _resetRegisteredKeyMapsState() method
       */


      this.componentList = removeAtIndex(this.componentList, componentPosition);

      this._updateLongestKeySequenceIfNecessary(componentId);
      /**
       * Reset strategy state specific to the global strategy
       */


      this._updateComponentIndexDictFromList({
        startingAt: componentPosition
      });

      this._updateDocumentHandlers(keyMapEventBitmap, KeyEventBitmapManager.newBitmap());
      /**
       * Reset handler resolution state
       */


      this._initHandlerResolutionState();

      this.logger.debug(this._logPrefix(componentId, {
        eventId: false
      }), "Unmounted global component ".concat(componentId));
    }
  }, {
    key: "_updateLongestKeySequenceIfNecessary",
    value: function _updateLongestKeySequenceIfNecessary(componentId) {
      var _this2 = this;

      if (componentId === this.longestSequenceComponentIndex) {
        this.longestSequence = 1;
        this.componentList.forEach(function (_ref) {
          var longestSequence = _ref.longestSequence;

          if (longestSequence > _this2.longestSequence) {
            _this2.longestSequence = longestSequence;
          }
        });
      }
    }
  }, {
    key: "_updateComponentIndexDictFromList",
    value: function _updateComponentIndexDictFromList() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        startingAt: 0
      };
      var counter = options.startingAt;

      while (counter < this.componentList.length) {
        this._setComponentPosition(this.componentList[counter].componentId, counter);

        counter++;
      }
    }
  }, {
    key: "_updateDocumentHandlers",
    value: function _updateDocumentHandlers() {
      var _this3 = this;

      var listenersShouldBeBound = this.keyMapEventBitmap.some(function (eventType) {
        return eventType;
      });

      if (!this.listenersBound && listenersShouldBeBound) {
        var _loop = function _loop(bitmapIndex) {
          var eventName = describeKeyEventType(bitmapIndex);

          document["on".concat(eventName)] = function (keyEvent) {
            _this3.keyEventManager["handleGlobal".concat(capitalize(eventName))](keyEvent);
          };

          _this3.logger.debug(_this3._logPrefix(_this3.componentId, {
            eventId: false
          }), "Bound handler handleGlobal".concat(capitalize(eventName), "() to document.on").concat(eventName, "()"));
        };

        for (var bitmapIndex = 0; bitmapIndex < this.keyMapEventBitmap.length; bitmapIndex++) {
          _loop(bitmapIndex);
        }

        this.listenersBound = true;
      } else if (this.listenersBound && !listenersShouldBeBound) {
        for (var bitmapIndex = 0; bitmapIndex < this.keyMapEventBitmap.length; bitmapIndex++) {
          var eventName = describeKeyEventType(bitmapIndex);
          delete document["on".concat(eventName)];
          this.logger.debug(this._logPrefix(this.componentId, {
            eventId: false
          }), "Removed handler handleGlobal".concat(capitalize(eventName), "() from document.on").concat(eventName, "()"));
        }

        this.listenersBound = false;
      }
    }
    /********************************************************************************
     * Recording key events
     ********************************************************************************/

    /**
     * Records a keydown keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called once when a keyboard event bubbles up to document, and checks
     * the keymaps for all of the mounted global HotKey components.
     * @param {KeyboardEvent} event - Event containing the key name and state
     */

  }, {
    key: "handleKeydown",
    value: function handleKeydown(event) {
      this._checkForModifierFlagDiscrepancies(event);

      var _key = normalizeKeyName(getEventKey(event));

      var reactAppResponse = this._howReactAppRespondedTo(event, _key, KeyEventBitmapIndex.keydown);

      if (reactAppResponse === EventResponse.unseen && this.eventOptions.ignoreEventsCondition(event)) {
        this.logger.debug(this._logPrefix(), "Ignored ".concat(describeKeyEvent(event, _key, KeyEventBitmapIndex.keydown), " event because ignoreEventsFilter rejected it."));
        return;
      }

      if (reactAppResponse !== EventResponse.ignored) {
        var keyInCurrentCombination = !!this._getCurrentKeyState(_key);

        if (keyInCurrentCombination || this.keyCombinationIncludesKeyUp) {
          this._startAndLogNewKeyCombination(_key, KeyEventBitmapIndex.keydown);
        } else {
          this._addToAndLogCurrentKeyCombination(_key, KeyEventBitmapIndex.keydown);
        }
      }

      if (!contains([EventResponse.ignored, EventResponse.handled], reactAppResponse)) {
        this._callHandlerIfExists(event, _key, KeyEventBitmapIndex.keydown);
      }

      this._simulateKeyPressesMissingFromBrowser(event, _key);
    }
  }, {
    key: "_howReactAppRespondedTo",
    value: function _howReactAppRespondedTo(event, key, eventBitmapIndex) {
      var reactAppHistoryWithEvent = this.keyEventManager.reactAppHistoryWithEvent(key, eventBitmapIndex);

      switch (reactAppHistoryWithEvent) {
        case EventResponse.handled:
          this.logger.debug(this._logPrefix(), "Ignored ".concat(describeKeyEvent(event, key, eventBitmapIndex), " event because React app has already handled it."));
          break;

        case EventResponse.ignored:
          this.logger.debug(this._logPrefix(), "Ignored ".concat(describeKeyEvent(event, key, eventBitmapIndex), " event because React app has declared it should be ignored."));
          break;

        case EventResponse.seen:
          this.logger.debug(this._logPrefix(), "Received ".concat(describeKeyEvent(event, key, eventBitmapIndex), " event (that has already passed through React app)."));
          break;

        default:
          KeyEventCounter.incrementId();
          this.logger.debug(this._logPrefix(), "New ".concat(describeKeyEvent(event, key, eventBitmapIndex), " event (that has NOT passed through React app)."));
      }

      return reactAppHistoryWithEvent;
    }
    /**
     * Records a keypress keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called once when a keyboard event bubbles up to document, and checks
     * the keymaps for all of the mounted global HotKey components.
     * @param {KeyboardEvent} event - Event containing the key name and state
     */

  }, {
    key: "handleKeypress",
    value: function handleKeypress(event) {
      var key = normalizeKeyName(getEventKey(event));
      /**
       * We first decide if the keypress event should be handled (to ensure the correct
       * order of logging statements)
       */

      var reactAppResponse = this._howReactAppRespondedTo(event, key, KeyEventBitmapIndex.keypress);
      /**
       * Add new key event to key combination history
       */


      if (this._getCurrentKeyState(key)) {
        this._addToAndLogCurrentKeyCombination(key, KeyEventBitmapIndex.keypress);
      }

      if (reactAppResponse === EventResponse.unseen && this.eventOptions.ignoreEventsCondition(event)) {
        this.logger.debug(this._logPrefix(), "Ignored ".concat(describeKeyEvent(event, key, KeyEventBitmapIndex.keypress), " event because ignoreEventsFilter rejected it."));
        return;
      }

      if (!contains([EventResponse.ignored, EventResponse.handled], reactAppResponse)) {
        this._callHandlerIfExists(event, key, KeyEventBitmapIndex.keypress);
      }
    }
    /**
     * Records a keyup keyboard event and matches it against the list of pre-registered
     * event handlers, calling the first matching handler with the highest priority if
     * one exists.
     *
     * This method is called once when a keyboard event bubbles up to document, and checks
     * the keymaps for all of the mounted global HotKey components.
     * @param {KeyboardEvent} event - Event containing the key name and state
     */

  }, {
    key: "handleKeyup",
    value: function handleKeyup(event) {
      var key = normalizeKeyName(getEventKey(event));
      /**
       * We first decide if the keyup event should be handled (to ensure the correct
       * order of logging statements)
       */

      var reactAppResponse = this._howReactAppRespondedTo(event, key, KeyEventBitmapIndex.keyup);
      /**
       * We then add the keyup to our current combination - regardless of whether
       * it's to be handled or not. We need to do this to ensure that if a handler
       * function changes focus to a context that ignored events, the keyup event
       * is not lost (leaving react hotkeys thinking the key is still pressed).
       */


      if (this._getCurrentKeyState(key)) {
        this._addToAndLogCurrentKeyCombination(key, KeyEventBitmapIndex.keyup);
      }

      if (reactAppResponse === EventResponse.unseen && this.eventOptions.ignoreEventsCondition(event)) {
        this.logger.debug(this._logPrefix(), "Ignored ".concat(describeKeyEvent(event, key, KeyEventBitmapIndex.keyup), " event because ignoreEventsFilter rejected it."));
      } else {
        /**
         * We attempt to find a handler of the event, only if it has not already
         * been handled and should not be ignored
         */
        if (!contains([EventResponse.ignored, EventResponse.handled], reactAppResponse)) {
          this._callHandlerIfExists(event, key, KeyEventBitmapIndex.keyup);
        }
      }
      /**
       * We simulate any hidden keyup events hidden by the command key, regardless
       * of whether the event should be ignored or not
       */


      this._simulateKeyUpEventsHiddenByCmd(event, key);
    }
  }, {
    key: "_simulateKeyPressesMissingFromBrowser",
    value: function _simulateKeyPressesMissingFromBrowser(event, key) {
      this.keyEventManager.simulatePendingKeyPressEvents();

      this._handleEventSimulation('handleKeypress', this._shouldSimulate(KeyEventBitmapIndex.keypress, key), {
        event: event,
        key: key
      });
    }
  }, {
    key: "_simulateKeyUpEventsHiddenByCmd",
    value: function _simulateKeyUpEventsHiddenByCmd(event, key) {
      var _this4 = this;

      if (isCmdKey(key)) {
        /**
         * We simulate pending key events in the React app before we do it globally
         */
        this.keyEventManager.simulatePendingKeyUpEvents();
        Object.keys(this._getCurrentKeyCombination().keys).forEach(function (keyName) {
          if (isCmdKey(keyName)) {
            return;
          }

          _this4._handleEventSimulation('handleKeyup', _this4._shouldSimulate(KeyEventBitmapIndex.keyup, keyName), {
            event: event,
            key: keyName
          });
        });
      }
    }
  }, {
    key: "_startAndLogNewKeyCombination",
    value: function _startAndLogNewKeyCombination(keyName, eventBitmapIndex) {
      this._startNewKeyCombination(keyName, eventBitmapIndex);

      this.logger.verbose(this._logPrefix(), "Started a new combination with '".concat(keyName, "'."));
      this.logger.verbose(this._logPrefix(), "Key history: ".concat(printComponent(this.keyCombinationHistory), "."));
    }
  }, {
    key: "_addToAndLogCurrentKeyCombination",
    value: function _addToAndLogCurrentKeyCombination(keyName, eventBitmapIndex) {
      this._addToCurrentKeyCombination(keyName, eventBitmapIndex);

      if (eventBitmapIndex === KeyEventBitmapIndex.keydown) {
        this.logger.verbose(this._logPrefix(), "Added '".concat(keyName, "' to current combination: '").concat(this._getCurrentKeyCombination().ids[0], "'."));
      }

      this.logger.verbose(this._logPrefix(), "Key history: ".concat(printComponent(this.keyCombinationHistory), "."));
    }
    /********************************************************************************
     * Event simulation
     ********************************************************************************/

  }, {
    key: "_handleEventSimulation",
    value: function _handleEventSimulation(handlerName, shouldSimulate, _ref2) {
      var event = _ref2.event,
          key = _ref2.key;

      if (shouldSimulate && Configuration.option('simulateMissingKeyPressEvents')) {
        /**
         * If a key does not have a keypress event, we simulate one immediately after
         * the keydown event, to keep the behaviour consistent across all keys
         */
        var _event = this._cloneAndMergeEvent(event, {
          key: key,
          simulated: true
        });

        this[handlerName](_event);
      }
    }
    /********************************************************************************
     * Matching and calling handlers
     ********************************************************************************/

  }, {
    key: "_callHandlerIfExists",
    value: function _callHandlerIfExists(event, keyName, eventBitmapIndex) {
      var eventName = describeKeyEventType(eventBitmapIndex);

      var combinationName = this._describeCurrentKeyCombination();

      if (this.keyMapEventBitmap[eventBitmapIndex]) {
        /**
         * If there is at least one handler for the specified key event type (keydown,
         * keypress, keyup), then attempt to find a handler that matches the current
         * key combination
         */
        this.logger.verbose(this._logPrefix(), "Attempting to find action matching '".concat(combinationName, "' ").concat(eventName, " . . ."));

        this._callMatchingHandlerClosestToEventTarget(event, keyName, eventBitmapIndex);
      } else {
        /**
         * If there are no handlers registered for the particular key event type
         * (keydown, keypress, keyup) then skip trying to find a matching handler
         * for the current key combination
         */
        this.logger.debug(this._logPrefix(), "Ignored '".concat(combinationName, "' ").concat(eventName, " because it doesn't have any ").concat(eventName, " handlers."));
      }
    }
  }, {
    key: "_callMatchingHandlerClosestToEventTarget",
    value: function _callMatchingHandlerClosestToEventTarget(event, keyName, eventBitmapIndex) {
      for (var componentPosition = 0; componentPosition < this.componentList.length; componentPosition++) {
        var matchFound = _get(_getPrototypeOf(GlobalKeyEventStrategy.prototype), "_callMatchingHandlerClosestToEventTarget", this).call(this, event, keyName, eventBitmapIndex, componentPosition, 0);

        if (matchFound) {
          this.logger.debug(this._logPrefix(), "Searching no further, as handler has been found (and called).");
          return;
        }
      }
    }
  }, {
    key: "_stopEventPropagation",
    value: function _stopEventPropagation(event, componentId) {
      this.logger.debug(this._logPrefix(componentId), 'Stopping further event propagation.');

      if (!event.simulated) {
        event.stopPropagation();
      }
    }
    /********************************************************************************
     * Logging
     ********************************************************************************/

  }, {
    key: "_logPrefix",
    value: function _logPrefix(componentId) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var eventIcons = Logger.eventIcons;
      var componentIcons = Logger.componentIcons;
      var base = 'HotKeys (GLOBAL';

      if (options.eventId !== false) {
        var eventId = isUndefined(options.eventId) ? KeyEventCounter.getId() : options.eventId;
        base = "".concat(base, "-E").concat(eventId).concat(eventIcons[eventId % eventIcons.length]);
      }

      if (isUndefined(componentId)) {
        return "".concat(base, "):");
      } else {
        return "".concat(base, "-C").concat(componentId).concat(componentIcons[componentId % componentIcons.length], "):");
      }
    }
  }]);

  return GlobalKeyEventStrategy;
}(AbstractKeyEventStrategy);

export default GlobalKeyEventStrategy;