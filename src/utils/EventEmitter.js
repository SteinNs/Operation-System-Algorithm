/**
 * Created by Administrator on 2016/12/13.
 */
class EventEmitter{
  constructor(){
    this.eventsList = {};
  }
  on(e,cb){
    if(!this.eventsList[e]){
      this.eventsList[e] = [];
    }
    this.eventsList[e].push(cb);
  }
  emit(e,...args){
    let cbs = this.eventsList[e];
    if(!cbs || cbs.length === 0){
      return false;
    };
    for( let cb of cbs){
      cb(...args);
    }
  }
  remove(e,cb){
    let cbs = this.eventsList[e];
    if(!cbs){
      return false;
    }
    if(!cb){
      cbs && (cbs.length == 0);
    }
    else{
      for (let l = cbs.length - 1;l >= 0; l--){
        let _cb = cbs[l];
        if(_cb === cb){
          cbs.splice(l,1);
        }
      }
    }

  }
}

module.exports = EventEmitter;
