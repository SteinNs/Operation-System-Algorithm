/**
 * Created by Administrator on 2016/12/3.
 */
class HDDController{
  constructor(start,jobList,direction){
    this.start = start;
    this.jobList = jobList;
    this.direction = direction;
  }
  FCFS(){
    let sum = 0,
      jobList = this.jobList.copyWithin(0),
      visited = this.start,
      distance = (a,b) => Math.abs(a - b);
    for(let i = 0;i < jobList.length;i++){
      let start = visited;
        visited = jobList[i];
      this.print(visited,distance(visited,start));
      sum += distance(visited,start);

    }
    return sum/jobList.length;

  }
  SSTF(){
    let sum = 0,
      jobList = this.jobList.copyWithin(0),
      length = jobList.length,
      visited = this.start,
      visitedIndex,
      distance = (a,b) => Math.abs(a - b);
    while(jobList.length){
      let nearest = Number.MAX_VALUE,
        start = visited;
      for(let i = 0; i < jobList.length;i++){
        if(distance(jobList[i], start) < distance(nearest,start)){
          nearest = jobList[i];
          visitedIndex = i;
        }
      }
      visited = nearest;
      jobList.splice(visitedIndex,1);
      this.print(visited,distance(visited,start));
      sum += distance(visited,start);
    }
    return sum/length;
  }
  SCAN(){
    let sum = 0,
      jobList = this.jobList.copyWithin(0),
      length = jobList.length,
      visited = this.start,
      visitedIndex,
      distance = (a,b) => Math.abs(a - b),
      direction = this.direction;
    while(jobList.length){
      let nearest = Number.MAX_VALUE,
        start = visited;
      if(direction == 'in-out'){
        for(let i = 0; i < jobList.length;i++){
          if(distance(jobList[i],start) < distance(nearest,start) && jobList[i] > start){
            nearest = jobList[i];
            visitedIndex = i;
          }
        }
        if(nearest !== Number.MAX_VALUE){
          visited = nearest;
          jobList.splice(visitedIndex,1);
          this.print(visited,distance(visited,start));
          sum += distance(visited,start);
        }
        else
          direction = 'out-in';
      }
      else {
        for (let i = 0; i < jobList.length; i++) {
          if (distance(jobList[i],start) < distance(nearest,start) && jobList[i] < start) {
            nearest = jobList[i];
            visitedIndex = i;
          }
        }
        if(nearest !== Number.MAX_VALUE){
          visited = nearest;
          jobList.splice(visitedIndex,1);
          this.print(visited,distance(visited,start));
          sum += distance(visited,start);
        }
        else
          direction = 'in-out';
      }

    }
    return sum/length;


  }
  CSCAN(){
    let sum = 0,
      jobList = this.jobList.copyWithin(0),
      length = jobList.length,
      visited = this.start,
      visitedIndex,
      distance = (a,b) => Math.abs(a - b),
      direction = this.direction;
    console.log(jobList);
    if(direction == 'in-out'){
      while(jobList.length){
        let nearest = Number.MAX_VALUE,
          start = visited;
        for(let i = 0; i < jobList.length;i++){
          if(distance(jobList[i],start) < distance(nearest,start) && jobList[i] > start){
            nearest = jobList[i];
            visitedIndex = i;
          }
        }
        if(nearest !== Number.MAX_VALUE){
          visited = nearest;
        }
        else{
          let min = Number.MAX_VALUE,
            minIndex;
          for(let i = 0;i < jobList.length;i++){
            if(jobList[i] < min){
              min = jobList[i];
              visitedIndex = i;
            }
          }
          visited = min;
        }
        jobList.splice(visitedIndex,1);
        this.print(visited,distance(visited,start));
        sum += distance(visited,start);
      }
    }
    else{
      while(jobList.length){
        let nearest = Number.MAX_VALUE,
          start = visited;
        for(let i = 0; i < jobList.length;i++){
          if(distance(jobList[i],start) < distance(nearest,start) && jobList[i] < start){
            nearest = jobList[i];
            visitedIndex = i;
          }
        }
        if(nearest !== Number.MAX_VALUE){
          visited = nearest;
        }
        else{
          let max = Number.MIN_VALUE;
          for(let i = 0;i < jobList.length;i++){
            if(jobList[i] > max){
              max = jobList[i];
              visitedIndex = i;
            }
          }
          visited = max;
        }
        jobList.splice(visitedIndex,1);
        this.print(visited,distance(visited,start));
        sum += distance(visited,start);
      }
    }
    return sum/length;
  }
  print(visited,distance){
    console.log(`被访问的下一个磁道号:${visited},移动距离:${distance}`);
  }
  init(type){
    let length = this[type]();
    console.log(`平均寻道长度:${length}`);

  }
}

module.exports = HDDController;
