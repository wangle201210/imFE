<template>
  <div style="min-height: 100px">
    <div v-if="joined">
      <div v-if="reloadChat" :style="maxHeight" class="chat-record">
        <Card v-for="item in contentList" class="m-tb-5">
          <div v-if="item.Type == 0 && role == 'admin' && item.User != user" class="chat-one">
            <p class="chat-name"><b class="p-r-5">{{item.User}}</b></p> 
            <p class="chat-content">正在申请进入房间</p>
            <Button class="m-5" type="success" @click="acc(item.User)">允许</Button>
            <Button class="m-5" type="warning" @click="den(item.User)">下线</Button>
            <p class="chat-time"><i>{{formatDate(item.Timestamp,"hh:mm")}}</i></p>
          </div>
          <div v-else-if="isPic(item.Content)" class="chat-one">
            <p class="chat-name" v-if="item.User"><b class="p-r-5">{{item.User}}</b></p>
            <p class="chat-content"><img :src="item.Content" alt="" style="max-width: 80%"></p>
            <p class="chat-time"><i>{{formatDate(item.Timestamp,"hh:mm")}}</i></p>
          </div>
          <div v-else>
            <div v-if="item.User" class="chat-one">
              <p class="chat-name"><b class="p-r-5">{{item.User}}: </b></p>
              <p class="chat-content"> <span>{{item.Content}}</span></p> 
              <p class="chat-time"><i>{{formatDate(item.Timestamp,"hh:mm")}}</i></p>
            </div>
            <div></div>
          </div>
        </Card>
      </div>
      <div :style="menu" class="chat-menu">
        <i-button class="menu-display m-5" type="success" ghost @click="showWayFun()" >教学</i-button>
        <i-button class="menu-display m-5" type="success" ghost @click="showHistoryFun()" >历史</i-button>
        <i-button class="menu-display m-5" type="success" ghost @click="showRecordFun()" >记录</i-button>
        <i-button class="menu-display m-5" type="success" ghost @click="showVideoFun()" >视屏</i-button>
        <i-button class="menu-display m-5" ghost type="warning" @click="logout">退出</i-button>
      </div>
      <div class="input-area">
        <Input :style="conWidth" ref="inputText" type="textarea" :autosize="{minRows: 1,maxRows: 3}" v-model="content" name="content" placeholder="请输入聊天内容..." @keyup.13.native="websocketsend(content)" class="m-tb-5"></Input>
        <div class="send">
          <i-button class="f-r m-5" @click="websocketsend(content)" >发送</i-button>
        </div>
        <Upload 
          class="upload-img"
          :before-upload="handleBeforeUpload"
          :on-exceeded-size="handleMaxSize"
          :max-size="size"
          :show-upload-list="false"
          action="/">
            <Button icon="ios-camera" class="m-5"></Button>
        </Upload>
      </div>
      <way :initData="getData" ref="way"></way>
      <record :initData="getData" ref="record"></record>
      <history :initData="getData" ref="history"></history>
  </div>
  </div>
</template>

<script>
  import way from "./way"
  import record from "./record"
  import history from "./history"
  import { setToken,getToken } from '@/libs/util'
  import { recordList,historyList,wayList } from '@/api/data'

  export default {
    props: {
      user: '',
      room: '',
      role: '',
      chat: '',
    },
    components: {
      way,
      record,
      history,
    },
    data() {
      return {
        websock: null,
        content: '',
        videoShow: false,
        contentList: [],
        showWay:false,
        joined: false,
        getData:{},
        reloadChat: true,
        fullHeight: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth,
        size: 2048,
      }
    },
    mounted () {
      if (getToken()) {
        this.initWebSocket()
      }
      window.addEventListener('beforeunload', function () {
          setToken("")
      });
    },
    computed: {
      maxHeight: function () {
        return {
          'height': (this.fullHeight - 115) + 'px',
          "width": (this.width - 90) + 'px',
        }
      },
      menu: function() {
        return {
          "top": (this.fullHeight - 400) + 'px',
        }
      },
      conWidth: function () {
        return {
          "width": (this.width - 140) + 'px',
        }
      }
    },
    methods: {
      isPic(res){
        if (res.substring(0, 10) == 'data:image') {
          return true
        }
        return false
      },
      handleMaxSize (file) {
        this.$Message.warning('图片最大可上传'+this.size/1024+'M!');
      },
      handleBeforeUpload(file) {
        if (file.size <= (this.size*1024)) {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          const that = this
          reader.onloadend = function (e) {
              file.url = reader.result
              that.websock.send(file.url)
          }
        }
      },
      acc(u) {
        var data = {}
        data.Type = "login"
        data.User = u
        data.Join = true
        this.$Message.success('你同意了'+u+'的登陆请求');
        this.websock.send(JSON.stringify(data))
      },
      den(u) {
        var data = {}
        data.Type = "login"
        data.User = u
        data.Join = false
        this.websock.send(JSON.stringify(data))
      },
      logout(){
        this.$emit("logout")
      },
      showWayFun() {
        let parp = {}
        parp.room = this.room
        wayList(parp).then((res) => {
          this.getData = res.data.data
          this.$refs.way.show = true
        })
      },
      showRecordFun() {
        recordList().then((res) => {
          this.getData = res.data.data
          this.$refs.record.show = true
        })
      },
      showVideoFun(){
        var reduce = 0
        if (this.width < 769) {
          reduce = 270
        } else {
          reduce = 510
        }
        this.reloadChat = !this.reloadChat
        this.videoShow = !this.videoShow
        if (this.videoShow) {
          this.fullHeight -= reduce
        } else {
          this.fullHeight += reduce
        }
        this.reloadChat = !this.reloadChat
        this.$emit("showVideo",this.videoShow)
      },
      showHistoryFun() {
        historyList().then((res) => {
          this.getData = res.data.data
          this.$refs.history.show = true
        })
      },
      initWebSocket(){ //初始化weosocket 
        // var uri = 'ws://ws.iwangle.me/ws/join?uname='+this.user+'&password=password'+'&room='+this.room;//ws地址
        // var uri = 'ws://localhost:8081/ws/join?uname='+this.user+'&password=password'+'&room='+this.room;//ws地址
        // var uri = 'ws://localhost:8081/api/ws/join?token='+getToken()+'&room='+this.room;//ws地址
        var uri = 'ws://ws.iwangle.me/api/ws/join?token='+getToken()+'&room='+this.room;//ws地址
        var wsuri = encodeURI(encodeURI(uri))
        this.websock = new WebSocket(wsuri); 
        this.websock.onopen = this.websocketonopen
        this.websock.onerror = this.websocketonerror
        this.websock.onmessage = this.websocketonmessage
        this.websock.onclose = this.websocketclose
      }, 
      websocketonopen() {
        this.$Notice.success({
            title: '欢迎来到聊天室!',
            desc: ''
        });
      },
      websocketonerror(e) { //错误
        this.$Message.warning('管理员未登录或服务器错误!');
        this.$emit("logout")
      },
      websocketonmessage(e){ //数据接收
        var data = JSON.parse(e.data)
        if (data.Content == "") {//进入
          return
        }else if (data.Content.substring(1, 15) == '"Type":"login"') {//登陆相关
          if (this.role != "admin") {
            var isLogin = JSON.parse(data.Content)
            data.Content = "欢迎"+isLogin.User+"进入房间!"//欢迎消息
            if (this.user == isLogin.User) {
              if (isLogin.Join) {
                this.$Message.success('管理员同意了你的登陆!');
                this.joined = true
              }else{
                this.$Message.warning('管理员拒绝了你的登陆!');
                this.$emit("logout")
                return
              }
            }
          }
          return
        }
        if (data.Type == 0) {
          if (this.role != "admin") {//非管理员进入房间进入
            return
          }
        } else if (data.Type == 1) {//有人离开
          data.Content = data.User+'离开了聊天室.'
          data.User = ''
        }else if (data.Type == 2) {//一般的聊天信息

        } else if (data.Type == 3 && data.User == this.user) {//错误,包括重复登陆和管理员多人
          this.$Message.warning(data.Content+',即将自动退出!');
          setTimeout(() => {
            this.$emit("logout")
          }, 1000);
          // this.websock.close()
          return 
        } else if (data.Type == 4 || data.Type == 5) {//照片
          this.$emit("addImg",{url:data.Content,type: data.Type})
          return //照片
        } else if (data.Type == 6) {
          this.$emit("changeVideo",data.Content)
          return
        }
        this.contentList.unshift(data)
      }, 
      websocketsend(agentData){//数据发送 
        if (agentData != "") {
          this.websock.send(agentData)
          this.content = ''
        }
        this.$refs.inputText.blur()
      }, 
      websocketclose(e){ //关闭 
        this.$Message.warning("你已被被强制下线!");
        this.$emit("logout")
      },
      formatDate (date, fmt) {
        date = new Date(date)
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + '';
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
            }
        }
        return fmt
      },
      padLeftZero (str) {
        return ('00' + str).substr(str.length)
      },
      closeWay() {
        this.showWay = false
      }
    },
    created(){
      if (this.role == "admin") {
        this.size = 204800
        this.joined = true
      }
    },
    destroyed: function() {
      console.log("dis")
      console.log(getToken())
      setToken("")
      console.log(getToken())
    },
    watch:{
      joined(){
        // if (!this.joined) {
        //   this.$Spin.show();
        // } else {
        //   this.$Spin.hide();
        // }
        this.$emit("joinChange",this.joined)
      }
    }
  }
</script>
