"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _hr_HR = _interopRequireDefault(require("rc-pagination/lib/locale/hr_HR"));

var _hr_HR2 = _interopRequireDefault(require("../date-picker/locale/hr_HR"));

var _hr_HR3 = _interopRequireDefault(require("../time-picker/locale/hr_HR"));

var _hr_HR4 = _interopRequireDefault(require("../calendar/locale/hr_HR"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  locale: 'hr',
  Pagination: _hr_HR["default"],
  DatePicker: _hr_HR2["default"],
  TimePicker: _hr_HR3["default"],
  Calendar: _hr_HR4["default"],
  global: {
    placeholder: 'Molimo označite'
  },
  Table: {
    filterTitle: 'Filter meni',
    filterConfirm: 'OK',
    filterReset: 'Reset',
    selectAll: 'Označi trenutnu stranicu',
    selectInvert: 'Invertiraj trenutnu stranicu',
    sortTitle: 'Sortiraj'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Odustani',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Odustani'
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Pretraži ovdje',
    itemUnit: 'stavka',
    itemsUnit: 'stavke'
  },
  Upload: {
    uploading: 'Upload u tijeku...',
    removeFile: 'Makni datoteku',
    uploadError: 'Greška kod uploada',
    previewFile: 'Pogledaj datoteku',
    downloadFile: 'Preuzmi datoteku'
  },
  Empty: {
    description: 'Nema podataka'
  },
  Icon: {
    icon: 'ikona'
  },
  Text: {
    edit: 'uredi',
    copy: 'kopiraj',
    copied: 'kopiranje uspješno',
    expand: 'proširi'
  }
};
exports["default"] = _default;
//# sourceMappingURL=hr_HR.js.map
