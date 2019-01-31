<template>
  <div>
    <gallery :images="imgLists" :index="index" @close="index = null"></gallery>
    <div
      class="image"
      v-for="(image, imageIndex) in imgLists"
      :key="imageIndex"
      @click="index = imageIndex"
      :style="mineList[imageIndex]"
    ></div>
  </div>
</template>

<script>
  import VueGallery from 'vue-gallery';
  
  export default {
    props: {
      imgLists:{
        type: [Array, Object],
      }
    },
    data: function () {
      return {
        index: null,
        mineList: [],
      };
    },
    computed: {
      width() {
        var fillWidth = document.documentElement.clientWidth
        if (fillWidth < 769) {
          return fillWidth - 56
        } else {
          return (fillWidth-24-56)/4-6
        }
      },
    },
    methods:{
      getImgList(imgList){
        var img = []
        for (var i=0;i<imgList.length;i++)
        {
          img[i]="background-image:url("+imgList[i]+");width:"+this.width+"px;height:"+this.width/3*2+"px"
        }
        return img
      }
    },
    mounted () {
      var data = this.getImgList(this.imgLists)
      this.mineList = data
    },
    components: {
      'gallery': VueGallery
    },
    watch: {
      imgLists: {
        handler(val){
          var data = this.getImgList(val)
          this.mineList = data
        },
        deep: true
      }
    }
  }
</script> 