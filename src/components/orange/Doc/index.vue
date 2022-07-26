<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'OrangeCardDoc',
  data() {
    return {
      url: 'http://doc.orange.vip/orange-vue'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
