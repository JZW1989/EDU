
//添加事件
function addEvent(ele,type,fn){
  if(ele.addEventListener)return ele.addEventListener(type,fn);
  else return ele.attachEvent('on'+type,fn);
}

//ajax的GET方法
function ajax_get(url,opt,callback){
    var xhr=new XMLHttpRequest();

    var opt=serialize(opt);
    url=url+'?'+opt;
    xhr.open('GET',url,true);
    xhr.send(null);

    xhr.onload=function(){
      callback(xhr.responseText);
    }
  }



//序列化参数
function serialize(obj){
  var arr=[];
  for(var i in obj){
    if(!obj.hasOwnProperty(i)) continue;
        if(typeof obj[i]==='function') continue;
    arr.push(encodeURIComponent(i)+'='+encodeURIComponent(obj[i]));
  }
  return arr.join('&');
}

function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }

var emitter = {
  // 注册事件
  on: function(event, fn) {
    var handles = this._handles || (this._handles = {}),
      calls = handles[event] || (handles[event] = []);

    // 找到对应名字的栈
    calls.push(fn);

    return this;
  },
  // 解绑事件
  off: function(event, fn) {
    if(!event || !this._handles) this._handles = {};
    if(!this._handles) return;

    var handles = this._handles , calls;

    if (calls = handles[event]) {
      if (!fn) {
        handles[event] = [];
        return this;
      }
      // 找到栈内对应listener 并移除
      for (var i = 0, len = calls.length; i < len; i++) {
        if (fn === calls[i]) {
          calls.splice(i, 1);
          return this;
        }
      }
    }
    return this;
  },
  // 触发事件
  emit: function(event){
    var args = [].slice.call(arguments, 1),
      handles = this._handles, calls;

    if (!handles || !(calls = handles[event])) return this;
    // 触发所有对应名字的listeners
    for (var i = 0, len = calls.length; i < len; i++) {
      calls[i].apply(this, args)
    }
    return this;
  }
}


function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }

  // 赋值属性
  // extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
  function extend(o1, o2){
    for(var i in o2) if(typeof o1[i] === 'undefined'){
      o1[i] = o2[i]
    } 
    return o1
  }