<style lang="less">
  @import './home.less';
</style>
<template>
  <div>
    <Card :style="maxHeight" class="main">
      <Row>
        <Col :md="12" :xs="24">
          <div v-if="videoShow">
            <video-player v-if="joined" :videoUrl="videoUrl" class="video-player"></video-player>
          </div>
          <div v-else>加载中...</div>
        </Col>
        <Col :md="12" :xs="24">
          <chat class="chat" ref="chat" @changeVideo="changeVideo" @joinChange="joinChange" @logout="logout" @addImg="addImg" :user="user" :room="room" :role="role"></chat>
        </Col>
        <Col :span="24">
          <img-show v-if="joined" ref="img" :imgLists="imgLists"></img-show>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import videoPlayer from './video'
import chat from './chat'
import imgShow from './img'
import { videoList } from '@/api/data'

export default {
  name: 'home',
  components: {
    videoPlayer,
    chat,
    imgShow,
  },
  data () {
    return { 
      user:'',
      room:1,
      role:1,
      imgLists:[],
      fullHeight: document.documentElement.clientHeight - 10,
      joined: false,
      videoUrl: "",
      videoShow: true
    }
  },
  computed: {
    maxHeight: function () {
      return {
        'height': this.fullHeight + 'px',
      }
    }
  },
  mounted () {
    // this.getVideo()
    this.joined = this.$refs.chat.websock.joined
    // console.log("this.$refs.chat")
    // console.log(this.$refs.chat)
    // console.log()
    // this.initWebSocket()
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      if (this.$refs.chat && this.$refs.chat.websock) {
        this.$refs.chat.websock.close()
      }
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    addImg(info) {
      if (info.type == 5) {
        this.imgLists = []
      }
      this.imgLists.unshift(info.url)
    },
    joinChange(res) {
      console.log("this.joined")
      console.log(res)
      this.joined = res
      console.log(this.joined)
      console.log(this.imgLists)
    },
    changeVideo(res) {
      console.log("zaibian")
        console.log(res)

        this.videoUrl = res
    },
  },
  created(){
    this.user = this.$store.state.user.name
    this.role = this.$store.state.user.role
    this.room = this.$store.state.user.room
    if (this.room == "") {
      this.logout()
    }
  },
  beforeDestroy: function() {
    // this.logout();
  },
  watch: {
    videoUrl:{
      handler() {
        console.log("this.videoUrlChange")
        console.log(this.videoUrl)
        this.videoShow = false
        setTimeout(() => {
          this.videoShow = true
        }, 1);
      },
      deep:true,
    }
  }
}
</script>

