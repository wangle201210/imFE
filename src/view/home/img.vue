<template>
  <div style="text-align: center;">
    <img :src="imgUrl" style="max-width: 100%"  alt="">
  </div>
</template>
<script>
  
  export default {
    props: {
      initData:{
        type: [Array, Object],
      }
    },
    data: function () {
      return {
        imgUrl:""
      };
    },
    computed: {
    },
    methods:{
    },
    mounted () {
      this.imgUrl = this.initData[0] ? this.initData[0].url : ""
    },
    components: {
    },
    watch: {
      initData: {
        handler(val){
          this.imgUrl = this.initData[0] ? this.initData[0].url : ""
        },
        deep: true
      }
    }
  }
</script> 