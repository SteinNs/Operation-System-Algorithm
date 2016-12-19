/**
 * Created by Administrator on 2016/12/3.
 */
//import PCB from './PCB'
let PCB =require('./PCB');
let EventEmitter = require('./EventEmitter');


class CPU extends EventEmitter{
  constructor(comparator) {
    super();
    this.waitList = [];
    this.finishList = [];
    this.runningList = [];
    this.blockList = [];
    this.nowTime = 0;
    this.idCount = 1;
    this.timeSlice = Math.ceil(10 * Math.random());
    this.runningTimeSlice = this.timeSlice;
    this.comparator = comparator;
    let avaliable = [10,15,12],
      allocation = new Array(5).fill([0,0,0]),
      max = new Array(5).fill([
      Math.ceil(10 * Math.random()),
      Math.ceil(10 * Math.random()),
      Math.ceil(10 * Math.random())
      ]),
    need = new Array(5).fill([]);
    for(let i = 0;i < need.length;i++){
      for(let j = 0;j < allocation[i].length;j++){
        need[i].push(max[i][j] - allocation[i][j]);
      }
    };
    this.avaliable = avaliable;
    this.allocation = allocation;
    this.max = max;
    this.need = need;
    this.on('req',this.banker);
  }
  timer(type) {
    let t = 0, tsum = 0, timeSlice = this.timeSlice,timeout = false;
    console.log(`timeslice:${this.timeSlice}`);
    let timer = () => {
      if (this.waitList.length != 0) {
        this.waitList.forEach(v => ++v.waitTime);
      }
      if (this.idCount <= 5) {
        let nPCB = this.programMaker();
        this.waitList.push(nPCB);
        if (type !== 'RR')
          this.waitList.sort(this.comparator);
      }
      this[type]();
      // this.print();
      this.nowTime++;
      if (this.waitList.length == 0 && this.runningList.length == 0){
        //
        timeout = true;
        for (let v of this.finishList) {
          tsum += v.waitTime + v.needTime;
        }
        t = tsum / 5;
        console.log(`avg T:${t}`);
      }
      // break;

    }
    (function time() {
      if(timeout) return;
      timer();
      setTimeout(time,1000);
    }());
    // for(let i = 0; i <1000 ; i++){
    // setInterval(timer, 1000);



  }

  // }
  programMaker(){
    let self = this;
    return new PCB(self.idCount++,0,self.nowTime,Math.ceil(10 * Math.random()),0,'wait');
  }
  print(){
    const tmpl = data =>`${data.map(v => `
      id:${v.id},priority:${v.priority},arriveTime:${v.arriveTime},needTime：${v.needTime},runnedTime:${v.runnedTime},state:${v.state},waitTime:${v.waitTime}`).join('')}`;
    console.log(`nowtime:${this.nowTime}`);
    console.log(`waitingList:${tmpl(this.waitList)}`);
    console.log(`runningList:${tmpl(this.runningList)}`);
    console.log(`finishList:${tmpl(this.finishList)}`);
  }
  SJF() {
    if (this.runningList.length !== 0)
      ++this.runningList[0].runnedTime;
    if (this.runningList.length == 0 && this.waitList.length != 0) {
      // console.log(this.waitList);
      this.runningList.push(this.waitList.shift());
      this.runningList[0].state = 'run';
      this.print();
    }

    if (this.runningList.length != 0 && this.runningList[0].runnedTime == this.runningList[0].needTime) {
      this.runningList[0].state = 'finish';
      this.finishList.push(this.runningList.shift());
      if (this.waitList.length != 0) {
          this.runningList.push(this.waitList.shift());
          this.runningList[0].state = 'run';
      }
      this.print();
    }
  }
  RR(){
    if (this.runningList.length !== 0){
      ++this.runningList[0].runnedTime;
      --this.runningTimeSlice;
    }

    if (this.runningList.length == 0 && this.waitList.length != 0) {
      // console.log(this.waitList);
      // let exchange,
      //   succ = false;
      // while(!succ){
      //   let tmp = this.waitList.shift();
      //   this.emit('req',tmp);
      //   this.on('res',(exchange = (result) => {
      //     if(result){
      //       succ = true;
      //       this.runningList.push(tmp);
      //       this.runningList[0].state = 'run';
      //     }
      //     else{
      //       tmp.state = 'block';
      //       this.blockList.push(tmp);
      //     }
      //   }));
      //   this.remove("res",exchange);
      // }

      this.runningList.push(this.waitList.shift());
      this.runningList[0].state = 'run';
      this.print();

    }
    if (this.runningList.length != 0
      && this.runningList[0].runnedTime == this.runningList[0].needTime) {
      this.runningList[0].state = 'finish';
      this.finishList.push(this.runningList.shift());
      this.runningTimeSlice = this.timeSlice;
      if (this.waitList.length != 0) {
        this.runningList.push(this.waitList.shift());
        this.runningList[0].state = 'run';
        // let tmp = this.waitList.shift(),
        //   exchange;
        // this.emit('req',tmp);
        // this.on('res',(exchange = (result) => {
        //   if(result){
        //     this.runningList.push(tmp);
        //     this.runningList[0].state = 'run';
        //   }
        //   else{
        //     tmp.state = 'block';
        //     this.blockList.push(tmp);
        //   }
        // }));
        // this.remove("res",exchange);
      }
      this.print();
    }
    if(this.waitList.length != 0 && this.runningTimeSlice == 0){
      this.runningList[0].state = 'wait';
      this.waitList.push(this.runningList.shift());
      // let tmp = this.waitList.shift(),
      //   exchange;
      // this.emit('req',tmp);
      // this.on('res',(exchange = (result) => {
      //   if(result){
      //     this.runningList.push(tmp);
      //     this.runningList[0].state = 'run';
      //   }
      //   else{
      //     tmp.state = 'block';
      //     this.blockList.push(tmp);
      //   }
      // }));
      // this.remove("res",exchange);
      this.runningList.push(this.waitList.shift());
      this.runningList[0].state = 'run';
      this.runningTimeSlice = this.timeSlice;
      this.print();
    }


  }
  HRRN() {
      if (this.runningList.length != 0)
        ++this.runningList[0].runnedTime;
      if (this.runningList.length == 0 && this.waitList.length != 0) {
        this.runningList.push(this.waitList.shift());
        this.runningList[0].state = 'run';
        this.print();
      }
      this.waitList.forEach(v => v.priority = (v.waitTime + v.needTime) / v.needTime);
      this.waitList.sort(this.comparator);
      if (this.runningList.length != 0 && this.runningList[0].runnedTime == this.runningList[0].needTime) {
        this.runningList[0].state = 'finish';
        this.finishList.push(this.runningList.shift());
        if (this.waitList.length != 0) {

          this.runningList.push(this.waitList.shift());
          this.runningList[0].state = 'run';
        }
        this.print();
      }
      // this.waitList.forEach(v => v.priority = (v.waitTime + v.needTime) / v.needTime);
      // this.waitList.sort(this.comparator);
      if (this.waitList.length != 0 && (this.runningList[0].priority < this.waitList[0].priority)) {
        this.runningList[0].state = 'wait';
        this.waitList.push(this.runningList.shift());
        this.runningList.push(this.waitList.shift());
        this.runningList[0].state = 'run';
        this.print();
      }

  }
  banker(e){
    let request = e.request(),
      need = e.need,
      avaliable = this.avaliable,
      allocation = this.allocation;
    for(let i = 0;i < request.length; i++){
      if(request[i] >  need[i])
        return false;
    }
    for(let i = 0;i < request.length;i++){
      if(request[i] > avaliable[i])
        return false;
    }
    for(let i = 0;i < request.length;i++ ) {
      avaliable[i] -= request[i];
      need[i] -= request[i];
      allocation[i] += request[i];
    }
    if(!this.safe()){
      for(let i = 0;i < request.length;i++ ) {
        avaliable[i] += request[i];
        need[i] += request[i];
        allocation[i] -= request[i];
      }
      // return false;
      this.emit('res',false);
    }
    this.emit("res",true);
    // return true;
  }
  safe(){
    let work = this.avaliable.copyWithin(0),
      finish = new Array(this.blockList.length + this.waitList.length).fill(false),
      allList = this.waitList.concat(this.blockList),
      safeList = [],
      ok = 1;
    while(ok){
      ok = 0;
      for(let i = 0; i < allList.length;i++){
        if(!finish[i] && allList[i].need[0] < work[0]
          && allList[i].need[1] < work[1]
          && allList[i].need[2] < work[2]){
          ok = 1;
          finish[i] = true;
          work[0] += allList[i].allocation[0];
          work[1] += allList[i].allocation[1];
          work[2] += allList[i].allocation[2];
          safeList.push(allList[i].id);
        }
      }
    }
    for(let i = 0; i < allList.length;i++){
      if(!finish[i])
        return false;
    }
    return true;
  }
}

module.exports = /*default*/ CPU;
