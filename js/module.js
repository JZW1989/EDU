



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
		extend(Slider.prototype,opt); 

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
	fadeIn: function (ele){
	    ele.style.opacity=0;
	    //兼容IE
	    ele.style.filter='alpha(opacity='+0+')';
	    ele.style.display='block';
	    for(var i=1;i<=10;i++){
	    	(function(){
		        var num=i*0.1;
		        setTimeout(function(){
		            ele.style.opacity=num;
		            ele.style.filter='alpha(opacity='+i*10+')';
		        },i*50);
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
		this.init();
	},

	//直接跳转()
	init: function (pageIndex){
		//将图片设置成display:none
		if(arguments.length!==0)this.pageIndex=pageIndex;
		for(var i=0;i<len;i++){
			this.imgs[i].style.display='none';
		}
		//将对应的图片设置成显示
		this.fadeIn(this.imgs[this.pageIndex]);
		this.imgs[this.pageIndex].style.display='inline-block';
		this.emit('init',{
			pageIndex: this.pageIndex
		})
	},
	
	})

	window.Slider=Slider;

})();