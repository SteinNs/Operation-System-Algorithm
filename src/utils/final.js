/**
 * Created by Administrator on 2016/12/14.
 */
/**
 * Created by Administrator on 2016/12/3.
 */
//import PCB from './PCB'
let PCB =require('./PCB');
let EventEmitter = require('./EventEmitter');


class CPU extends EventEmitter{
  constructor(comparator,jobListLength,avaliable) {
    super();
    this.waitList = [];
    this.finishList = [];
    this.runningList = [];
    this.blockList = [];
    this.nowTime = 0;
    this.idCount = 1;
    this.timeSlice = Math.ceil(3 * Math.random());
    this.runningTimeSlice = this.timeSlice;
    this.comparator = comparator;
    this.avaliable = avaliable;
    this.jobListLength = jobListLength;
    let jobList = [];
    for(let i = 0;i < jobListLength;i++){
      jobList[i] = this.programMaker();
    };
    // console.log(`joblist:${jobList}`);
    this.jobList = jobList.sort(comparator);

    for(let i = 0;i < 10;i++){
        // this.blockList.push(this.jobList[i]);
        // this.jobList.splice(i,1);
        let tmp = this.jobList.shift();
        if(tmp !== undefined)
          this.blockList.push(tmp);
      else
        break;
    }
  }
  timer(type) {
    // this.on('req',this.banker);
    let t = 0, tsum = 0, timeSlice = this.timeSlice,timeout = false;
    console.log(`timeslice:${this.timeSlice}`);
    let timer = () => {
      if (this.waitList.length != 0) {
        this.waitList.forEach(v => ++v.waitTime);
      }
      if (this.runningList.length !== 0){
        ++this.runningList[0].runnedTime;
        --this.runningTimeSlice;
      }

      this[type]();
      this.randomRequest();
      this.nowTime++;

      if (this.waitList.length == 0 && this.runningList.length == 0 && this.jobList.length == 0 && !this.blockList.length){
        timeout = true;
        for (let v of this.finishList) {
          tsum += v.waitTime + v.needTime;
        }
        t = tsum / this.jobListLength;
        console.log(`avg T:${t}`);
      }
    }
    (function time() {

      if(timeout) return;
      timer();
      setTimeout(time,1000);
    }());
  }
  randomRequest(){
    let exchange;
    for(let i = 0;i < this.blockList.length;i++){
      if(this.banker(this.blockList[i],this,false)){
        this.blockList[i].state = 'wait';
        this.waitList.push(this.blockList[i]);
        this.blockList.splice(i,1);
      }
    }
    if(this.runningList.length){
      if(!this.banker(this.runningList[0],this,false)){
        this.runningList[0].state = 'block';
        this.blockList.push(this.runningList.shift());
      }
    }
  }
  programMaker(){
    let self = this;
    return new PCB(self.idCount++,0,Math.ceil(100 * Math.random()),Math.ceil(10 * Math.random()),0,'block');
  }
  print(){
    const tmpl = data =>`${data.map(v => `
      id:${v.id},priority:${v.priority},arriveTime:${v.arriveTime},needTime：${v.needTime},runnedTime:${v.runnedTime},state:${v.state},waitTime:${v.waitTime},need:${v.need},max:${v.max},allocation:${v.allocation}`).join('')}`;
    console.log(`nowtime:${this.nowTime}`);
    console.log(`waitingList:${tmpl(this.waitList)}`);
    console.log(`runningList:${tmpl(this.runningList)}`);
    console.log(`finishList:${tmpl(this.finishList)}`);
    console.log(`blocklist:${tmpl(this.blockList)}`);
    // console.log(`joblist:${tmpl(this.jobList)}`);
  }
  RR(){
    if (this.runningList.length == 0 && this.waitList.length != 0) {
      this.runningList.push(this.waitList.shift());
      this.runningList[0].state = 'run';
      this.print();

    }
    if (this.runningList.length != 0
      && this.runningList[0].runnedTime >= this.runningList[0].needTime
      && this.runningList[0].max.toString() === this.runningList[0].allocation.toString()) {
      this.runningList[0].state = 'finish';
      for(let i = 0;i < this.runningList[0].allocation.length;i++){
        this.avaliable[i] += this.runningList[0].allocation[i];
        this.runningList[0].allocation[i] = 0;
      }
      this.finishList.push(this.runningList.shift());
      this.runningTimeSlice = this.timeSlice;
      if (this.waitList.length != 0) {
        this.runningList.push(this.waitList.shift());
        this.runningList[0].state = 'run';
      }
      if(this.jobList.length !== 0)
        this.blockList.push(this.jobList.shift());
      this.print();
    }
    if(this.waitList.length != 0 && this.runningTimeSlice == 0){
      this.runningList[0].state = 'wait';
      this.waitList.push(this.runningList.shift());
      this.runningList.push(this.waitList.shift());
      this.runningList[0].state = 'run';
      this.runningTimeSlice = this.timeSlice;
      this.print();
    }


  }
  banker(e,ctx,all){
    let request = e.request(all),
      need = e.need,
      avaliable = ctx.avaliable,
      allocation = e.allocation;
    for(let i = 0;i < request.length; i++){
      if(request[i] >  need[i]){
        return false;
      }
    }
    for(let i = 0;i < request.length;i++){
      if(request[i] > avaliable[i]){
        return false;
      }
    }
    for(let i = 0;i < request.length;i++ ) {
      avaliable[i] -= request[i];
      need[i] -= request[i];
      allocation[i] += request[i];
    }
    if(!ctx.safe()){
      for(let i = 0;i < request.length;i++ ) {
        avaliable[i] += request[i];
        need[i] += request[i];
        allocation[i] -= request[i];
      }
      return false;
    }
    e.getNeed();
    return true;
  }
  safe(){
    let work = this.avaliable.copyWithin(0),
      runningList = this.runningList.copyWithin(0),
      blockList = this.blockList.copyWithin(0),
      finish = new Array(runningList.length + blockList.length).fill(false),
      allList = runningList.concat(blockList),
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
