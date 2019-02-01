<template>
      <div class="item">
        <div class="player">
          <video-player  
            v-if="videoShow"
            class="vjs-custom-skin"
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @ended="onPlayerEnded($event)"
            @loadeddata="onPlayerLoadeddata($event)"
            @waiting="onPlayerWaiting($event)"
            @playing="onPlayerPlaying($event)"
            @timeupdate="onPlayerTimeupdate($event)"
            @canplay="onPlayerCanplay($event)"
            @canplaythrough="onPlayerCanplaythrough($event)"
            @ready="playerReadied"
            @statechanged="playerStateChanged($event)">
          </video-player>
        </div>
      </div>
</template>

<script>
  // custom skin css
  import './video.css'
  import 'video.js/dist/video-js.css'
  import { videoPlayer } from 'vue-video-player'

  export default {
    components: {
      videoPlayer
    },
    props: {
      initData: "",
    },
    data() {
      return {
        videoShow: false,
        width: document.documentElement.clientWidth,
        // videojs options
        playerOptions: {
          height: '500',
          autoplay: true,
          muted: true,
          language: 'zh',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [{
            // type: "video/mp4",
            // mp4
            // src: "http://localhost:8081/videos/sp.mp4",
            src: this.initData,
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }],
          // poster: "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg",
        }
      }
    },
    mounted() {
      if (this.initData == "") {
        this.videoShow = false
      }else{
        this.videoShow = true
      }
        // this.player.muted(true)
        this.playerOptions.sources[0].src = this.initData
          console.log("this.initData1")
          console.log(this.initData)

        if (this.width < 769) {
          this.playerOptions.height = 260
        }
    },
    watch: {
      initData: {
        handler(){
          console.log("this.initData2")
          console.log(this.initData)
          this.playerOptions.sources[0].src = this.initData
          console.log(this.playerOptions.sources)

        }
      }
    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods: {
      // listen event
      onPlayerPlay(player) {
        // console.log('player play!', player)
      },
      onPlayerPause(player) {
        // console.log('player pause!', player)
      },
      onPlayerEnded(player) {
        // console.log('player ended!', player)
      },
      onPlayerLoadeddata(player) {
        // console.log('player Loadeddata!', player)
      },
      onPlayerWaiting(player) {
        // console.log('player Waiting!', player)
      },
      onPlayerPlaying(player) {
        // console.log('player Playing!', player)
      },
      onPlayerTimeupdate(player) {
        // console.log('player Timeupdate!', player.currentTime())
      },
      onPlayerCanplay(player) {
        // console.log('player Canplay!', player)
      },
      onPlayerCanplaythrough(player) {
        // console.log('player Canplaythrough!', player)
      },

      // or listen state event
      playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
      },

      // player is ready
      playerReadied(player) {
        player.currentTime(0)
        // console.log('example 01: the player is readied', player)
      }
    }
  }
</script>

