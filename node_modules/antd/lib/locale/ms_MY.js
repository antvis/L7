"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ms_MY = _interopRequireDefault(require("rc-pagination/lib/locale/ms_MY"));

var _ms_MY2 = _interopRequireDefault(require("../date-picker/locale/ms_MY"));

var _ms_MY3 = _interopRequireDefault(require("../time-picker/locale/ms_MY"));

var _ms_MY4 = _interopRequireDefault(require("../calendar/locale/ms_MY"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  locale: 'ms-my',
  Pagination: _ms_MY["default"],
  DatePicker: _ms_MY2["default"],
  TimePicker: _ms_MY3["default"],
  Calendar: _ms_MY4["default"],
  global: {
    placeholder: 'Sila pilih'
  },
  PageHeader: {
    back: 'Kembali'
  },
  Text: {
    edit: 'Sunting',
    copy: 'Salin',
    copied: 'Berjaya menyalin',
    expand: 'Kembang'
  },
  Empty: {
    description: 'Tiada data'
  },
  Table: {
    filterTitle: 'Cari dengan tajuk',
    filterConfirm: 'Ok',
    filterReset: 'Menetapkan semula',
    emptyText: 'Tiada data',
    selectAll: 'Pilih semua',
    selectInvert: 'Terbalikkan'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Batal',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Batal'
  },
  Transfer: {
    notFoundContent: 'Tidak dijumpai',
    searchPlaceholder: 'Carian di sini',
    itemUnit: 'item',
    itemsUnit: 'item'
  },
  Icon: {
    icon: 'ikon'
  },
  Select: {
    notFoundContent: 'Tidak Dijumpai'
  },
  Upload: {
    uploading: 'Sedang memuat naik...',
    removeFile: 'Buang fail',
    uploadError: 'Masalah muat naik',
    previewFile: 'Tengok fail',
    downloadFile: 'Muat turun fail'
  }
};
exports["default"] = _default;
//# sourceMappingURL=ms_MY.js.map
