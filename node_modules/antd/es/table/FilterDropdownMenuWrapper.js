import * as React from 'react';

var FilterDropdownMenuWrapper = function FilterDropdownMenuWrapper(props) {
  return React.createElement("div", {
    className: props.className,
    onClick: function onClick(e) {
      return e.stopPropagation();
    }
  }, props.children);
};

export default FilterDropdownMenuWrapper;
//# sourceMappingURL=FilterDropdownMenuWrapper.js.map
