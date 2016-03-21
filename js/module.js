


/*顶部通知栏*/
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

		console.log(opt.type)

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

	extend(Pop.prototype,emitter);

	window.Pop=Pop;
})();


/*表单组件*/
// (function(){

// 	var Form=function(opt){

// 		extend(Form.prototype,opt);

// 		this.form=this.form;

// 		this.src=this.src;

// 		this.submit = document.forms[this.form].elements['submit'];

// 		this.user = document.forms[this.form].querySelector['user'];

// 		this.pass = document.forms[this.form].querySelector['pass'];

// 	}

// 	extend(Form.prototype,{

// 		submit : function(){

// 		},

// 		_init : function(){

// 		}


// 	});


// })();

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
	    ele.style.opacity=0;
	    //兼容IE
	    ele.style.filter='alpha(opacity='+0+')';
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
	    	this.imgs[i].style.filter='alpha(opacity='+0+')';
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



//获取课程和页码
(function(){
	var url='http://study.163.com/webDev/couresByCategory.htm';
	var pageNo = 1,
		type = 10,
		psize = window.screen.width>1205?20:15;
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
			var options = {'pageNo':1,'type':type,'psize':psize};
			
			getNum(1);

			//tab样式切换
			for(var i=0,len=tabs.length;i<len;i++){
				tabs[i].className='bt';
			}
			tabBt.className='bt active';
			//还需要加页码初始化的代码
		});
	})


	//获取页码总数和页码第一页，用于页面载入和tab切换
	function getNum(now){	
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
			allNum:Math.ceil(obj.totalCount/20),
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
				<img>\
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
			container.appendChild(item);
			var img = item.getElementsByTagName('img')[0];
			var itemTitle = item.querySelector('.cor-title');
			var itemPro = item.querySelector('.cor-provider');
			var itemNum = item.querySelector('.cor-num').getElementsByTagName('strong')[0];
			var itemPrice=item.querySelector('.cor-price');
			//添加属性
			img.setAttribute('src',couresObj[i].middlePhotoUrl);
			itemTitle.innerText = couresObj[i].name;
			itemPro.innerText = couresObj[i].provider;
			itemNum.innerText = couresObj[i].learnerCount;
			itemPrice.innerText = '￥'+couresObj[i].price;
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
		if(!target.index)nowNum=target.getAttribute('index');
		
		Page({
			container:container,
			nowNum:nowNum,
			allNum:allNum,
			callback:callback
		})
	}
};

	getNum(1);
})()


//右侧模块 需要优化及模块化
var hotCoures = (function(){

	var url='http://study.163.com/webDev/hotcouresByCategory.htm';


	function _getHotCoures(response){
		var template = 
			'<div class="hotcor">\
				<div class="hotcor-img"></div>\
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
		for(var i=0;i<=100;i++){
			(function(){
				var oMove=0.7*i;
				setTimeout(function(){
					ele.style.top=oTop-oMove+'px';
				},i*5)
			})(i);
		}
	}
}

setInterval(function(){
	toRun(wrap);
},5000);







//登录模块  是否能设置成弹窗组件？？登录弹窗组件
// (function(){
// 	var attention=document.querySelector('.hd-attention');

// 	var attentioned=document.querySelector('.hd-attentioned');

// 	var fanNum=document.querySelector('.hd-fan').getElementsByTagName('strong')[0];

// 	var attenCancel=document.querySelector('.hd-attention-cancel');

// 	var login=document.querySelector('.m-login');

// 	var loginForm=document.querySelector('.m-login-wrap');

// 	var loginClose=loginForm.querySelector('.m-login-close');

// 	var user=loginForm.querySelector('.user');

// 	var pass=loginForm.querySelector('.pass');

// 	var submit=loginForm.querySelector('.submit');

// 	var flag=true;

// 	var url='http://study.163.com/webDev/login.htm';


// 	addEvent(attention,'click',function(){
// 		//判断loginSuc是否设置，未设置则弹出登录框输账号密码
// 		if(!getCookie()['loginSuc']){
// 			//先弹出登录框
// 			login.style.display='block';
// 			//添加关闭事件
// 			addEvent(loginClose,'click',function(){
// 				login.style.display='none'; 
// 			});

// 			//表单验证
// 			//客户端验证  仅进行是否值为空的验证
// 			//值为空时，相应的边框设置为红色
// 			addEvent(user,'blur',function(){
// 				if(user.value==''){
// 					user.style.border='1px solid red';
// 					flag=false;
// 				}
// 			})
// 			addEvent(user,'focus',function(){
// 					user.style.border='1px solid #dfdfdf';
// 			})

// 			addEvent(pass,'blur',function(){
// 				if(pass.value==''){
// 					pass.style.border='1px solid red';
// 					flag=false;
// 				}
// 			})
// 			addEvent(pass,'focus',function(){
// 					pass.style.border='1px solid #dfdfdf';
// 			})
// 		}else{//如果已经设置loginSuc,则显直接改变样式，设置为登录
// 			//改变样式，设置关注
// 			attention.style.display='none';
// 			attentioned.style.display='inline-block';
// 			//粉丝数+1；
// 			fanNum.innerHTML=parseInt(fanNum.innerHTML)+1;
// 		}

// 	})

// 	function setAttention(response){
// 				//response是string
// 				if(response==1){
// 					//关闭登录框
// 					login.style.display='none';
// 					//改变样式，设置关注
// 					attention.style.display='none';
// 					attentioned.style.display='inline-block';
// 					//粉丝数+1；
// 					fanNum.innerHTML=parseInt(fanNum.innerHTML)+1;
					
// 					//设置cookie
// 					var date=new Date();
// 					var expires=date.getDate()+1;
// 					setCookie('loginSuc',true,expires);
					 
// 					//console.log('成功')
// 				}else{
// 					//提示错误信息
					
// 				}	
// 			}

// 	//按按钮或按回车时进行提交
// 	addEvent(submit,'click',function(){
// 		if(flag){
// 			get(url,
// 			{userName:md5(user.value),password:md5(pass.value)},
// 			setAttention);
// 		}else{
// 			//提示错误信息 直接提示用户名或密码错误
// 		}
		
// 	})
// 	//回车提交Enterkey

// 	addEvent(attenCancel,'click',function(){
// 		attentioned.style.display='none';
// 		attention.style.display='inline-block';

// 		fanNum.innerHTML=parseInt(fanNum.innerHTML)-1;
// 	})
// 	//console.log(e.keyDown)

// })()



//视频弹窗


















// fadeIn: function (ele){
// 	    ele.style.opacity=0;
// 	    //兼容IE
// 	    ele.style.filter='alpha(opacity='+0+')';
// 	    ele.style.display='block';
// 	    for(var i=1;i<=10;i++){
// 	    	(function(){
// 		        var num=i*0.1;
// 		        setTimeout(function(){
// 		            ele.style.opacity=num;
// 		            ele.style.filter='alpha(opacity='+i*10+')';
// 		        },i*50);
// 		    })(i);
// 	    }
// 	},



















/*动态获取课程*/
// var Coures = (function(){
// 	var template = 
// 		'<div class="cor-item">\
// 			<img>\
// 			<span class="cor-title"></span>\
// 			<span class="cor-provider"></span>\
// 			<span class="cor-num"><strong></strong></span>\
// 			<span class="cor-price"></span>\
// 		</div>'

// 	// var url='http://study.163.com/webDev/couresByCategory.htm';
// 	// var pageNo,type;
// 	// var psize=window.screen.width>1205?20:15;	
	
// 	// ajax_get(url,{'pageNo':pageNo,'psize':psize,'type':type})

// 	function getCoures(obj){
// 		var couresObj = JSON.parse(obj).list;
// 		var container = document.querySelector('.cor-lists');
// 		var layout = html2node(template);
// 		var totalCount = JSON.parse(obj).totalCount; //课程总数
// 		//PSIZE?20:15在这里设置？？
// 		container.innerHTML='';
// 		//如何调用？？？
// 		var pageNum=Math.ceil(totalCount/20);
		

// 		//还要给item添加移入移出显示详情方法

// 		for(var i=0,len=couresObj.length;i<len;i++){
// 			//创建节点添加并获取节点
// 			var item = layout.cloneNode(true);

// 			container.appendChild(item);
// 			var img = item.getElementsByTagName('img')[0];
// 			var itemTitle = item.querySelector('.cor-title');
// 			var itemPro = item.querySelector('.cor-provider');
// 			var itemNum = item.querySelector('.cor-num').getElementsByTagName('strong')[0];
// 			var itemPrice=item.querySelector('.cor-price');
// 			//添加属性
// 			img.setAttribute('src',couresObj[i].bigPhotoUrl);
// 			itemTitle.innerText = couresObj[i].name;
// 			itemPro.innerText = couresObj[i].provider;
// 			itemNum.innerText = couresObj[i].learnerCount;
// 			itemPrice.innerText = '￥'+couresObj[i].price;
// 		}

// 		getPageNum(totalCount);
// 	}


// 	function getPageNum(total){
// 		//初始化页码



// 	}

// 	return {
// 		getCoures : getCoures,
// 	}
// })();

// /*页码模块*/
// (function(){
// 	//怎么获取总页数？？
// 	var Page = function(opt){

// 		extend(Page.prototype,opt);

// 		this.container = this.container;

// 		this.length = this.length || 8;

// 	    this.aPage = this._layout().cloneNode(true);

// 		this.container.appendChild(this.aPage);

// 		this.aPage = this.container.getElementsByTagName('a');

// 		this.aPage=toArray(this.aPage);

// 		this.len=this.aPage.length;

// 		this.onNav=true;

// 		if(this.onNav)this.nav();

// 	};


// 	extend(Page.prototype,emitter);

// 	extend(Page.prototype,{
// 		//创建节点并初始化
// 		_layout : function(){
// 			var len=this.length;
// 			var container = document.createElement('div');
// 			for(var i=0;i<len+2;i++){
// 				var a=  document.createElement('a');
// 				a.innerHTML=i;
// 				container.appendChild(a);
				
// 			}
// 			container.firstChild.className='prev';
// 			container.lastChild.className='next';
// 			container.children[1].className='selected';
// 			return container;	
// 		},

// 		//初始化，用于Tab切换使用
// 		init : function(){
			
// 		},

// 		//点击页码直接定位
// 		nav : function(){	
// 			var _this=this;
			
// 			var aPage=_this.aPage;

// 			var len=aPage.length;

// 			var half=Math.floor(len/2)

// 			aPage.forEach(function(page,index){
// 				addEvent(page,'click',function(){
// 					if((/[selected||prev||next]/).test(page.className))return;
// 					for(var i=1;i<len-1;i++){
// 						aPage[i].className='';
// 					}
					
// 					//代码待优化 
// 					if(this.innerHTML>half-1){
// 						aPage[half].innerHTML=this.innerHTML;
// 						aPage[half].className='selected';
// 						_this.emit('nav',Number(this.innerHTML));
// 						for(var k=1;k<half-1;k++){
// 							aPage[half+k].innerHTML=Number(aPage[half].innerHTML)+k;
// 						}
// 						for(var j=1;j<half;j++){
// 							aPage[half-j].innerHTML=Number(aPage[half].innerHTML)-j;
// 						}
// 					}else{
// 						_this.emit('nav',Number(this.innerHTML));
// 						aPage[Number(this.innerHTML)].className = 'selected';
// 						for(var j=1;j<len-1;j++){
// 							aPage[j].innerHTML=j;
// 						}
// 					}
// 				})

				
// 			})
// 		},

// 		prev : function(){
			
// 		},

// 		next : function(){
			
// 		}

	

// 	})

// 	window.Page = Page;
	
// })()


// _container.innerHTML='';
// ajax_get('http://study.163.com/webDev/couresByCategory.htm',
// {'pageNo':index,'psize':20,'type':10},Coures.getCoures);










// var course_module = (function(){

//     var url = "http://study.163.com/webDev/couresByCategory.htm";
//     var pageSize = 20;
//     var pageType = 10;

//     var mnav = document.querySelector('.m-nav');
//     var mnavTag = mnav.getElementsByTagName('a');
//     var mpager = document.querySelector('.m-pager');

//     delegateEvent(mnav,'a','click',
//         function(target,event){
//             if(pageType != target.getAttribute('data')){
//                 for(i=0;i<mnavTag.length;i++){
//                     removeClass(mnavTag[i],'selected');        
//                 }
//                 addClass(target,'selected');
//                 pageType = target.getAttribute('data');
//                 mpager.innerHTML = '';
//                 getPageNum(1);
//             }
//             preventDefault(event);
//         }
//     );

//     //获取分页器总页数以及课程列表第一页
//     function getPageNum(now){    
//         var options = {pageNo:now,psize:pageSize,type:pageType};
//         get(url,options,function(response){
//                 initPager(response,now);
//             }
//         );    
//     }
//     //初始化分页和课程列表
//     function initPager(response,now){
//         var res = JSON.parse(response);
//         var option = {id:mpager,nowNum:now,allNum:res.totalPage,childLength:8,callback:getCourse};
//         //初始化课程列表
//         drawCourse(response);
//         //初始化分页
//         page(option);
//     }
//     //获取课程列表
//     function getCourse(now,all){
//         console.log('分页器：'+now);
        
//         var options = {pageNo:now,psize:pageSize,type:pageType};
//         get(url,options,drawCourse);
//     }
//     //生成课程列表
//     function drawCourse(response){
//         var data = JSON.parse(response);
//         console.log(data);
//         console.log('获取的页码：'+data.pagination.pageIndex);
        
//         var boo = document.querySelectorAll('.u-cover');
//         for(var i=boo.length-1;i>0;i--){
//             boo[i].parentNode.removeChild(boo[i]);
//         }
        
//         var templete = document.querySelector('.m-data-lists .f-templete');
            
//         for(var i=0,list=data.list;i<list.length;i++){       
//             var cloned = templete.cloneNode(true);
//             removeClass(cloned,'f-templete');
//             var imgpic = cloned.querySelector('.imgpic');
//             var title = cloned.querySelector('.tt');
//             var orgname = cloned.querySelector('.orgname');
//             var hot = cloned.querySelector('.hot');
//             var pri = cloned.querySelector('.pri');
//             var kindname = cloned.querySelector('.kindname');
//             var disc = cloned.querySelector('.disc');
            
//             imgpic.src = list[i].middlePhotoUrl;
//             imgpic.alt = list[i].name;
//             title.innerText = list[i].name;
//             orgname.innerText = list[i].provider;
//             hot.innerText = list[i].learnerCount;
//             pri.innerText = '￥' + list[i].price + '.00'; 
//             kindname.innerText = list[i].categoryName;
//             disc.innerText = list[i].description;      
//             templete.parentNode.appendChild(cloned);
//         }
//     }

//     getPageNum(1);    

// })();
