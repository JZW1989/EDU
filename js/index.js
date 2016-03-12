

//轮播器业务逻辑
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











/*动态获取课程*/
var Coures = (function(){

	var template = 
		'<div class="cor-item">\
			<img>\
			<span class="cor-title"></span>\
			<span class="cor-provider"></span>\
			<span class="cor-num"><strong></strong></span>\
			<span class="cor-price"></span>\
		</div>'

	function getCoures(obj){

		var couresObj = JSON.parse(obj).list;
		var container = document.querySelector('.cor-lists');
		var layout = html2node(template);

		//还要给item添加移入移出显示详情方法

		for(var i=0,len=couresObj.length;i<len;i++){

			var item = layout.cloneNode(true);

			container.appendChild(item);

			var img = item.getElementsByTagName('img')[0];

			var itemTitle = item.querySelector('.cor-title');

			var itemPro = item.querySelector('.cor-provider');

			var itemNum = item.querySelector('.cor-num').getElementsByTagName('strong')[0];

			var itemPrice=item.querySelector('.cor-price');

			img.setAttribute('src',couresObj[i].bigPhotoUrl);

			itemTitle.innerText = couresObj[i].name;

			itemPro.innerText = couresObj[i].provider;

			itemNum.innerText = couresObj[i].learnerCount;

			itemPrice.innerText = '￥'+couresObj[i].price;

		}
	}

	return {

		getCoures : getCoures

	}

})();

//初始化
ajax_get('http://study.163.com/webDev/couresByCategory.htm',
		{'pageNo':1,'psize':20,'type':10},Coures.getCoures);


//切换
var tab=document.querySelector('.m-cor .tab');
tab.onclick=function(e){
	var e=e||window.event;
	var target=e.target||e.srcElement;
	if(target.className === 'bt active')return;
	var container = document.querySelector('.cor-lists');
	var len=target.parentNode.children.length;
	for(var i=0;i<len;i++){
		target.parentNode.children[i].className='bt';
	}
	target.className='bt active';
	container.innerHTML='';
	if(target.value==="产品设计"){
		ajax_get('http://study.163.com/webDev/couresByCategory.htm',
		{'pageNo':1,'psize':20,'type':10},Coures.getCoures);
	}else if(target.value==="编程语言"){
		ajax_get('http://study.163.com/webDev/couresByCategory.htm',
		{'pageNo':1,'psize':20,'type':20},Coures.getCoures);
	}
}











