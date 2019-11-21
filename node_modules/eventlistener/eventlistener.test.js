suite('eventListener', function () {
	var callback = function () {};

	suite('add', function () {
		test('should use addEventListener when it exists', function () {
			var el = {addEventListener: sinon.spy()};
			eventListener.add(el, 'click', callback, false);
			assert(el.addEventListener.calledOnce);
			assert(el.addEventListener.calledWith('click', callback, false));
		});

		test('should fallback to attachEvent when addEventListener is missing', function () {
			var el = {attachEvent: sinon.spy()};
			eventListener.add(el, 'click', callback, false);
			assert(el.attachEvent.calledOnce);
			assert(el.attachEvent.calledWith('onclick', callback));
		});
	});

	suite('remove', function () {
		test('should use removeEventListener when it exists', function () {
			var el = {removeEventListener: sinon.spy()};
			eventListener.remove(el, 'click', callback, false);
			assert(el.removeEventListener.calledOnce);
			assert(el.removeEventListener.calledWith('click', callback, false));
		});

		test('should fallback to detachEvent when removeEventListener is missing', function () {
			var el = {detachEvent: sinon.spy()};
			eventListener.remove(el, 'click', callback, false);
			assert(el.detachEvent.calledOnce);
			assert(el.detachEvent.calledWith('onclick', callback));
		});
	});
});