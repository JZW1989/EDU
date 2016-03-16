

// 定义全局

//轮播器
var mSlider = document.querySelector(".m-slider");

var cursor = mSlider.querySelector('.slid-cursor');

var cursors = toArray(cursor.children);

var slider = new Slider({
	//指定容器
	container: mSlider,
	
})

//自动轮播
var autoChange=setInterval(function(){
	slider.run()
},5000);

//鼠标悬停清除定时器
addEvent(mSlider,'mouseover',function(){
	clearInterval(autoChange);
})

//鼠标离开重置定时器
addEvent(mSlider,'mouseout',function(){
	autoChange=setInterval(function(){
		slider.run();
	}
	,5000);
})

//点击直接跳转
//target和E记得做兼容
cursors.forEach(function(cursor, index){
	addEvent(cursor,'click',function(e){
		var e=e||window.event;
		var target=e.target||e.srcElement;
	  	if(target.className==='selected')return;
	    slider.init(index);
	})	
})

//完成额外逻辑,设置cursor的class
slider.on('init',function(ev){
	var pageIndex = ev.pageIndex;
	cursors.forEach(function(cursor, index){
		if(index === pageIndex ){
			cursor.className = 'selected';
		}else{
			cursor.className = '';
		}
	})
})


//右侧模块
var wrap=document.querySelector('.hot-wrap');

function toRun(ele){
	oTop=parseInt(window.getComputedStyle(ele,null)['top']);
	if(parseInt(ele.style.top)<=-700){
		for(var i=0;i<=20;i++){
			(function(){
				var oMove=35*i;
				setTimeout(function(){
					ele.style.top=oTop+oMove+'px';
				},i*25)
			})(i);
		}
	}else{
		for(var i=0;i<=20;i++){
			(function(){
				var oMove=3.5*i;
				setTimeout(function(){
					ele.style.top=oTop-oMove+'px';
				},i*25)
			})(i);
		}
	}
}

setInterval(function(){
	toRun(wrap);
},5000);


var attention = document.querySelector('.hd-attention');

var login=document.querySelector('.m-login');

addEvent(attention,'click',function(){
	login.style.display='block';
})	









































// //页码
// var corPage=document.querySelector('.cor-page');

// var page = new Page({
// 	container : corPage,  //容器

// 	length : 8,	 //页码显示长度


//     // pageNum : pageNum, //总页数

// });


// //课程列表初始化
// ajax_get('http://study.163.com/webDev/couresByCategory.htm',
// 		{'pageNo':1,'psize':20,'type':10},Coures.getCoures);


//Tab切换
// var tab=document.querySelector('.m-cor .tab');
// addEvent(tab,'click',function(e){
// 	var e=e||window.event;
// 	var target=e.target||e.srcElement;
// 	if(target.className === 'bt active')return;
// 	var container = document.querySelector('.cor-lists');
// 	var len=target.parentNode.children.length;
// 	for(var i=0;i<len;i++){
// 		target.parentNode.children[i].className='bt';
// 	}

// 	//需要加一个page初始化的程序
// 	target.className='bt active';
// 	if(target.value==="产品设计"){
// 		ajax_get('http://study.163.com/webDev/couresByCategory.htm',
// 		{'pageNo':1,'psize':20,'type':10},Coures.getCoures);
// 	}else if(target.value==="编程语言"){
// 		ajax_get('http://study.163.com/webDev/couresByCategory.htm',
// 		{'pageNo':1,'psize':20,'type':20},Coures.getCoures);
// 	}
// });

// //切换同时改变课程内容
// page.on('nav',function(index){//改变页码时动态获取课程
// 	//产品设计课程
// 	if(/active/.test(tab.children[0].className)){
// 		ajax_get('http://study.163.com/webDev/couresByCategory.htm',
// 			{'pageNo':index,'psize':20,'type':10},Coures.getCoures);
// 	}else{//编程语言课程
// 		ajax_get('http://study.163.com/webDev/couresByCategory.htm',
// 			{'pageNo':index,'psize':20,'type':20},Coures.getCoures);
// 	}
// })


// (function(){

// 	var slider=document.querySelector('.m-slider');

// 	var cursor=slider.querySelector('.slid-cursor');

// 	var imgs=slider.getElementsByTagName('img');

// 	var len=imgs.length;

// 	var pageIndex=0;

// 	//轮播器初始化(重置)
// 	function init(){
// 		//将图片设置成display:none，下标选择的class清空
// 		for(var i=0;i<len;i++){
// 			imgs[i].style.display='none';
// 			cursor.children[i].className='';
// 		}

// 		//将对应的图片设置成显示，对应下标添加class使其显示为灰色
// 		fadeIn(imgs[pageIndex]);
// 		imgs[pageIndex].style.display='inline-block';
// 		cursor.children[pageIndex].className='selected';
// 	}
	
// 	//定时轮播
// 	function banner(){
// 		//pageIndex > (图片数量-1) 将其设置为0
// 		if(pageIndex<len-1){
// 			pageIndex++
// 		}else{
// 			pageIndex=0;
// 		}
// 		init();
// 	}

// 	//淡入效果
// 	function fadeIn(ele){
// 	    ele.style.opacity=0;
// 	    ele.style.display='block';
// 	    for(var i=1;i<=10;i++){
// 	    	(function(){
// 		        var num=i*0.1;
// 		        setTimeout(function(){
// 		            ele.style.opacity=num;
// 		        },i*50);
// 		    })(i);
// 	    }
// 	}

// 	//定时器
// 	var autoChange=setInterval(banner,5000);

// 	//鼠标悬停清除定时器
// 	addEvent(slider,'mouseover',function(){
// 		clearInterval(autoChange);
// 	})

// 	//鼠标离开重置定时器
// 	addEvent(slider,'mouseout',function(){
// 		autoChange=setInterval(banner,5000);
// 	})

// 	//鼠标点击下标直接切换图片
// 	addEvent(cursor,'click',function(e){
// 		var target=e.target;
// 		if(target.className==='selected')return;
// 		if(target.tagName==='LI'){
// 			for(var i=0;i<len;i++){
// 				if(target===cursor.children[i]){
// 					pageIndex=i;
// 				}
// 			}
// 			init();
// 		}
// 	})

// })();
