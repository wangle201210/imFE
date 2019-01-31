<template>
  <div style="min-height: 100px">
    <div v-if="joined">
    <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="content" name="content" placeholder="请输入聊天内容..." onkeydown="if(event.keyCode==13)return false;" class="m-tb-5"></Input>
    <i-button size="small" class="f-r m-5" ghost type="warning" @click="logout">退出</i-button>
    <i-button size="small" class="f-r m-5" type="success" ghost @click="showWayFun()" >教学</i-button>
    <i-button size="small" class="f-r m-5" type="success" ghost @click="showHistoryFun()" >历史</i-button>
    <i-button size="small" class="f-r m-5" type="success" ghost @click="showRecordFun()" >记录</i-button>
    <i-button size="small" class="f-r m-5" type="primary" @click="websocketsend(content)" >发送</i-button>
    <!-- <Input @change="uploadPhoto($event)" type="file" ></Input> -->

    <Upload 
      :before-upload="handleBeforeUpload"
      :on-exceeded-size="handleMaxSize"
      :max-size="2048"
      :show-upload-list="false"
      action="//jsonplaceholder.typicode.com/posts/">
        <Button size="small" icon="ios-camera" class="m-5"></Button>
    </Upload>
    <div class="chat-record">
      <Card v-for="item in contentList" class="m-tb-5">
        <div v-if="item.Type == 0 && role == 'admin' && item.User != user">
          <div><b class="p-r-5">{{item.User}}</b> <i>{{formatDate(item.Timestamp,"hh:mm:ss")}}</i></div>
          <div>正在申请进入房间</div>
          <Button class="m-5" type="success" @click="acc(item.User)">允许</Button>
          <Button class="m-5" type="warning" @click="den(item.User)">下线</Button>
        </div>
        <div v-else-if="isPic(item.Content)">
          <div v-if="item.User"><b class="p-r-5">{{item.User}}</b> <i>{{formatDate(item.Timestamp,"hh:mm:ss")}}</i></div>
          <div><img :src="item.Content" alt="" style="max-width: 80%"></div>
        </div>
        <div v-else>
          <div v-if="item.User"><b class="p-r-5">{{item.User}}</b> <i>{{formatDate(item.Timestamp,"hh:mm:ss")}}</i></div>
          <div>{{item.Content}}</div>
        </div>
      </Card>
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
        contentList: [],
        showWay:false,
        joined: false,
        getData:{}
      }
    },
    mounted () {
      if (getToken()) {
        this.initWebSocket()
      }
      window.addEventlistener('beforeunload',setToken(""))
    },
    computed: {
    },
    methods: {
      isPic(res){
        if (res.substring(0, 10) == 'data:image') {
          return true
        }
        return false
      },
      handleMaxSize (file) {
        this.$Message.warning('图片最大可上传2M!');
      },
      handleBeforeUpload(file) {
        if (file.size <= 2*1024*1024) {
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

        } else if (data.Type == 3 && data.User == this.user) {//自己的账号别人再次登陆不用提示
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
      }, 
      websocketclose(e){ //关闭 
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

