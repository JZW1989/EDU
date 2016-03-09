



/*轮播器模块*/
(function(){

	var slider=document.querySelector('.m-slider');

	var cursor=slider.querySelector('.slid-cursor');

	var imgs=slider.getElementsByTagName('img');

	var len=imgs.length;

	var pageIndex=0;

	//轮播器初始化(重置)
	function init(){
		//将图片设置成display:none，下标选择的class清空
		for(var i=0;i<len;i++){
			imgs[i].style.display='none';
			cursor.children[i].className='';
		}

		//将对应的图片设置成显示，对应下标添加class使其显示为灰色
		fadeIn(imgs[pageIndex]);
		imgs[pageIndex].style.display='inline-block';
		cursor.children[pageIndex].className='selected';
	}
	
	//定时轮播
	function banner(){
		//pageIndex > (图片数量-1) 将其设置为0
		if(pageIndex<len-1){
			pageIndex++
		}else{
			pageIndex=0;
		}
		init();
	}

	//淡入效果
	function fadeIn(ele){
	    ele.style.opacity=0;
	    ele.style.display='block';
	    for(var i=1;i<=10;i++){
	    	(function(){
		        var num=i*0.1;
		        setTimeout(function(){
		            ele.style.opacity=num;
		        },i*50);
		    })(i);
	    }
	}

	//定时器
	var autoChange=setInterval(banner,5000);

	//鼠标悬停清除定时器
	addEvent(slider,'mouseover',function(){
		clearInterval(autoChange);
	})

	//鼠标离开重置定时器
	addEvent(slider,'mouseout',function(){
		autoChange=setInterval(banner,5000);
	})

	//鼠标点击下标直接切换图片
	addEvent(cursor,'click',function(e){
		var target=e.target;
		for(var i=0;i<len;i++){
			if(target===cursor.children[i]){
				pageIndex=i;
			}
		}
		init();
	})

})();










