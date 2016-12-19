import Vue from 'vue';
import App from './App';
// import VueRouter from '';
//import CPU from './utils/CPU';
// import PriorityQueue from './utils/PriorityQueue';
let CPU = require('./utils/CPU');
// let PriorityQueue = require('./utils/PriorityQueue');
let RAM = require('./utils/RAM');
let HDD = require('./utils/HDD');
let Final = require('./utils/final');
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
// let hrrn = new PriorityQueue((a,b)=>a.priority - b.priority);
// let sjf = new PriorityQueue((a,b)=>a.needTime - b.needTime);

// let cpu = new CPU((a,b)=>a.needTime - b.needTime);
// cpu.timer('SJF');


// let cpu = new CPU((a,b)=>a.id - b.id);
// cpu.timer('RR');
// let cpu = new CPU((a,b)=>a.needTime - b.needTime);

// let cpu = new CPU((a,b)=>b.priority - a.priority);
// cpu.timer('HRRN');

// let ram = new RAM();
// ram.init('BF');

// let hdd = new HDD(100,[55,58,39,18,90,160,150,38,184],'in-out');
// // hdd.init('CSCAN');
// let final = new Final((a,b) => a.arriveTime - b.arriveTime,100,[50,30,40]);
// final.timer('RR');
