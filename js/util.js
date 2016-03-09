function addEvent(ele,type,fn){
  if(ele.addEventListener)return ele.addEventListener(type,fn);
  else return ele.attachEvent('on'+type,fn);
}