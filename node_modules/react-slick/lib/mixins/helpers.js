'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _trackHelper = require('./trackHelper');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _innerSliderUtils = require('../utils/innerSliderUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers = {
  update: function update(props) {
    var recursionLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var slickList = _reactDom2.default.findDOMNode(this.list);
    var slideCount = _react2.default.Children.count(props.children);
    var listWidth = (0, _innerSliderUtils.getWidth)(slickList);
    var trackWidth = (0, _innerSliderUtils.getWidth)(_reactDom2.default.findDOMNode(this.track));
    var slideWidth;

    if (!props.vertical) {
      var centerPaddingAdj = props.centerMode && parseInt(props.centerPadding) * 2;
      if (props.centerPadding.slice(-1) === '%') {
        centerPaddingAdj *= listWidth / 100;
      }
      slideWidth = Math.ceil(((0, _innerSliderUtils.getWidth)(slickList) - centerPaddingAdj) / props.slidesToShow);
    } else {
      slideWidth = Math.ceil((0, _innerSliderUtils.getWidth)(slickList));
    }

    var slideHeight = (0, _innerSliderUtils.getHeight)(slickList.querySelector('[data-index="0"]'));
    var listHeight = slideHeight * props.slidesToShow;

    // pause slider if autoplay is set to false
    if (!props.autoplay) {
      this.pause();
    } else {
      this.autoPlay(props.autoplay);
    }

    var slidesToLoad = (0, _innerSliderUtils.getOnDemandLazySlides)({}, this.props, this.state);
    if (slidesToLoad.length > 0 && this.props.onLazyLoad) {
      this.props.onLazyLoad(slidesToLoad);
    }
    var prevLazyLoadedList = this.state.lazyLoadedList;
    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      slideHeight: slideHeight,
      listHeight: listHeight,
      lazyLoadedList: prevLazyLoadedList.concat(slidesToLoad)
    }, function () {
      if (!slideWidth) {
        if (recursionLevel < 2) {
          this.update(this.props, recursionLevel + 1);
        }
      }
      var targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });
    });
  },
  adaptHeight: function adaptHeight() {
    if (this.props.adaptiveHeight) {
      var selector = '[data-index="' + this.state.currentSlide + '"]';
      if (this.list) {
        var slickList = _reactDom2.default.findDOMNode(this.list);
        var elem = slickList.querySelector(selector) || {};
        slickList.style.height = (elem.offsetHeight || 0) + 'px';
      }
    }
  },
  slideHandler: function slideHandler(index) {
    var _this = this;

    // index is target slide index
    // Functionality of animateSlide and postSlide is merged into this function
    var animationTargetSlide, finalTargetSlide;
    var animationTargetLeft, finalTargetLeft;
    var callback;

    if (this.props.waitForAnimate && this.state.animating) {
      return;
    }

    if (this.props.fade) {
      finalTargetSlide = this.state.currentSlide;

      // Don't change slide if infinite=false and target slide is out of range
      if (this.props.infinite === false && (index < 0 || index >= this.state.slideCount)) {
        return;
      }

      //  Shifting animationTargetSlide back into the range
      if (index < 0) {
        animationTargetSlide = index + this.state.slideCount;
      } else if (index >= this.state.slideCount) {
        animationTargetSlide = index - this.state.slideCount;
      } else {
        animationTargetSlide = index;
      }

      if (this.props.lazyLoad && this.state.lazyLoadedList.indexOf(animationTargetSlide) < 0) {
        this.setState(function (prevState, props) {
          return { lazyLoadedList: prevState.lazyLoadedList.concat(animationTargetSlide) };
        });
        if (this.props.onLazyLoad) {
          this.props.onLazyLoad([animationTargetSlide]);
        }
      }

      callback = function callback() {
        _this.setState({
          animating: false
        });
        if (_this.props.afterChange) {
          _this.props.afterChange(animationTargetSlide);
        }
        delete _this.animationEndCallback;
      };

      this.setState({
        animating: true,
        currentSlide: animationTargetSlide
      }, function () {
        if (_this.props.asNavFor && _this.props.asNavFor.innerSlider.state.currentSlide !== _this.state.currentSlide) {
          _this.props.asNavFor.innerSlider.slideHandler(index);
        }
        _this.animationEndCallback = setTimeout(callback, _this.props.speed);
      });

      if (this.props.beforeChange) {
        this.props.beforeChange(this.state.currentSlide, animationTargetSlide);
      }

      this.autoPlay();
      return;
    }

    animationTargetSlide = index;

    /*
      @TODO: Make sure to leave no bug in the code below
      start: critical checkpoint
    */
    if (animationTargetSlide < 0) {
      if (this.props.infinite === false) {
        finalTargetSlide = 0;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        finalTargetSlide = this.state.slideCount - this.state.slideCount % this.props.slidesToScroll;
      } else {
        finalTargetSlide = this.state.slideCount + animationTargetSlide;
      }
    } else if (this.props.centerMode && animationTargetSlide >= this.state.slideCount) {
      if (this.props.infinite === false) {
        animationTargetSlide = this.state.slideCount - 1;
        finalTargetSlide = this.state.slideCount - 1;
      } else {
        animationTargetSlide = this.state.slideCount;
        finalTargetSlide = 0;
      }
    } else if (animationTargetSlide >= this.state.slideCount) {
      if (this.props.infinite === false) {
        finalTargetSlide = this.state.slideCount - this.props.slidesToShow;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        finalTargetSlide = 0;
      } else {
        finalTargetSlide = animationTargetSlide - this.state.slideCount;
      }
    } else if (this.state.currentSlide + this.slidesToShow < this.state.slideCount && animationTargetSlide + this.props.slidesToShow >= this.state.slideCount) {
      if (this.props.infinite === false) {
        finalTargetSlide = this.state.slideCount - this.props.slidesToShow;
      } else {
        if ((this.state.slideCount - animationTargetSlide) % this.props.slidesToScroll !== 0) {
          finalTargetSlide = this.state.slideCount - this.props.slidesToShow;
        } else {
          finalTargetSlide = animationTargetSlide;
        }
      }
    } else {
      finalTargetSlide = animationTargetSlide;
    }

    /* 
      stop: critical checkpoint
    */

    animationTargetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: animationTargetSlide,
      trackRef: this.track
    }, this.props, this.state));

    finalTargetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: finalTargetSlide,
      trackRef: this.track
    }, this.props, this.state));

    if (this.props.infinite === false) {
      if (animationTargetLeft === finalTargetLeft) {
        animationTargetSlide = finalTargetSlide;
      }
      animationTargetLeft = finalTargetLeft;
    }

    if (this.props.beforeChange) {
      this.props.beforeChange(this.state.currentSlide, finalTargetSlide);
    }
    if (this.props.lazyLoad) {
      var slidesToLoad = (0, _innerSliderUtils.getOnDemandLazySlides)((0, _objectAssign2.default)({}, this.props, this.state, { currentSlide: animationTargetSlide }));
      if (slidesToLoad.length > 0) {
        this.setState(function (prevState, props) {
          return { lazyLoadedList: prevState.lazyLoadedList.concat(slidesToLoad) };
        });
        if (this.props.onLazyLoad) {
          this.props.onLazyLoad(slidesToLoad);
        }
      }
    }
    // Slide Transition happens here.
    // animated transition happens to target Slide and
    // non - animated transition happens to current Slide
    // If CSS transitions are false, directly go the current slide.

    if (this.props.useCSS === false) {
      this.setState({
        currentSlide: finalTargetSlide,
        trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: finalTargetLeft }, this.props, this.state))
      }, function () {
        if (this.props.afterChange) {
          this.props.afterChange(finalTargetSlide);
        }
      });
    } else {

      var nextStateChanges = {
        animating: false,
        currentSlide: finalTargetSlide,
        trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: finalTargetLeft }, this.props, this.state)),
        swipeLeft: null
      };
      callback = function callback() {
        _this.setState(nextStateChanges, function () {
          if (_this.props.afterChange) {
            _this.props.afterChange(finalTargetSlide);
          }
          delete _this.animationEndCallback;
        });
      };
      this.setState({
        animating: true,
        currentSlide: finalTargetSlide,
        trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _objectAssign2.default)({ left: animationTargetLeft }, this.props, this.state))
      }, function () {
        if (_this.props.asNavFor && _this.props.asNavFor.innerSlider.state.currentSlide !== _this.state.currentSlide) {
          _this.props.asNavFor.innerSlider.slideHandler(index);
        }
        _this.animationEndCallback = setTimeout(callback, _this.props.speed);
      });
    }

    this.autoPlay();
  },
  play: function play() {
    var nextIndex;

    // if (!this.state.mounted) {
    //   return false
    // }

    if (this.props.rtl) {
      nextIndex = this.state.currentSlide - this.props.slidesToScroll;
    } else {
      if ((0, _innerSliderUtils.canGoNext)(_extends({}, this.props, this.state))) {
        nextIndex = this.state.currentSlide + this.props.slidesToScroll;
      } else {
        return false;
      }
    }

    this.slideHandler(nextIndex);
  },
  autoPlay: function autoPlay() {
    var autoplay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer);
    }
    if (autoplay || this.props.autoplay) {
      this.autoplayTimer = setTimeout(this.play, this.props.autoplaySpeed);
    }
  },
  pause: function pause() {
    if (this.autoplayTimer) {
      clearTimeout(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
};

exports.default = helpers;