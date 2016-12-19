<template>
  <div id="app">
    <div class="now-time">nowTime:{{this.nowTime}}</div>
    <div class='runlist'>
      runlist:

      <pcb v-for='run in runList' :item = 'run'></pcb>
    </div>
    <div class="waitlist">
      waitlist:
      <pcb v-for='wait in waitList' :item = 'wait'></pcb>
    </div>
    <div class="blocklist">
      blocklist:
      <pcb v-for='block in blockList' :item = 'block'></pcb>
    </div>
    <div class="finishlist">
      finishlist:
      <pcb v-for='finish in finishList' :item = 'finish'></pcb>
    </div>

  </div>
</template>

<script>

import pcb from './components/PCB';
import Final from './utils/final';

export default {
  name: 'app',
  components: {
    pcb
  },
  data(){
    return{
      final: "",
      workLis1t:1,//this.final.workList,
      finishLi1st:2,//this.final.finishList,
      blockLis1t:3,//this.final.blockList,
      //runList:4,//this.final.runningList,
      nowTim1e: 5//this.final.nowTime
    }
  },
  mounted(){
    this.final = new Final((a,b) => a.arriveTime - b.arriveTime,100,[50,30,40]);
    this.final.timer('RR');
    console.log(this.final)
  },
  watch: {
    'final.runningList': function (a,b) {
        console.error(this.final.runningList.length != 0)
        if(this.final.runningList.length != 0) {


          this.runList = a
        } else {
          console.error(b)


        }


      }
  },
  computed:{
    waitList(){
      return this.final.waitList;
    },
    finishList(){
      return this.final.finishList;
    },
    blockList(){
      return this.final.blockList;
    },
   /*runList(){
      return this.final.runningList;
    },*/
    nowTime(){
      return this.final.nowTime;
    }
  }
}
</script>

<style>
body {\
  background-color:white;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color:white;
  color: #2c3e50;
  margin-top: 60px;
}
.runlist,.waitlist,.blocklist,.finishlist{
      display:flex;
      flex-direction:row;
      width:1200px;
      border:1px solid black;
}
</style>
