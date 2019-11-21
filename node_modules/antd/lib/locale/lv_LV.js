"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lv_LV = _interopRequireDefault(require("rc-pagination/lib/locale/lv_LV"));

var _lv_LV2 = _interopRequireDefault(require("../date-picker/locale/lv_LV"));

var _lv_LV3 = _interopRequireDefault(require("../time-picker/locale/lv_LV"));

var _lv_LV4 = _interopRequireDefault(require("../calendar/locale/lv_LV"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  locale: 'lv',
  Pagination: _lv_LV["default"],
  DatePicker: _lv_LV2["default"],
  TimePicker: _lv_LV3["default"],
  Calendar: _lv_LV4["default"],
  Table: {
    filterTitle: 'Filtrēšanas izvēlne',
    filterConfirm: 'OK',
    filterReset: 'Atiestatīt',
    selectAll: 'Atlasiet pašreizējo lapu',
    selectInvert: 'Pārvērst pašreizējo lapu'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Atcelt',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Atcelt'
  },
  Transfer: {
    searchPlaceholder: 'Meklēt šeit',
    itemUnit: 'vienumu',
    itemsUnit: 'vienumus'
  },
  Upload: {
    uploading: 'Augšupielāde...',
    removeFile: 'Noņemt failu',
    uploadError: 'Augšupielādes kļūda',
    previewFile: 'Priekšskatiet failu',
    downloadFile: 'Lejupielādēt failu'
  },
  Empty: {
    description: 'Nav datu'
  }
};
exports["default"] = _default;
//# sourceMappingURL=lv_LV.js.map
