/* global Vue */
import tabsComponent from './component'
import fixedTabDirective from './directive'

window.Vue && Vue.use(install) // eslint-disable-line

function install(Vue) {
  Vue.component('vTabs', tabsComponent.vTabs)
  Vue.component('vTab', tabsComponent.vTab)
  Vue.directive('fixedTabs', fixedTabDirective)
}

export {install, tabsComponent, fixedTabDirective}
