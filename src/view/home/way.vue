<template>
    <div class="way">
      <Drawer :closable="false" class="way-drawer" :width="wayWidth" v-model="show">
          <div class="demo-drawer-profile">
              材料：西红柿，鸡蛋，葱，盐，火麻油，味精。
              步骤：先将材料准备好。西红柿切好。
              打鸡蛋：将鸡蛋打入碗中，加入适量的盐搅拌均匀。
              小火起锅、倒入火麻油。将打好的鸡蛋倒入，炒熟盛出备用。再起锅，倒入些许火麻油，放入西红柿翻炒，加入糖和盐翻炒均匀即可出锅。可以放些葱。
          </div>
      </Drawer>
    </div>
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        show: false,
        width: document.documentElement.clientWidth
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

