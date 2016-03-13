



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
		
		container.innerHTML='';

		//还要给item添加移入移出显示详情方法

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

/*页码模块*/
(function(){
	//怎么获取总页数？？
	var Page = function(opt){

		extend(Page.prototype,opt);

		this.aPage = document.querySelector('.cor-page').getElementsByTagName('a');

		this.aPage=toArray(this.aPage);

	}


	extend(Page.prototype,emitter);

	extend(Page.prototype,{

		nav : function(){

			var _this=this;
			
			var aPage=_this.aPage;

			/*需要加首页不能点的逻辑*/

			aPage.forEach(function(page,index){
				addEvent(page,'click',function(){
					if((/[selected||prev||next]/).test(page.className))return;
					for(var i=1;i<9;i++){
						aPage[i].className='';
					}
					console.log(index)
					this.className = 'selected';
					_this.emit('nav',index)
				})
				
			})
		},

		prev : function(){
			
		},

		next : function(){
			
		}

	

	})

	window.Page = Page;
	
})()


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
