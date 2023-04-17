import Vue from 'vue'
import DataDict from '@/utils/dict'
import { getDicts as getDicts } from '@/api/system/dict/data'

function install() {
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'dictLabel',
        valueField: 'dictValue',
        request(dictMeta) {
          console.log("0000000000000000000000");
          return getDicts(dictMeta.type).then(res => res.data)
        },
      },
    },
  })
}

export default {
  install,
}
