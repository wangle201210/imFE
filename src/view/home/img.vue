<template>
  <div>
    <gallery :images="images" :index="index" @close="index = null"></gallery>
    <div
      class="image"
      v-for="(image, imageIndex) in images"
      :key="imageIndex"
      @click="index = imageIndex"
      :style="imgList[imageIndex]"
    ></div>
  </div>
</template>

<script>
  import VueGallery from 'vue-gallery';
  
  export default {
    data: function () {
      return {
        images: [
          'https://dummyimage.com/600x400/cccccc/000000',
          'https://dummyimage.com/1500x1000/cccccc/000000',
          'https://dummyimage.com/900x600/000000/ffffff',
          'https://dummyimage.com/930x620/000000/ffffff',
          'https://dummyimage.com/660x440/000000/cccccc',
          'https://dummyimage.com/630x420/eeeeee/cccccc',
          'https://dummyimage.com/600x400/ffffff/dddddd',
          'https://dummyimage.com/600x400/666666/cccccc',
        ],
        index: null,
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
      imgList() {
        var img = []
        for (var i=0;i<this.images.length;i++)
        {
          img[i]="background-image:url("+this.images[i]+");width:"+this.width+"px;height:"+this.width/3*2+"px"
        }
        return img
      }
    },
    components: {
      'gallery': VueGallery
    },
  }
</script> 