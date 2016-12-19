/**
 * Created by Administrator on 2016/11/26.
 */
class PriorityQueue extends Array{
  constructor(comparator){
    super();
    this.comparetor = comparator;

  }
  front(){
    return this[0];
  }
  empty(){
    return this.length == 0;
  }
  print(){
    console.log(this.toString())
  }
  clear(){
    this.length = 0;
  }
  push(v){
    super.push(v);
    this.sort(this.comparator);
  }

};

// export default PriorityQueue;
exports = PriorityQueue
