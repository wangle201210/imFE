<style lang="less">
  @import './index.less';
</style>

<template>
  <div class="main" v-if="joined">
    <div :style="maxHeight" class="chat-record">   
      <div v-for="item in contentList">
        <div v-if="item.Type == 1001" class="time-only">
          <Tag class="chat-time" color="default">{{formatDate(item.Timestamp,"hh:mm")}}</Tag>
        </div>
        <Card v-else class="m-5">
          <div v-if="item.Type == 0 && role == 'admin' && item.User != user" class="chat-one">
            <p class="chat-name"><b class="p-r-5">{{item.User}}</b></p> 
            <p class="chat-content">正在申请进入房间</p>
            <Button style="margin-left: 30%" class="m-5" type="success" @click="acc(item.User)">允许</Button>
            <Button class="m-5" type="warning" @click="den(item.User)">下线</Button>
            <!-- <p class="chat-time"><i>{{formatDate(item.Timestamp,"hh:mm")}}</i></p> -->
          </div>
          <div v-else-if="isPic(item.Content)" class="chat-one">
            <p class="chat-name" v-if="item.User"><b class="p-r-5">{{item.User}}</b></p>
            <p class="chat-content"><img :src="item.Content" alt="" style="max-width: 50%"></p>
            <!-- <p class="chat-time"><i>{{formatDate(item.Timestamp,"hh:mm")}}</i></p> -->
          </div>
          <div v-else>
            <div v-if="item.User" class="chat-one">
              <p class="chat-name"><b class="p-r-5">{{item.User}}: </b></p>
              <p class="chat-content"> <span>{{item.Content}}</span></p> 
              <!-- <p class="chat-time"><i>{{formatDate(item.Timestamp,"hh:mm")}}</i></p> -->
            </div>
            <div></div>
          </div>
        </Card>
      </div>
      
    </div>
    <div class="menu">
      <i-button class="f-r m-5 menu-button" type="success" ghost @click="showFunc('videos')">视频</i-button>
      <i-button class="f-r m-5 menu-button" type="success" ghost @click="showFunc('imgs')">菜单</i-button>
      <i-button class="f-r m-5 menu-button" type="success" ghost @click="showFunc('way')">教学</i-button>
      <i-button class="f-r m-5 menu-button" type="success" ghost @click="showFunc('history')" >历史</i-button>
      <i-button class="f-r m-5 menu-button" type="success" ghost @click="showFunc('record')">记录</i-button>
      <i-button class="f-r m-5 menu-button" ghost type="warning" @click="logout">退出</i-button>
    </div>
    <div class="chat-bottom" ref="footer">
      <Input 
        class="chat-input" 
        @focus="focus" 
        @blur="blur" 
        ref="inputText" 
        v-model="content" 
        name="content" 
        placeholder="请输入聊天内容..." 
        @keyup.13.native="websocketsend(content)" >
        <Select v-model="content" on-change="quickSend" placeholder="" style="width: 35px" slot="append" class="quick">
            <Option v-for="item in quickList" :value="item.Content">{{item.Content}}</Option>
        </Select>
        <Upload 
          slot="prepend"
          class="upload-img"
          :before-upload="handleBeforeUpload"
          :on-exceeded-size="handleMaxSize"
          :max-size="size"
          :show-upload-list="false"
          action="/">
            <Button icon="ios-camera" style="padding: 2px 5px"></Button>
        </Upload>
        <!-- <Icon style="padding: 0 5px" slot="prepend"  type="md-photos" /> -->
        <Icon style="padding: 2px 5px" @click="websocketsend(content)" slot="append" size="25" type="md-send" />
      </Input>
    </div>
    <div class="infos" v-if="showElse">
      <Drawer 
        class="info-content"
        :mask="false"
        placement="left"
        v-model="value1">
        <component :is="currentShow" :ref="currentShow" :initData="getData"></component>
      </Drawer>
    </div>
  </div>
  <div v-else>管理员正在审核登陆情况,请稍等!</div>
</template>

<script>
import { mapActions } from 'vuex'
import videos from './video'
import chat from './chat'
import imgs from './img'
import way from "./way"
import record from "./record"
import history from "./history"
import { setToken,getToken } from '@/libs/util'
import { recordList,historyList,wayList,videoList } from '@/api/data'
export default {

  data() {
    return {
      user:'',
      room:1,
      role:1,
      imgLists:[],
      fullHeight: document.documentElement.clientHeight,
      width: document.documentElement.clientWidth,
      joined: false,
      videoUrl: "",
      videoShow: false,
      size: 2048,
      lastTime:0,
      //add
      value12:"",
      select1:"",
      select2:"",
      timer: {},
      value1: false,
      currentShow:"",
      showElse:false,
      websock: null,
      content: '',
      showWay:false,
      getData:{},
      reloadChat: true,
      contentList:[
      ],
      quickList:[
        {Content:"在的呢,亲"},
        {Content:"我们在加油啦!"},
        {Content:"谢谢老铁!"},
        {Content:"感谢各位!"},
      ]
    }
  },
  components: {
    videos,
    chat,
    imgs,
    way,
    record,
    history,
  },
  computed: {
    maxHeight: function () {
      return {
        'height': (this.fullHeight - 50) + 'px',
        "width": (this.width - 85) + 'px',
      }
    },
    menu: function() {
      return {
        "top": (this.fullHeight - 400) + 'px',
      }
    },
    conWidth: function () {
      return {
        "width": (this.width - 125) + 'px',
      }
    }
    },
  mounted () {
    if (getToken()) {
        this.initWebSocket()
      }
      window.addEventListener('beforeunload', function () {
          setToken("")
      });
    // this.joined = this.$refs.chat.websock.joined
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    showFunc(name,up = false) {
      if (name == this.currentShow) {
        this.showElse = false
        this.currentShow = ""
        return
      }
      this.value1 = this.value1 || !up
      this.showElse = false
      this.showElse = true
      this.currentShow = name
      let parp = {}
      parp.room = this.room
      if (name == "way") {
        wayList(parp).then((res) => {
          this.getData = res.data.data
        })
      } else if (name == "history") {
        historyList(parp).then((res) => {
          this.getData = res.data.data
        })
      } else if (name == "record") {
        recordList(parp).then((res) => {
          this.getData = res.data.data
        })
      } else if (name == "videos") {
        this.getData = this.videoUrl
      } else if (name == "imgs") {
        this.getData = this.imgLists
      }
      
    },
    showWayFun() {
      let parp = {}
      parp.room = this.room
      this.value1 = true
      this.currentShow = "way"
      this.showElse = true
      wayList(parp).then((res) => {
        this.getData = res.data.data
      })
    },
    showRecordFun() {
      this.value1 = true
      this.currentShow = "record"
      this.showElse = true
      recordList().then((res) => {
        this.getData = res.data.data
      })
    },
    quickSend(res) {
      console.log("res")
      console.log(res)
    },
    isPic(res){
      if (res.substring(0, 10) == 'data:image') {
        return true
      }
      return false
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
    focus() {
      this.timer.T = setInterval(() => {
        // 完美解决输入框被软键盘遮挡
        this.$refs.footer.scrollIntoView(false)
      }, 200)
    },
    blur() {
      // 输入框失去焦点时清除定时器
      clearInterval(this.timer.T)
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
    logout () {
      // if (this.$refs.chat && this.$refs.chat.websock) {
      //   this.$refs.chat.websock.close()
      // }
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
      this.joined = res
    },
    showVideo(res) {
      this.videoShow = res
    },
    changeVideo(res) {
        this.videoUrl = res
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
        this.logout()
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
                this.logout()
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
            this.logout()
          }, 1000);
          // this.websock.close()
          return 
        } else if (data.Type == 4 || data.Type == 5) {//照片
          this.addImg({url:data.Content,type: data.Type})
          this.showFunc(this.currentShow,true)
          return //照片
        } else if (data.Type == 6) {
          this.videoUrl = data.Content
          this.showFunc(this.currentShow,true)
          return
        }
        if (data.Timestamp - this.lastTime > 60 * 1000) {
          this.contentList.unshift({User:"show-time-only",Content: "",Timestamp:data.Timestamp,Type: 1001})
          this.lastTime = data.Timestamp
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
        this.$Message.warning("你的链接已经中断!");
        this.logout()
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
    this.user = this.$store.state.user.name
    this.role = this.$store.state.user.role
    this.room = this.$store.state.user.room
    if (this.room == "") {
      this.logout()
    }
    if (this.role == "admin") {
      this.size = 204800
      this.joined = true
    }
  },
  beforeDestroy: function() {
    // this.logout();
  },
  watch: {
    videoUrl:{
      handler() {
        // console.log("this.videoUrlChange")
        // console.log(this.videoUrl)
        // this.videoShow = false
        // setTimeout(() => {
        //   this.videoShow = true
        // }, 1);
      },
      deep:true,
    }
  }
};
</script>

<style>

</style>
