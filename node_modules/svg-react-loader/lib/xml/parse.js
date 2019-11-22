var R      = require('ramda');
var Rx     = require('rx');
var xml2js = require('xml2js');

var TAGNAME_KEY = require('./xml2js-name-key');

module.exports = R.curry(function xml (opts, source) {
    var options   = require('./options')(opts);
    var pickKeys  = R.pick([TAGNAME_KEY, options.attrkey, options.childkey]);
    var parser    = new xml2js.Parser(options);

    return Rx.Observable.create(function (observer) {
        var disposed = false;
        var data;

        parser.parseString(source, function (error, result) {
            if (disposed) {
                return;
            }

            if (error) {
                observer.onError(error);
            }
            else {
                data = pickKeys(result);
                observer.onNext(data);
                observer.onCompleted();
            }
        });

        return Rx.Disposable.create(function () {
            if (!disposed) {
                disposed = true;
            }
        });
    });
});
