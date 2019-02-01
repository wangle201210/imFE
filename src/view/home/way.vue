<template>
    <div class="way">
      <!-- <Drawer :closable="false" class="way-drawer" :width="wayWidth" v-model="show"> -->
          <div class="demo-drawer-profile" v-html="content">
              
          </div>
      <!-- </Drawer> -->
    </div>
</template>

<script>
  export default {
    props: {
      initData: {
        type:[Object,Array],
      },
    },
    components: {
    },
    data() {
      return {
        show: false,
        width: document.documentElement.clientWidth,
        content: ''
      }
    },
    mounted() {
    },
    computed: {
      wayWidth: function () {
        if (this.width > 760) {
          return 560
        } else {
          return 80
        }
      }
    },
    methods: {
    },
    watch: {
      initData: {
        handler() {
          this.content = this.initData.content
        },
        deep: true
      }
    },
  }
</script>
<style>
  .demo-drawer-profile{
      font-size: 14px;
  }
  .demo-drawer-profile .ivu-col{
      margin-bottom: 12px;
  }
</style>

