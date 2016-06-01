# vue-fixed-tabs
A tabs component and fixed tabs directive for Vue

## Installation

### NPM

```bash
$ npm install vue-fixed-tabs
```

### Local Setup
* Install with `npm install`
* Build with `npm run build`

## Usage

### CommonJS
```js
var VueFixedTabs = require('vue-fixed-tabs');

Vue.use(VueFixedTabs)
```

### ES6
```js
import alert from 'vue-fixed-tabs'

Vue.use(VueFixedTabs)
```

### Browser globals

```html
<div id="app">
  
  <v-tabs tabs-fixed="true" tabs-offset="0" tabs-init="0" tabs-classes="classA,classB" tab-click="activeTab">
    <v-tab tab-title="Tab1" tab-id="tab1">
      Tab 1 content
    </v-tab>
    <v-tab tab-title="Tab2" tab-id="tab2">
      Tab 2 content
    </v-tab>
    <v-tab tab-title="Tab3" tab-id="tab3">
      Tab 3 content
    </v-tab>
  </div>

</div>

<script src="path/vue.js"></script>
<script src="path/vue-fixed-tabs.js"></script>
<script>
    var vm = new Vue({
        el: "#app",
        events: {
          activeTab: function(tabid) {
            console.log(tabid + ' is now active')
          }
        }
    })
</script>
```

## Props

### v-tabs

| Prop | Description |
| ----- | ----- |
| tabs-fixed | `optional` `default: true` - fixed tabs when scrolling |
| tabs-init | `optional` `default: 0` - init active tab index |
| tabs-offset | `optional` `default: 0` - distance from the top of the screen to the fixed tabs |
| tabs-click | `optional` - event name of the parent instance, triggered then a tab clicked |
| tabs-title-classes | `optional` - your classes on tabs title |
| tabs-content-classes | `optional` - your classes on tabs content |

### v-tab

| Prop | Description |
| ----- | ----- |
| tabs-title |  |
| tab-id |  |

## License
[The MIT License](LICENSE).
