/**
 * Created by Administrator on 2016/12/3.
 */
let EventEmitter = require('./EventEmitter');
class PCB /*extends EventEmitter*/{
  constructor(id = 0,
              priority = 0,
              arriveTime = 0,
              needTime = 0,
              runnedTime = 0,
              state = 'block'){
    this.id = id;
    this.arriveTime = arriveTime;
    this.needTime = needTime;
    this.runnedTime = runnedTime;
    this.state = state;
    this.waitTime = 0;
    this.priority = (this.waitTime + this.needTime)/this.needTime;
    this.allocation = [0,0,0];
    this.max = [Math.ceil(25 * Math.random()),Math.ceil(15 * Math.random()),Math.ceil(20 * Math.random())];
    this.need = [];
    this.getNeed();
  }
  getNeed(){
    let need = [];
    for(let i = 0;i < 3;i++){
      need[i] = this.max[i] - this.allocation[i];
    }
    this.need = need;
  }
  request(all){
    if(all)
      return this.need;
    else
      return [Math.round(5 * Math.random()),Math.round(3 * Math.random()),Math.round(4 * Math.random())];
  }
};

// export default PCB;
module.exports = PCB;
