


//关注登录
var attention=document.querySelector('.hd-attention');

var attentioned=document.querySelector('.hd-attentioned');

var fanNum=document.querySelector('.hd-fan').getElementsByTagName('strong')[0];

var attenCancel=document.querySelector('.hd-attention-cancel');

var loginPop=new Pop({
			type : '.login',
			trig : attention
		});


function setAttention(response){
	//response是string
	if(response==1){
		error.style.display='none';
		loginPop.hide();
		follow();
		//设置cookie
		var date=new Date();
		var expires=date.getDate()+1;
		setCookie('loginSuc',true,expires);
		//console.log('成功')
	}else{
		error.style.display='inline-block';
	}	
}

function follow(){
	//改变样式，设置关注
	attention.style.display='none';
	attentioned.style.display='inline-block';
	//粉丝数+1；
	fanNum.innerHTML=parseInt(fanNum.innerHTML)+1;
	//用onclick事件覆盖之前的事件
	attention.onclick=follow;
}

if(typeof getCookie()['loginSuc']!=='undefined'){//有cookie直接设置
	//用onclick事件覆盖之前的事件
	attention.onclick=follow;
}else{//没cookie显示表单，进行验证
	//客户端验证
	//仅进行值是否为空的验证
	var user=document.forms['login'].querySelector('.user');

	var pass=document.forms['login'].querySelector('.pass');

	var submit=document.forms['login'].querySelector('.submit');

	var error=document.forms['login'].querySelector('.error');

	var flag=true;
	//值为空时，相应的边框设置为红色
	addEvent(user,'blur',function(){
		if(user.value==''){
			user.style.border='1px solid red';
			flag=false;
		}
	})
	addEvent(user,'focus',function(){
			user.style.border='1px solid #dfdfdf';
			flag=true;
	})

	addEvent(pass,'blur',function(){
		if(pass.value==''){
			pass.style.border='1px solid red';
			flag=false;
		}
	})
	addEvent(pass,'focus',function(){
			pass.style.border='1px solid #dfdfdf';
			flag=true;
	})

	addEvent(submit,'click',function(){
		//提交按钮设置为不可点击
		if(!flag){//值为空时
			error.style.display='inline-block';
			console.log('错误1');
		}else{//将数据发送服务器进行验证
			get('http://study.163.com/webDev/login.htm',
				{userName:md5(user.value),password:md5(pass.value)},
				setAttention);
		}
	})

}

addEvent(attenCancel,'click',function(){
	attentioned.style.display='none';
	attention.style.display='inline-block';
	//粉丝数-1；
	fanNum.innerHTML=parseInt(fanNum.innerHTML)-1;
})




//视频弹窗
var corVideo=document.querySelector('.cor-video').getElementsByTagName('img')[0];
var videoPop=new Pop({
	type:'.video',
	trig: corVideo
});



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
















// var tipClose=document.querySelector('.tp-close');
// tipClose.onclick=function(){
// 	tips.style.display='none';
// 	var date=new Date();
// 	// var expirs=date.getTime()+24*3600*1000;
// 	var expirs=date.getTime()-1;
// 	setCookie('noTips','true',expires);
// }


//设置小黄条的cookie
// var Tips=(function(){
// 	var tips=document.querySelector('.m-tips');
	
	
// })()


































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
