/**
 * jquery.popup.js v. 0.1.1
 * author: Roma Maslennikov
 * used default: $('#elem').popup();
 * used options default:
 * background: '#000' // bg overlay
 * position: 'absolute' // position absolute or fixed
 * opacity: 0.5 // opacity overlay
 * zIndex: 123456788 // z-index overlay
 * classAnimateShow: '',  // animate.css, link https://daneden.github.io/animate.css/
 * classAnimateHide: '',  // animate.css, link https://daneden.github.io/animate.css/
 * scale - default css transform
 * time: 400 // time init
 * onPopupClose: function{} // popup close after function
 * onPopupInit: function{} // popup init after function
 **/
;(function ($) {
  function Popup(obj, options) {
    this.obj = obj;
    this._thisHeight = obj.outerHeight();
    this._window = $(window);
    this._thisTransformHideDefault = "scale(0)";
    this._thisTransformShowDefault = "scale(1)";
    this.popupBg = $("#popup-bg");
    this.options = $.extend({
      background: "#000",
      position: "absolute",
      opacity: .5,
      zIndex: 123456788,
      classAnimateShow: '',  // animate.css, link https://daneden.github.io/animate.css/
      classAnimateHide: '',  // animate.css, link https://daneden.github.io/animate.css/
      time: 400,
      onPopupClose: function(){},
      onPopupInit: function(){}
    }, options, true);

    if ( typeof options === 'object' || !options) {
      this.init();
      this.initOverlay();
      this.onEvents();
    }else {
      this[options]();
    }

    return this
  }

  Popup.prototype = {
    init: function() {
      var p = this;
      if(this.options.classAnimateShow != ''){
        this.obj.removeClass(this.options.classAnimateHide);
        this.obj.css({
          position: this.options.position,
          WebkitAnimationDuration: this.options.time / 1e3 +'s',
          animationDuration: this.options.time / 1e3 +'s',
          zIndex: this.options.zIndex+1
        }).show().addClass('animated ' + this.options.classAnimateShow);
      }else {
        this.obj.css({
          position: this.options.position,
          zIndex: this.options.zIndex+1,
          transform: this._thisTransformHideDefault,
          transition: "transform " + this.options.time / 1e3 + "s ease-out"
        }).fadeIn(this.options.time).css({transform: this._thisTransformShowDefault});
      }

      if (this.options.position == "fixed") {
        this.popupPosition();
        this._window.resize(function () {
          p.obj.css({transition: "left " +p.options.time / 1e3 + "s ease-out, top "+ p.options.time / 1e3 + "s ease-out"});
          p.popupPosition();
          p.popupBgAddCss();
        })
      } else if (this.options.position == "absolute") {
        this.popupPositionRezise();
        p._window.resize(function () {
          p.obj.css({transition: "left " + p.options.time / 1e3 + "s ease-out, top "+ p.options.time / 1e3 + "s ease-out"});
          p.popupPositionRezise();
          p.popupBgAddCss();
        })
      }

      this.options.onPopupInit();

      return this.obj
    },

    initOverlay: function () {
      var p = this;
      if (document.getElementById("popup-bg") == null) {
        $("<div/>", {
          id: "popup-bg",
          css: {
            position: "fixed",
            top: 0,
            height: $(document).height(),
            width: $(document).width(),
            left: 0,
            display: "none",
            background: this.options.background,
            opacity: this.options.opacity,
            filter: "alpha(opacity=" + this.options.opacity * 100 + ")",
            zIndex: this.options.zIndex,
            cursor: "pointer"
          }
        }).appendTo("body");
      }
      this.popupBg = $("#popup-bg");
      this.popupBg.show();
      this.popupBgAddCss();
      this._window.scroll(function () {
        p.popupBg.height($(document).height());
        p.popupBg.width($(document).width());
      });
    },

    popupClose: function () {
      var p = this;
      if(this.options.classAnimateHide != ''){
        this.obj.removeClass(this.options.classAnimateShow);
        this.obj.addClass('animated ' + this.options.classAnimateHide);
        setTimeout(function () {
          p.obj.hide();
        },p.options.time);
      }else{
        this.obj.fadeOut(this.options.time).css({transform: this._thisTransformHideDefault});
        this.obj.removeClass('animated ' + this.options.classAnimateShow);
      }
      this.popupBg.fadeOut(this.options.time);
      return this.obj
    },

    close: function () {
       $("#popup-bg,.js-popup-close").click();
    },

    popupPosition: function () {
      this.obj.css({top: this._window.height() / 2 - this.obj.outerHeight() / 2, left: this._window.width() / 2 - this.obj.outerWidth() / 2});
      return this.obj
    },

    popupPositionRezise: function () {
      var $ = this.obj.offsetParent();
      if (this._thisHeight > this._window.height()) {
        this.obj.css({top: -$.offset().top + this._window.scrollTop() + 5})
      } else {
        this.obj.css({top: -$.offset().top + this._window.scrollTop() + this._window.height() / 2 - this.obj.outerHeight() / 2})
      }
      if (this.obj.outerWidth() > this._window.width()) {
        this.obj.css({left: -$.offset().left + this._window.scrollLeft() + 5})
      } else {
        this.obj.css({left: -$.offset().left + this._window.scrollLeft() + this._window.width() / 2 - this.obj.outerWidth() / 2})
      };
      return this.obj
    },

    popupBgAddCss: function () {
      this.popupBg.height($(document).height());
      this.popupBg.width($(document).width());
    },

    onEvents: function () {
      var p = this;
      $("#popup-bg,.js-popup-close").off('click').on({
        click: function () {
          p.popupClose(p.options.onPopupClose());
          $(document).off('keydown');
        }
      });
      $(document).off('keydown').one('keydown',function ($) {
        if ($.keyCode == 27) {
          p.popupClose(p.options.onPopupClose());
        }
      });
    }
  };


  $.fn.popup = function(options) {
    var obj = this;
    new Popup(obj, options);
    return  this;
  }
})(jQuery);


