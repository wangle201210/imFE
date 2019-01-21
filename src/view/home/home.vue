<style lang="less">
  @import './home.less';
</style>
<template>
  <div>
    <Card :style="maxHeight" class="main">
      <Row>
        <Col :md="12" :xs="24">
          <video-player class="video-player"></video-player>
        </Col>
        <Col :md="12" :xs="24">
          <chat class="chat" ref="chat" @logout="logout" :user="user" :room="room"></chat>
        </Col>
        <Col :span="24">
          <img-show></img-show>
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
      
      fullHeight: document.documentElement.clientHeight - 10,
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
    // console.log()
    // this.initWebSocket()
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      var that = this
      // console.log("that.$refs.chat")
      // console.log(that.$refs.chat)
      // that.$refs.chat.websock.close()
      this.handleLogOut().then(() => {
        that.$router.push({
          name: 'login'
        })
      })
    },
    
  },
  created(){
    this.user = this.$store.state.user.userName
    this.room = this.$store.state.user.room
  },
  destroyed: function() {
    this.logout();
  },
  watch: {
  }
}
</script>

