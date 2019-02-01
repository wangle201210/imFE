<template>
    <div class="way">
      <!-- <Drawer :closable="false" class="way-drawer" :width="wayWidth" v-model="show"> -->
        <div v-for="item in initData" class="record">
          <li class="m-5"><a @click="detail(item)">{{item.title}}</a></li>
        </div>
     <!-- </Drawer> -->
      <Drawer :closable="false" v-model="detailShow" :width="wayWidth">
        <div v-html="content"></div>
      </Drawer>
    </div>
</template>

<script>
import { recordList } from '@/api/data'
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
        content: '',
        detailShow: false,
      }
    },
    mounted() {
      // this.init()
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
      detail(res) {
        this.detailShow = true
        this.content = res.content
      },
      init() {
        
      }
    },
    watch: {
      initData: {
        handler() {

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
  .record{
    font-size: 15px;
  }
</style>

