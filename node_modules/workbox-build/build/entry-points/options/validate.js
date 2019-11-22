"use strict";

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
module.exports = (options, schema) => {
  const _schema$validate = schema.validate(options, {
    language: {
      object: {
        allowUnknown: 'is not a supported parameter.'
      }
    }
  }),
        value = _schema$validate.value,
        error = _schema$validate.error;

  if (error) {
    throw error;
  }

  return value;
};