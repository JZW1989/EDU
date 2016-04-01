/*工具库*/

/*转换成数组*/
var toArray = function(s){
     try{
         return Array.prototype.slice.call(s);
     } catch(e){
             var arr = [];
            for(var i = 0,len = s.length; i < len; i++){
                   arr[i] = s[i];  
             }
              return arr;
     }
 }

//添加事件
function addEvent(ele,type,fn){
  if(ele.addEventListener)return ele.addEventListener(type,fn);
  else return ele.attachEvent('on'+type,fn);
}

//ajax get方法
function get(url,options,callback){
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

  if(typeof options==='object'){
    var opt=serialize(options);
    url+='?'+opt;
  }

  XHR.onreadystatechange=function(){
    if(XHR.readyState==4){
      if((XHR.status>=200&&XHR.status<300)||XHR.status==304){
        callback(XHR.responseText);
      }else{//报错
        throw new Error('获取数据错误！错误代号：' + XHR.status + '，错误信息：' + XHR.statusText);
      } 
    }
  }

  try{
    XHR.open('GET',url,true);
    XHR.send(null);
  }catch(e){//IE 8跨域访问
    var XDR=new XDomainRequest();
    XDR.open('GET',url,true);
    XDR.send(null);
    XDR.onload=function(){
      alert(XDR.responseText);
      callback(XDR.responseText);
    }
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

//转换节点并输出
function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }

//订阅发布
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

  // 赋值属性
  // extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
  function extend(o1, o2){
    for(var i in o2) if(typeof o1[i] === 'undefined'){
      o1[i] = o2[i]
    } 
    return o1
  }

//foreach兼容
if (!Array.prototype.forEach) {  
    Array.prototype.forEach = function(fun /*, thisp*/){  
        var len = this.length;  
        if (typeof fun != "function")  
            throw new TypeError();  
        var thisp = arguments[1];  
        for (var i = 0; i < len; i++){  
            if (i in this)  
                fun.call(thisp, this[i], i, this);  
        }  
    };  
}

//判断是否是IE
function isIE(){ //ie? 
   if (window.navigator.userAgent.toLowerCase().indexOf("msie")>=1) {
     return true; 
   }
   else {
      return false; 
   }   
} 

//兼容innerTEXT
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
   HTMLElement.prototype.__defineSetter__("innerText", 
    function(sText){ 
     this.textContent=sText; 
    } 
   ); 
}

//cookie
function setCookie(name,value,expires,path,domain,secure){
      var cookie=encodeURIComponent(name)+'='+encodeURIComponent(value);
      if(expires)cookie+=';expires='+expires;
      if(path)cookie+=';path'+path;
      if(domain)cookie+=';domain'+domain;
      if(secure)secure+=';secure'+secure;
      document.cookie=cookie;
    }

    function getCookie () {
        var cookie = {};
        var all = document.cookie;
        if (all === '')
            return cookie;
        var list = all.split('; ');
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var p = item.indexOf('=');
            var name = item.substring(0, p);
            name = decodeURIComponent(name);
            var value = item.substring(p + 1);
            value = decodeURIComponent(value);
            cookie[name] = value;
        }
        return cookie;
    }

//兼容bind方法
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
 
    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };
 
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
 
    return fBound;
  };
}

//获取计算后的样式
function getStyle(ele,attr){
	if(typeof window.getComputedStyle!=='undefined'){
		return window.getComputedStyle(ele,null)[attr];
	}else{
		return ele.currentStyle[attr];
	}
}