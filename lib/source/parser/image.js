"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = image;

var _ajax = require("../../util/ajax");

function image(data, cfg) {
  var extent = cfg.extent;
  var images = new Promise(function (resolve) {
    loadData(data, function (res) {
      resolve(res);
    });
  });
  var resultData = {
    images: images,
    _id: 1,
    dataArray: [{
      coordinates: [[extent[0], extent[1]], [extent[2], extent[3]]]
    }]
  };
  return resultData;
}

function loadData(data, done) {
  var url = data;
  var image = [];

  if (typeof url === 'string') {
    (0, _ajax.getImage)({
      url: url
    }, function (err, img) {
      image = img;
      done(image);
    });
  } else {
    var imageCount = url.length;
    var imageindex = 0;
    url.forEach(function (item) {
      (0, _ajax.getImage)({
        url: item
      }, function (err, img) {
        imageindex++;
        image.push(img);

        if (imageindex === imageCount) {
          done(image);
        }
      });
    });
  }

  return image;
}