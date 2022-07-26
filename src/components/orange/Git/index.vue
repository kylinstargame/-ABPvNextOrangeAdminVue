<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'OrangeCardGit',
  data() {
    return {
      url: 'https://gitee.com/y_project/orange-Vue'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
