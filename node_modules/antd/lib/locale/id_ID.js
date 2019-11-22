"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _id_ID = _interopRequireDefault(require("rc-pagination/lib/locale/id_ID"));

var _id_ID2 = _interopRequireDefault(require("../date-picker/locale/id_ID"));

var _id_ID3 = _interopRequireDefault(require("../time-picker/locale/id_ID"));

var _id_ID4 = _interopRequireDefault(require("../calendar/locale/id_ID"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  locale: 'id',
  Pagination: _id_ID["default"],
  DatePicker: _id_ID2["default"],
  TimePicker: _id_ID3["default"],
  Calendar: _id_ID4["default"],
  Table: {
    filterTitle: 'Saring',
    filterConfirm: 'OK',
    filterReset: 'Hapus',
    selectAll: 'Pilih semua di halaman ini',
    selectInvert: 'Balikkan pilihan di halaman ini',
    sortTitle: 'Urutkan'
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
    titles: ['', ''],
    searchPlaceholder: 'Cari',
    itemUnit: 'item',
    itemsUnit: 'item'
  },
  Upload: {
    uploading: 'Mengunggah...',
    removeFile: 'Hapus file',
    uploadError: 'Kesalahan pengunggahan',
    previewFile: 'File pratinjau',
    downloadFile: 'Unduh berkas'
  },
  Empty: {
    description: 'Tidak ada data'
  }
};
exports["default"] = _default;
//# sourceMappingURL=id_ID.js.map
