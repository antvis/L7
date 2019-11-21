"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ro_RO = _interopRequireDefault(require("rc-pagination/lib/locale/ro_RO"));

var _ro_RO2 = _interopRequireDefault(require("../date-picker/locale/ro_RO"));

var _ro_RO3 = _interopRequireDefault(require("../time-picker/locale/ro_RO"));

var _ro_RO4 = _interopRequireDefault(require("../calendar/locale/ro_RO"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  locale: 'ro',
  Pagination: _ro_RO["default"],
  DatePicker: _ro_RO2["default"],
  TimePicker: _ro_RO3["default"],
  Calendar: _ro_RO4["default"],
  global: {
    placeholder: 'Selectează'
  },
  Table: {
    filterTitle: 'Filtrează',
    filterConfirm: 'OK',
    filterReset: 'Resetează',
    selectAll: 'Selectează pagina curentă',
    selectInvert: 'Inversează pagina curentă',
    sortTitle: 'Ordonează',
    expand: 'Extinde rândul',
    collapse: 'Micșorează rândul'
  },
  Modal: {
    okText: 'OK',
    cancelText: 'Anulare',
    justOkText: 'OK'
  },
  Popconfirm: {
    okText: 'OK',
    cancelText: 'Anulare'
  },
  Transfer: {
    titles: ['', ''],
    searchPlaceholder: 'Căutare',
    itemUnit: 'element',
    itemsUnit: 'elemente'
  },
  Upload: {
    uploading: 'Se transferă...',
    removeFile: 'Înlătură fișierul',
    uploadError: 'Eroare la upload',
    previewFile: 'Previzualizare fișier',
    downloadFile: 'Descărcare fișier'
  },
  Empty: {
    description: 'Fără date'
  },
  Icon: {
    icon: 'icon'
  },
  Text: {
    edit: 'editează',
    copy: 'copiază',
    copied: 'copiat',
    expand: 'extinde'
  },
  PageHeader: {
    back: 'înapoi'
  }
};
exports["default"] = _default;
//# sourceMappingURL=ro_RO.js.map
