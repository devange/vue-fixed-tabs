let throttle = function (fn, delay) {
  let now, lastExec, timer, context, args // eslint-disable-line

  let execute = function () {
    fn.apply(context, args)
    lastExec = now
  }

  return function () {
    context = this
    args = arguments

    now = Date.now()

    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    if (lastExec) {
      let diff = delay - (now - lastExec)
      if (diff < 0) {
        execute()
      } else {
        timer = setTimeout(function () {
          execute()
        }, diff)
      }
    } else {
      execute()
    }
  }
}

let getScrollTop = function (element) {
  if (element === window) {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop)
  }

  return element.scrollTop
}

let getComputedStyle = document.defaultView.getComputedStyle

let getScrollEventTarget = function (element) {
  let currentNode = element
  while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
    let overflowY = getComputedStyle(currentNode).overflowY
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode
    }
    currentNode = currentNode.parentNode
  }
  return window
}

let getElementTop = function (element) {
  if (element === window) {
    return getScrollTop(window)
  }
  return element.getBoundingClientRect().top + getScrollTop(window)
}

let isAttached = function (element) {
  let currentNode = element.parentNode
  while (currentNode) {
    if (currentNode.tagName === 'HTML') {
      return true
    }
    if (currentNode.nodeType === 11) {
      return false
    }
    currentNode = currentNode.parentNode
  }
  return false
}

export default {
  doBind() {
    if (this.binded) return // eslint-disable-line
    this.binded = true

    let directive = this
    let element = directive.el
    let tabs = element.childNodes[0]

    directive.tabsStylePosition = getComputedStyle(tabs).position
    directive.scrollEventTarget = getScrollEventTarget(element)
    // directive.scrollListener = directive.doCheck.bind(directive)
    directive.scrollListener = throttle(directive.doCheck.bind(directive), 100)
    directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener)
  },

  doCheck() {
    let scrollEventTarget = this.scrollEventTarget
    let element = this.el
    let tabs = element.childNodes[0]

    let viewportScrollTop = getScrollTop(scrollEventTarget)
    let elementTop = getElementTop(element)

    let fixedTrigger = false, overTrigger = false // eslint-disable-line

    let offsetDistance = ~~element.getAttribute('tabs-offset') || 0

    fixedTrigger = viewportScrollTop >= elementTop - offsetDistance
    overTrigger = viewportScrollTop >= elementTop + element.offsetHeight - tabs.offsetHeight - offsetDistance

    if (fixedTrigger) {
      if (overTrigger) {
        tabs.style.position = 'absolute'
        tabs.style.top = 'auto'
        tabs.style.bottom = 0
      } else {
        tabs.style.position = 'fixed'
        tabs.style.top = offsetDistance + 'px'
        tabs.style.bottom = 'auto'
      }
      element.style.paddingTop = tabs.offsetHeight + 'px'
    } else {
      tabs.style.position = this.tabsStylePosition
      tabs.style.top = 'auto'
      tabs.style.bottom = 'auto'
      element.style.paddingTop = 0
    }
  },

  bind() {
    let directive = this
    let element = this.el

    let isFixed = element.getAttribute('tabs-fixed')
    isFixed = isFixed || 'true'
    if (isFixed != 'true') return // eslint-disable-line

    directive.vm.$on('hook:ready', function () {
      if (isAttached(element)) {
        directive.doBind()
      }
    })

    this.bindTryCount = 0

    let tryBind = function () {
      if (directive.bindTryCount > 10) return // eslint-disable-line
      directive.bindTryCount++
      if (isAttached(element)) {
        directive.doBind()
      } else {
        setTimeout(tryBind, 50)
      }
    }

    tryBind()
  },

  unbind() {
    this.scrollEventTarget.removeEventListener('scroll', this.scrollListener)
  }
}
