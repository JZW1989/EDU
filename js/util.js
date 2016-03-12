/*工具库*/

/*转换成数组*/
var toArray = function(s){
     try{
         return Array.prototype.slice.call(s);
     } catch(e){
             var arr = [];
            for(var i = 0,len = s.length; i < len; i++){
                   arr[i] = s[i];  //据说这样比push快
             }
              return arr;
     }
 }

//添加事件
function addEvent(ele,type,fn){
  if(ele.addEventListener)return ele.addEventListener(type,fn);
  else return ele.attachEvent('on'+type,fn);
}

//ajax的GET方法
// function ajax_get(url,opt,callback){
//     var xhr=new XMLHttpRequest();

//     var opt=serialize(opt);
//     url=url+'?'+opt;
//     xhr.open('GET',url,true);
//     xhr.send(null);

//     xhr.onload=function(){
//       callback(xhr.responseText);
//     }
//   }

function ajax_get(url,options,callback){
  var XHR=(function(){//创建XHR对象
    if(typeof window.XMLHttpRequest!=='undefined')return new XMLHttpRequest();
    else if(typeof ActiveXObject!=='undefined'){
      var xmlhttp;
      try{
        xmlhttp=new ActiveXObject('MSXML2.XMLHttp');
      }catch(e){
        try{
          xmlhttp=new ActiveXObject('Microsoft.XMLHttp');
        }catch(e){
          throw new Error('您的浏览器不支持ajax');
        }
      }
      return xmlhttp;
    }
  })();

  var opt=serialize(options);

  XHR.onreadystatechange=function(){
    if(XHR.readyState==4){
      if((XHR.status>=200&&XHR.status<300)||XHR.status==304){
        callback(XHR.responseText);
      }else{//报错
        throw new Error('获取数据错误！错误代号：' + XHR.status + '，错误信息：' + XHR.statusText);
      } 
    }
  }

  XHR.open('GET',url+'?'+opt,true);
  XHR.send(null);
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






if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function forEach( callback, thisArg ) {
    var T, k;
    if ( this == null ) {
      throw new TypeError( "this is null or not defined" );
    }
    var O = Object(this);
    var len = O.length >>> 0; 
    if ( typeof callback !== "function" ) {
      throw new TypeError( callback + " is not a function" );
    }
    if ( arguments.length > 1 ) {
      T = thisArg;
    }
    k = 0;
    while( k < len ) {
      var kValue;
    if ( k in O ) {
      kValue = O[ k ];
      callback.call( T, kValue, k, O );
    }
      k++;
    }
  };
}

function isIE(){ //ie? 
   if (window.navigator.userAgent.toLowerCase().indexOf("msie")>=1) {
     return true; 
   }
   else {
      return false; 
   }
    
} 

if(!isIE()){ //firefox innerText define
   HTMLElement.prototype.__defineGetter__("innerText", 
    function(){
     var anyString = "";
     var childS = this.childNodes;
     for(var i=0; i<childS.length; i++) {
      if(childS[i].nodeType==1)
       anyString += childS[i].tagName=="BR" ? '\n' : childS[i].innerText;
      else if(childS[i].nodeType==3)
       anyString += childS[i].nodeValue;
     }
     return anyString;
    } 
   ); 
   HTMLElement.prototype.__defineSetter__(     "innerText", 
    function(sText){ 
     this.textContent=sText; 
    } 
   ); 
}