export default {
  vTabs: {
    props: ['tabsInit', 'tabClick', 'tabsClasses', 'tabsTitleClasses', 'tabsTitleItemClasses', 'tabsContentClasses'],
    template: '<div v-fixed-tabs class="tabs-block" :class="classes"><div class="tabs-title" :class="titleClasses"><span class="tab" :class="{ active: isActive === tab.title }" @click="callTab(tab)" v-for="tab in tabs">{{ tab.title }}</span></div><div class="tabs-content" :class="contentClasses"><slot></slot></div></div>',
    data() {
      return {
        tabs: [],
        isActive: '',
        classes: [],
        titleClasses: [],
        contentClasses: [],
        clickMethod: this.tabClick
      }
    },
    events: {
      create(id, title) {
        this.tabs.push({
          id: id,
          title: title
        })
      }
    },
    methods: {
      callTab(tab) {
        this.isActive = tab.title
        this.$broadcast('active', tab.title)
        if (this.clickMethod) {
          let tabId = tab.id || tab.title
          this.$dispatch(this.clickMethod, tabId)
        }
      },
      init() {
        let activeIndex = ~~this.tabsInit || 0
        this.callTab(this.tabs[activeIndex])
      }
    },
    ready() {
      this.classes = this.tabsClasses ? this.tabsClasses.split(',') : []
      this.titleClasses = this.tabsTitleClasses ? this.tabsTitleClasses.split(',') : []
      this.contentClasses = this.tabsContentClasses ? this.tabsContentClasses.split(',') : []
      this.init()
    }
  },
  vTab: {
    props: ['tabTitle', 'tabId'],
    data() {
      return {
        isActive: false
      }
    },
    template: '<div class="tab" v-show="isActive" :class="{active: isActive}"><slot></slot></div>',
    ready() {
      this.$dispatch('create', this.tabId, this.tabTitle)
    },
    events: {
      active(tab) {
        this.isActive = this.tabTitle === tab
      }
    }
  }
}
