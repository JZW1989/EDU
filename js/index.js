

/***************顶部通知栏*********************/
(function(){

	var tips=document.querySelector('.m-tips');

	var close=tips.querySelector('.tp-close');

	if(!getCookie()['noTips']){
		tips.style.display='block';
		var date=new Date();
		var expires=date.getDate()+1;
		setCookie('noTips','true',expires);
	}
	addEvent(close,'click',function(){
		tips.style.display='none';
	})
})();
/***************顶部通知栏*********************/



/***************弹窗部分*********************/
/*
 * 弹窗组件	
 * 传入参数
 * trig为触发弹窗的DOM元素,触发方式为click	
 * type为弹窗类型,以传入的className取得相应的弹窗(login为登录框，video为视频弹窗)
 * 
 */
(function(){
	
	var Pop=function(opt){

		extend(this,opt);

		var mask = document.querySelector('.mask');

		this.mask = mask;

		this.popup = this.mask.querySelector(this.type);

		this.close = this.popup.querySelector('.close');

		this._init();

	}

	extend(Pop.prototype,{
		//弹窗
		_show : function(){
			this.mask.style.display='block';
			this.popup.style.display='block';
		},
		//关闭
		hide : function(){
			this.mask.style.display='none';
			this.popup.style.display='none';
		},

		_init : function(){
			this.trig.onclick=this._show.bind(this);
			addEvent(this.close,'click',this.hide.bind(this));
		}
	})

	window.Pop=Pop;
})();



/*登录弹窗及验证*/
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
};

function follow(){
	//改变样式，设置关注
	attention.style.display='none';
	attentioned.style.display='inline-block';
	//粉丝数+1；
	fanNum.innerHTML=parseInt(fanNum.innerHTML)+1;
	//用onclick事件覆盖之前的事件
	attention.onclick=follow;
};

if(typeof getCookie()['loginSuc']!=='undefined'){//有cookie直接设置
	//用onclick事件覆盖之前的事件
	attention.onclick=follow;
}else{//没cookie显示表单，进行验证
	//客户端验证
	//仅进行值是否为空的验证
	var loginForm=document.forms['login'];

	var user=loginForm.querySelector('.user');

	var pass=loginForm.querySelector('.pass');

	var submit=loginForm.querySelector('.submit');

	var error=loginForm.querySelector('.error');

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

	//点击登录提交
	addEvent(submit,'click',function(){
		if(!flag){//值为空时
			error.style.display='inline-block';
		}else{//将数据发送服务器进行验证
			get('http://study.163.com/webDev/login.htm',
				{userName:md5(user.value),password:md5(pass.value)},
				setAttention);
		}
	})

	//回车提交
	addEvent(loginForm,'keydown',function(e){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		if(e.keyCode===13){
			if(!flag){//值为空时
				error.style.display='inline-block';
			}else{//将数据发送服务器进行验证
				get('http://study.163.com/webDev/login.htm',
					{userName:md5(user.value),password:md5(pass.value)},
					setAttention);
			}
		}
	})
};

addEvent(attenCancel,'click',function(){
	attentioned.style.display='none';
	attention.style.display='inline-block';
	//粉丝数-1；
	fanNum.innerHTML=parseInt(fanNum.innerHTML)-1;
});


//视频弹窗
var corVideo=document.querySelector('.cor-video').getElementsByTagName('img')[0];
var videoPop=new Pop({
	type:'.video',
	trig: corVideo
});

/***************弹窗部分*********************/





/***************轮播器*********************/
/*轮播器组件*/
//图片地址传参作为下一步考虑
(function(){
	var template = 
		'<ul class="slid-container">\
			<li><a href="http://open.163.com/"><img src="img/banner1.jpg" /></a></li>\
			<li><a href="http://study.163.com/"><img src="img/banner2.jpg" /></a></li>\
			<li><a href="http://www.icourse163.com/"><img src="img/banner3.jpg" /></a></li>\
		</ul>';

	var Slider = function(opt){
		//配置参数
		extend(this,opt); 

		this.container = this.container || document.body;

		this.slider = this._layout.cloneNode(true);

		//若放到获取img nodelist后面会导致IE的BUG
		this.container.appendChild(this.slider);

		this.imgs = this.slider.getElementsByTagName('img');

		len = this.imgs.length;

		this.pageIndex = 0;

	}

	extend(Slider.prototype,emitter);

	//扩展方法
	extend(Slider.prototype,{

	_layout: html2node(template),

	//淡入效果
	_fadeIn: function (ele){
		//透明度设为0
		ele.style.opacity=0;
   		//兼容IE
    	ele.style.filter='alpha(opacity='+ 0 +')';
	    ele.style.display='block';
	    for(var i=1;i<=20;i++){
	    	(function(){
		        var num=i*0.05;
		        setTimeout(function(){
		            ele.style.opacity=num;
		            ele.style.filter='alpha(opacity='+i*5+')';
		        },i*25);
		    })(i);
	    }
	},

	//定时轮播
	run: function (){
		//pageIndex > (图片数量-1) 将其设置为0
		if(this.pageIndex<len-1){
			this.pageIndex++
		}else{
			this.pageIndex=0;
		}
		this.init(this.pageIndex);
	},

	//直接跳转()
	init: function (pageIndex){
		if(arguments.length!==0)this.pageIndex=pageIndex;
		for(var i=0;i<len;i++){
			//将所有图片设置成display:none
			this.imgs[i].style.display='none';
			//透明度设为0
			this.imgs[i].style.opacity=0;
	   		//兼容IE
	    	this.imgs[i].style.filter='alpha(opacity='+ 0 +')';
		}
		//将对应的图片设置成显示
		this._fadeIn(this.imgs[this.pageIndex]);
		//this.imgs[this.pageIndex].style.display='inline-block';
		//完成额外逻辑，提供index参数
		this.emit('init',{
			pageIndex: this.pageIndex
		})
	},
	})

	window.Slider=Slider;

})();

//轮播器
var mSlider = document.querySelector(".m-slider");

var cursor = mSlider.querySelector('.slid-cursor');

var cursors = toArray(cursor.children);

var slider = new Slider({
	//指定容器
	container: mSlider,
	
});

//自动轮播
var autoChange=setInterval(function(){
	slider.run()
},5000);

//鼠标悬停清除定时器
addEvent(mSlider,'mouseover',function(){
	clearInterval(autoChange);
});

//鼠标离开重置定时器
addEvent(mSlider,'mouseout',function(){
	autoChange=setInterval(function(){
		slider.run();
	}
	,5000);
});

//点击直接跳转
//target和E记得做兼容
cursors.forEach(function(cursor, index){
	addEvent(cursor,'click',function(e){
		var e=e||window.event;
		var target=e.target||e.srcElement;
	  	if(target.className==='selected')return;
	    slider.init(index);
	})	
});

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
});
/***************轮播器*********************/





/********************课程及页码*********************************/
/*获取课程和页码*/
var Coures=(function(){
	var url='http://study.163.com/webDev/couresByCategory.htm';
	var pageNo = 1,
		type = 10,
		psize = document.body.clientWidth>1205?20:15;
	var pageContainer=document.querySelector('.cor-page');	

	var tab=document.querySelector('.tab');
	var tabs=toArray(tab.children);
	tabs.forEach(function(tabBt,index){
		addEvent(tabBt,'click',function(e){
			if(tabBt.className==='bt active')return;
			var e=e||window.event;
			var target=e.target||e.srcElement;
			//切换type 作为属性写在html中
			type=parseInt(target.getAttribute('ctype'));
			//var options = {'pageNo':1,'type':type,'psize':psize};
			
			getNum(1,psize);
			//tab样式切换
			for(var i=0,len=tabs.length;i<len;i++){
				tabs[i].className='bt';
			}
			tabBt.className='bt active';
			//还需要加页码初始化的代码
		});
	})


	//响应式
	addEvent(window,'resize',function(){
		psize=document.body.clientWidth>1205?20:15;
		getNum(1,psize);
	});


	/**
	 * [getNum description]
	 * @param  {[type]} now   [当前页码]
	 * @param  {[type]} psize [每页课程数目]
	 * @return {[type]}       [description]
	 */
	function getNum(now,psize){	
		var options={'pageNo':now,'type':type,'psize':psize};
		get(url,options,function(response){
			init(response,now);
		})
	}

	function init(response,now){
		var obj=JSON.parse(response);
		var options={
			container:pageContainer,
			nowNum:now,
			allNum:Math.ceil(obj.totalCount/psize),
			callback:getCoures,
		}
		Page(options);
	}


	function getCoures(now){//用于page切换
		var options = {'pageNo':now,'type':type,'psize':psize};
		get(url,options,_getCoures);
	}
	
	//生成课程列表，在ajax回调中执行
	function _getCoures(response){
		var template = 
			'<div class="cor-item">\
				<div class="cor-itemdtl">\
					<img class="fl" />\
					<div class="itemdtl-r">\
						<span class="cor-title"></span>\
						<span class="cor-num"><strong>510</strong></span>\
						<span class="cor-provider"></span>\
						<span class="cor-cate"></span>\
					</div>\
					<div class="itemdtl-dsc"><p></p></div>\
				</div>\
					<img />\
					<span class="cor-title"></span>\
					<span class="cor-provider"></span>\
					<span class="cor-num"><strong></strong></span>\
					<span class="cor-price"></span>\
				</div>'

		var couresObj = JSON.parse(response).list;
		var container = document.querySelector('.cor-lists');
		var layout = html2node(template);
		//清空container的容
		container.innerHTML='';


		for(var i=0,len=couresObj.length;i<len;i++){
			//创建节点添加并获取节点
			var item = layout.cloneNode(true);
			var img = item.getElementsByTagName('img');
			var itemTitle = item.querySelectorAll('.cor-title');
			var itemPro = item.querySelectorAll('.cor-provider');
			var itemNum = item.getElementsByTagName('strong');
			var itemPrice = item.querySelector('.cor-price');
			var itemDsc = item.querySelector('.itemdtl-dsc').getElementsByTagName('p')[0];
			var itemCate = item.querySelector('.cor-cate');
			//添加属性
			for(var k=0,klen=img.length;k<klen;k++){
				img[k].setAttribute('src',couresObj[i].middlePhotoUrl);
				itemTitle[k].innerText = couresObj[i].name;
				itemPro[k].innerText = couresObj[i].provider;	
				itemNum[k].innerText = couresObj[i].learnerCount;
			}
			itemCate.innerText = '分类：'+couresObj[i].categoryName;
			itemPrice.innerText = '￥'+couresObj[i].price;
			itemDsc.innerText = couresObj[i].description;
			container.appendChild(item);
		}
		//添加hover事件
		
	}

	//页码模块 参考前端某位学长
	function Page(opt){
	if(!opt.container)return false;
	var container=opt.container;
	var nowNum=parseInt(opt.nowNum);
	var allNum=opt.allNum;
	var callback=opt.callback;

	//清空
	container.innerHTML='';
	//上一页按钮
	var prev=document.createElement('a');
	prev.className='prev';
	prev.setAttribute('index',nowNum-1);
	container.appendChild(prev);
	if(nowNum===1){
		prev.style.display='none';
	}else{
		prev.style.display='inline-block';
	}

	//添加index属性，用于click事件
	function initPage(i){
	    var a = document.createElement('a');
	    a.setAttribute('index',i);
	    a.innerHTML = i;
	    if(nowNum == i){
	        a.className='selected';
	    }
	    return a;
	}

	//添加页码
	if(allNum<=8){//页码不足8页时显示
		for(var i=1;i<=allNum;i++){
		var oA=initPage(i);
		container.appendChild(oA);
		}
	}else{//页码大于8页时
		for(var i=1;i<=8;i++){
			if(nowNum<=5){//选中的页码小于等于4时
				var oA=initPage(i);
				container.appendChild(oA);
			}else if(parseInt(allNum-4)>=nowNum){//选中的页码大于4 并且未到达(尾页-4)
					var oA=initPage(nowNum+i-4);
					container.appendChild(oA);
			}else{//尾页显示
					var oA=initPage(allNum-8+i)
					container.appendChild(oA);
			}
		}
	}

	//下一页按钮
	var next=document.createElement('a');
	next.className='next';
	next.setAttribute('index',nowNum+1);
	container.appendChild(next);
	if(nowNum===allNum){
		next.style.display='none';
	}else{
		next.style.display='inline-block';
	}

	callback(nowNum);


	var aPage=document.querySelector('.cor-page');
	//避免重复注册 创建在父节点上
	aPage.onclick=function(e){
		var e=e||window.event;
		var target=e.target||e.srcElement;
		//点击父元素不执行
		if(target.tagName==='DIV')return;
		if(target.className==='selected')return;
		if(typeof target.getAttribute('index')!=='undefined'){
			nowNum=target.getAttribute('index');
		}

		Page({
			container:container,
			nowNum:nowNum,
			allNum:allNum,
			callback:callback
		})
	}
};

	//初始化
	getNum(1,psize);

})();
/********************课程及页码*********************************/



/***************************右侧热门课程模块*******************/
/*右侧热门课程列表*/
var hotCoures = (function(){

	var url='http://study.163.com/webDev/hotcouresByCategory.htm';


	function _getHotCoures(response){
		var template = 
			'<div class="hotcor">\
				<div class="hotcor-img fl"></div>\
				<span class="hotcor-title"></span>\
				<span class="hotcor-num"></span>\
			</div>'

		var couresObj = JSON.parse(response);
		var container = document.querySelector('.hot-wrap');
		var layout = html2node(template);
		//清空container的容
		// container.innerHTML='';


		for(var i=0,len=couresObj.length;i<len;i++){
			//创建节点添加并获取节点
			var item = layout.cloneNode(true);
			container.appendChild(item);
			var img = item.querySelector('.hotcor-img');
			var itemTitle = item.getElementsByTagName('span')[0];
			var itemNum = item.querySelector('.hotcor-num');
			//添加属性couresObj[i].smallPhotoUrl
			img.style.background='url('+couresObj[i].smallPhotoUrl+') no-repeat center top';
			img.style.backgroundSize='cover';
			itemTitle.innerText = couresObj[i].name;
			itemNum.innerText = couresObj[i].learnerCount;
		}
	}

	get(url,undefined,_getHotCoures)

})();

/*右侧模块滚动显示*/
var wrap=document.querySelector('.hot-wrap');

setInterval(function(){
	if(parseInt(wrap.style.top)<=-70){
		wrap.style.top=0;
		var hotItem=wrap.children[0];
		wrap.appendChild(hotItem);
	}
	
	var oTop=parseInt(getStyle(wrap,'top'));
	for(var i=0;i<=100;i++){
		(function(){
			var oMove=0.7*i;
			setTimeout(function(){
				wrap.style.top=oTop-oMove+'px';
			},i*5)
		})(i);
	}

},5000);
/***************************右侧热门课程模块*******************/























