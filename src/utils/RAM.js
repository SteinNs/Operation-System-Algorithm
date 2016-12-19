/**
 * Created by Administrator on 2016/12/3.
 */
class RAMController{
  constructor(){
    this.avaliable = [{addr:0,size:640}];
    this.allocation = [];
    this.rsize = 20;
  }
  FF(request,ctx){
    let avaliable = ctx.avaliable,
      allocation = ctx.allocation,
      rsize = ctx.rsize;
    for(let i = 0;i < avaliable.length;i++){
      if(request.size < avaliable[i].size){
        if(avaliable[i].size - request.size <= rsize){
          allocation.push({user:request.id,
            addr:avaliable[i].addr,
            size:avaliable[i].size});
          avaliable.splice(i,1);
        }
        else{
          allocation.push({user:request.id,
            addr:avaliable[i].addr,
            size:request.size});
          avaliable[i].size = avaliable[i].size - request.size;
          avaliable[i].addr = avaliable[i].addr + request.size;
        }
        break;
      }
    }
  }
  BF(request,ctx){
    let avaliable = ctx.avaliable,
      allocation = ctx.allocation,
      rsize = ctx.rsize;
    avaliable.sort((a,b) => a.size - b.size);
    for(let i = 0;i < avaliable.length;i++){
      if(request.size < avaliable[i].size){
        if(avaliable[i].size - request.size <= rsize){
          allocation.push({user:request.id,
            addr:avaliable[i].addr,
            size:avaliable[i].size});
          avaliable.splice(i,1);
        }
        else{
          allocation.push({user:request.id,
            addr:avaliable[i].addr,
            size:request.size});
          avaliable[i].size = avaliable[i].size - request.size;
          avaliable[i].addr = avaliable[i].addr + request.size;

        }
        break;
      }
    }

  }
  recycle(allocation,ctx){
    let avaliable = ctx.avaliable;
    let prev =  avaliable.findIndex((e,i,a) => (e.addr + e.size) == allocation.addr),
      next = avaliable.findIndex((e,i,a) => e.addr == (allocation.size + allocation.addr));
    if(prev !== -1 && next !== -1){
      avaliable[prev].size += allocation.size + avaliable[next].size;
      avaliable.splice(next,1);
    }
    else if(prev !== -1){
      avaliable[prev].size += allocation.size;
    }
    else if(next !== -1){
      avaliable[next].addr = allocation.addr;
      avaliable[next].size += allocation.size;
    }
    else {
      let next = avaliable.findIndex((e,i,a) => e.addr > allocation.addr);
      if(next == 0)
        avaliable.unshift({addr:allocation.addr,
          size:allocation.size,});
      else
        avaliable.splice(next - 1,0,{addr:allocation.addr,
        size:allocation.size});
    }
    ctx.allocation.splice(ctx.allocation.findIndex(e => e.addr == allocation.addr),1);
  }
  *jobGenerator(type){
    let add = this[type],
      recycle = this.recycle,
      allocation = this.allocation;

    console.log(`作业1	申请	130`);
    add({id:1,size:130},this);
    yield;
    console.log(`作业2	申请	60`);
    add({id:2,size:60},this);
    yield;
    console.log(`作业3	申请	100`);
    add({id:3,size:100},this);
    yield;
    console.log(`作业2	释放	60`);
    recycle(allocation.find(e => e.user == 2),this);
    yield;
    console.log(`作业4	申请	200`);
    add({id:4,size:200},this);
    yield;
    console.log(`作业3	释放	100`);
    recycle(allocation.find(e => e.user == 3),this);
    yield;
    console.log(`作业1	释放	130`);
    recycle(allocation.find(e => e.user == 1),this);
    yield;
    console.log(`作业5	申请	140`);
    add({id:5,size:140},this);
    yield;
    console.log(`作业6	申请	60`);
    add({id:6,size:60},this);
    yield;
    console.log(`作业7	申请	50`);
    add({id:7,size:50},this);
    yield;
    console.log(`作业8	申请	60`);
    add({id:8,size:60},this);
    yield ;
  }
  print(){
    const tmpl = data =>`${data.map(v => `      
      user:${v.user},addr:${v.addr},size：${v.size}`).join('')}`;
    console.log(`avaliable:${tmpl(this.avaliable)}`);
    console.log(`allocation:${tmpl(this.allocation)}`);
  }
  init(type){
    let jobGenerator = this.jobGenerator(type),
      avaliable = this.avaliable,
      allocation = this.allocation;
    this.print();
    while(!jobGenerator.next().done){
        this.print();
    }
  }
};
module.exports = RAMController;
