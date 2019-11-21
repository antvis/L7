'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = shallow;

var _ShallowWrapper = require('./ShallowWrapper');

var _ShallowWrapper2 = _interopRequireDefault(_ShallowWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Shallow renders a react component and provides a testing wrapper around it.
 *
 * @param node
 * @returns {ShallowWrapper}
 */
function shallow(node, options) {
  return new _ShallowWrapper2['default'](node, null, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9zaGFsbG93LmpzIl0sIm5hbWVzIjpbInNoYWxsb3ciLCJub2RlIiwib3B0aW9ucyIsIlNoYWxsb3dXcmFwcGVyIl0sIm1hcHBpbmdzIjoiOzs7OztxQkFRd0JBLE87O0FBUnhCOzs7Ozs7QUFFQTs7Ozs7O0FBTWUsU0FBU0EsT0FBVCxDQUFpQkMsSUFBakIsRUFBdUJDLE9BQXZCLEVBQWdDO0FBQzdDLFNBQU8sSUFBSUMsMkJBQUosQ0FBbUJGLElBQW5CLEVBQXlCLElBQXpCLEVBQStCQyxPQUEvQixDQUFQO0FBQ0QiLCJmaWxlIjoic2hhbGxvdy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaGFsbG93V3JhcHBlciBmcm9tICcuL1NoYWxsb3dXcmFwcGVyJztcblxuLyoqXG4gKiBTaGFsbG93IHJlbmRlcnMgYSByZWFjdCBjb21wb25lbnQgYW5kIHByb3ZpZGVzIGEgdGVzdGluZyB3cmFwcGVyIGFyb3VuZCBpdC5cbiAqXG4gKiBAcGFyYW0gbm9kZVxuICogQHJldHVybnMge1NoYWxsb3dXcmFwcGVyfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaGFsbG93KG5vZGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG5ldyBTaGFsbG93V3JhcHBlcihub2RlLCBudWxsLCBvcHRpb25zKTtcbn1cbiJdfQ==
//# sourceMappingURL=shallow.js.map