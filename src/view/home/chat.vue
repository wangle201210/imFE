<template>
  <div>
    <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="content" name="content" placeholder="请输入聊天内容..." onkeydown="if(event.keyCode==13)return false;" class="m-tb-5"></Input>
    <i-button class="f-r m-5" ghost type="warning" @click="logout">退出</i-button>
    <i-button class="f-r m-5" type="success" ghost @click="showWayFun()" >菜方</i-button>
    <i-button class="f-r m-5" type="primary" @click="websocketsend(content)" >发送</i-button>
    <div class="chat-record">
      <Card v-for="item in contentList" class="m-tb-5">
        <div v-if="item.User"><b class="p-r-5">{{item.User}}</b> <i>{{formatDate(item.Timestamp,"hh:mm:ss")}}</i></div>
        <div>{{item.Content}}</div>
      </Card>
    </div>
    <way ref="way"></way>
  </div>
</template>

<script>
  import way from "./way"
  export default {
    props: {
      user: '',
      room: '',
    },
    components: {
      way
    },
    data() {
      return {
        websock: null,
        content: '',
        contentList: [],
        showWay:false,
      }
    },
    mounted () {
      this.initWebSocket()
    },
    computed: {
    },
    methods: {
      logout(){
        this.$emit("logout")
      },
      showWayFun() {
        this.$refs.way.show = true
      },
      initWebSocket(){ //初始化weosocket 
        var uri = 'ws://ws.iwangle.me/ws/join?uname='+this.user+'&password=password'+'&room='+this.room;//ws地址
        // var uri = 'ws://localhost:8081/ws/join?uname='+this.user+'&password=password'+'&room='+this.room;//ws地址
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
        if (data.Type == 0) {//进入
          data.Content = data.User+'进入了聊天室.'
          data.User = ''
        } else if (data.Type == 1) {//离开
          if (data.User == this.user) {
            return //自己的账号别人下线不用提示
          }
          data.Content = data.User+'离开了聊天室.'
          data.User = ''
        } else if (data.Type == 3 && data.User == this.user) {
          return //自己的账号别人登陆不用提示
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
    }
  }
</script>

