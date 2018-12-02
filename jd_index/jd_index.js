/*广告图片数组*/
var imgs=[
	{"img":"images/index/banner_01.jpg"},
    {"img":"images/index/banner_02.jpg"},
    {"img":"images/index/banner_03.jpg"},
    {"img":"images/index/banner_04.jpg"},
    {"img":"images/index/banner_05.jpg"},
];
var slider={
	LIWIDTH:670,//保存每个li的宽度
	$ulImgs:null,//保存id为imgs的ul
	$ulIdxs:null,//保存id为indexs的ul
	DURATION:500,//保存单次移动时间
	WAIT:3000,//保存轮播的等待时间
	moved:0,//保存已经左移的li个数
	init(){
		var me=this;
		//选择id为imgs的ul保存到$ulImgs中
		me.$ulImgs=$("#imgs");
		//选择id为indexs的ul保存在$ulIdxs中
		me.$ulIdxs=$("#indexs");
		me.initView();//初始化界面
		me.autoMove();//启动自动轮播
		//当鼠标进入slider，停止轮播，当鼠标移出，再次启动
		$("#slider").hover(function(){
			me.$ulImgs.stop(true);
		},function(){
			me.autoMove();
		});
		//为ulImgs添加鼠标进入事件委托，只允许li>img响应事件
		me.$ulImgs.on("mouseover","li>img",function(e){
			var $tar=$(e.target);
			//获得当前img的下标
			var i=$tar.index("#imgs img");
			i==imgs.length&&(i=0);
			me.moved=i;//修改moved等于i
			//修改ulImgs的left为-moved*LIWIDTH
			me.$ulImgs.css("left",-me.moved*me.LIWIDTH);
			me.changeHover();//根据moved修改hover
		});
		//为ulIdxs添加鼠标进入事件委托，只允许li响应
		me.$ulIdxs.on("mouseover","li",function(e){
			var $tar=$(e.target);
			if(!$tar.is(".hover")){
				var endi=$tar.index("#indexs>li");
				var starti=$(".hover").index("#indexs>li");
				//修改moved为
				me.moved+=(endi-starti);
				me.changeHover();//修改hover
				//让$ulImgs移动到moved*LIWIDTH的位置
				me.$ulImgs.stop(true).animate({
					left:-me.moved*me.LIWIDTH
				},me.DURATION);
			}
		});
	},
	initView(){//将imgs数组的内容生成页面元素
		//遍历imgs中每个img，同时声明空字符串htmlImgs和htmlIdxs
		for(var i=0,htmlImgs="",htmlIdxs="";i<imgs.length;i++){
			//向htmlImgs中拼接：
				htmlImgs+=`<li><img src='${imgs[i].img}'></li>`;
			//向htmlIdxs中拼接：
				htmlIdxs+=`<li>${i+1}</li>`;
		}//(遍历结束)
		//设置$ulImgs的html内容为htmlImgs
		this.$ulImgs.html(htmlImgs)
		//设置$ulImgs的宽为imgs的元素个数*LIWIDTH
			.css("width",(imgs.length+1)*this.LIWIDTH);
		//在$ulImgs中追加一个第一个元素的clone
		this.$ulImgs.append(
			this.$ulImgs.children(":first").clone());
		//设置$ulIdxs的html内容为htmlIdxs
		this.$ulIdxs.html(htmlIdxs);
		//设置$ulIdxs中第1个li添加hover class
		this.$ulIdxs.children(":first").addClass("hover");
	},
	autoMove(){//自动轮播
		var me=this;
		me.moved++;
		//先等待WAIT，再移动到moved*LIWIDTH
		me.$ulImgs.animate({"null":1},me.WAIT,//用一个无意义的属性做一个动画，然后把要执行的动画放入该动画的callback中，相当于等待后执行
							//delay(me.WAIT)  
		//问题：stop只能停止aimate,停止不了delay,会导致delay叠加，所以用此解决方法
		function(){
			me.$ulImgs.animate({
			left:-me.moved*me.LIWIDTH},
		me.DURATION,function(){//本次移动后
			//如果moved等于imgs的个数
			if(me.moved==imgs.length){
				//将ulImgs的left归0
				me.$ulImgs.css("left",0);
				//将moved归0
				me.moved=0;
			}
			me.changeHover();//调整圆点
			me.autoMove();//再启动自动轮播
			});
		})
	},
	changeHover(){//根据moved调整圆点的hover
		//将ulIdxs中moved位置的圆点添加hover，去掉兄弟的hover
			this.$ulIdxs.children().eq(this.moved)
				.addClass("hover")
				.siblings().removeClass("hover");
	},
}
slider.init();
