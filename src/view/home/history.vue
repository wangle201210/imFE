<template>
  <div>
    <div v-html="content" style="max-width: 100%"></div>  
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
        content:""
      };
    },
    computed: {
    },
    methods:{
    },
    mounted () {
      this.content = this.initData[0] ? this.initData[0].content : ""
      console.log("this.content")
      console.log(this.initData)
      console.log(this.content)
    },
    components: {
    },
    watch: {
      initData: {
        handler(val){
          this.content = this.initData[0] ? this.initData[0].content : ""
        },
        deep: true
      }
    }
  }
</script> 