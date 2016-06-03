(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.fixedTab = global.fixedTab || {})));
}(this, function (exports) { 'use strict';

  var tabsComponent = {
    vTabs: {
      props: ['tabsInit', 'tabClick', 'tabsClasses', 'tabsTitleClasses', 'tabsTitleItemClasses', 'tabsContentClasses'],
      template: '<div v-fixed-tabs class="tabs-block" :class="classes"><div class="tabs-title" :class="titleClasses"><span class="tab" :class="{ active: isActive === tab.title }" @click="callTab(tab)" v-for="tab in tabs">{{ tab.title }}</span></div><div class="tabs-content" :class="contentClasses"><slot></slot></div></div>',
      data: function data() {
        return {
          tabs: [],
          isActive: '',
          classes: [],
          titleClasses: [],
          contentClasses: [],
          clickMethod: this.tabClick
        };
      },

      events: {
        create: function create(id, title) {
          this.tabs.push({
            id: id,
            title: title
          });
        }
      },
      methods: {
        callTab: function callTab(tab) {
          this.isActive = tab.title;
          this.$broadcast('active', tab.title);
          if (this.clickMethod) {
            var tabId = tab.id || tab.title;
            this.$dispatch(this.clickMethod, tabId);
          }
        },
        init: function init() {
          var activeIndex = ~ ~this.tabsInit || 0;
          this.callTab(this.tabs[activeIndex]);
        }
      },
      ready: function ready() {
        this.classes = this.tabsClasses ? this.tabsClasses.split(',') : [];
        this.titleClasses = this.tabsTitleClasses ? this.tabsTitleClasses.split(',') : [];
        this.contentClasses = this.tabsContentClasses ? this.tabsContentClasses.split(',') : [];
        this.init();
      }
    },
    vTab: {
      props: ['tabTitle', 'tabId'],
      data: function data() {
        return {
          isActive: false
        };
      },

      template: '<div class="tab" v-show="isActive" :class="{active: isActive}"><slot></slot></div>',
      ready: function ready() {
        this.$dispatch('create', this.tabId, this.tabTitle);
      },

      events: {
        active: function active(tab) {
          this.isActive = this.tabTitle === tab;
        }
      }
    }
  };

  var throttle = function throttle(fn, delay) {
    var now = void 0,
        lastExec = void 0,
        timer = void 0,
        context = void 0,
        args = void 0; // eslint-disable-line

    var execute = function execute() {
      fn.apply(context, args);
      lastExec = now;
    };

    return function () {
      context = this;
      args = arguments;

      now = Date.now();

      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      if (lastExec) {
        var diff = delay - (now - lastExec);
        if (diff < 0) {
          execute();
        } else {
          timer = setTimeout(function () {
            execute();
          }, diff);
        }
      } else {
        execute();
      }
    };
  };

  var getScrollTop = function getScrollTop(element) {
    if (element === window) {
      return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
    }

    return element.scrollTop;
  };

  var getComputedStyle = document.defaultView.getComputedStyle;

  var getScrollEventTarget = function getScrollEventTarget(element) {
    var currentNode = element;
    while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
      var overflowY = getComputedStyle(currentNode).overflowY;
      if (overflowY === 'scroll' || overflowY === 'auto') {
        return currentNode;
      }
      currentNode = currentNode.parentNode;
    }
    return window;
  };

  var getElementTop = function getElementTop(element) {
    if (element === window) {
      return getScrollTop(window);
    }
    return element.getBoundingClientRect().top + getScrollTop(window);
  };

  var isAttached = function isAttached(element) {
    var currentNode = element.parentNode;
    while (currentNode) {
      if (currentNode.tagName === 'HTML') {
        return true;
      }
      if (currentNode.nodeType === 11) {
        return false;
      }
      currentNode = currentNode.parentNode;
    }
    return false;
  };

  var fixedTabDirective = {
    doBind: function doBind() {
      if (this.binded) return; // eslint-disable-line
      this.binded = true;

      var directive = this;
      var element = directive.el;
      var tabs = element.childNodes[0];

      directive.tabsStylePosition = getComputedStyle(tabs).position;
      directive.scrollEventTarget = getScrollEventTarget(element);
      // directive.scrollListener = directive.doCheck.bind(directive)
      directive.scrollListener = throttle(directive.doCheck.bind(directive), 100);
      directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener);
    },
    doCheck: function doCheck() {
      var scrollEventTarget = this.scrollEventTarget;
      var element = this.el;
      var tabs = element.childNodes[0];

      var viewportScrollTop = getScrollTop(scrollEventTarget);
      var elementTop = getElementTop(element);

      var fixedTrigger = false,
          overTrigger = false; // eslint-disable-line

      var offsetDistance = ~ ~element.getAttribute('tabs-offset') || 0;

      fixedTrigger = viewportScrollTop >= elementTop - offsetDistance;
      overTrigger = viewportScrollTop >= elementTop + element.offsetHeight - tabs.offsetHeight - offsetDistance;

      if (fixedTrigger) {
        if (overTrigger) {
          tabs.style.position = 'absolute';
          tabs.style.top = 'auto';
          tabs.style.bottom = 0;
        } else {
          tabs.style.position = 'fixed';
          tabs.style.top = offsetDistance + 'px';
          tabs.style.bottom = 'auto';
        }
        element.style.paddingTop = tabs.offsetHeight + 'px';
      } else {
        tabs.style.position = this.tabsStylePosition;
        tabs.style.top = 'auto';
        tabs.style.bottom = 'auto';
        element.style.paddingTop = 0;
      }
    },
    bind: function bind() {
      var directive = this;
      var element = this.el;

      var isFixed = element.getAttribute('tabs-fixed');
      isFixed = isFixed || 'true';
      if (isFixed != 'true') return; // eslint-disable-line

      directive.vm.$on('hook:ready', function () {
        if (isAttached(element)) {
          directive.doBind();
        }
      });

      this.bindTryCount = 0;

      var tryBind = function tryBind() {
        if (directive.bindTryCount > 10) return; // eslint-disable-line
        directive.bindTryCount++;
        if (isAttached(element)) {
          directive.doBind();
        } else {
          setTimeout(tryBind, 50);
        }
      };

      tryBind();
    },
    unbind: function unbind() {
      this.scrollEventTarget.removeEventListener('scroll', this.scrollListener);
    }
  };

  window.Vue && Vue.use(install); // eslint-disable-line

  function install(Vue) {
    Vue.component('vTabs', tabsComponent.vTabs);
    Vue.component('vTab', tabsComponent.vTab);
    Vue.directive('fixedTabs', fixedTabDirective);
  }

  exports.install = install;
  exports.tabsComponent = tabsComponent;
  exports.fixedTabDirective = fixedTabDirective;

}));