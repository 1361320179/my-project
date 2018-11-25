var elevator={
	FHEIGHT:414,//保存楼层高度
	UPLEVEAL:0,//保存亮灯区域的上限
	DOWNLEVEL:0,//保存亮灯区域的下限
	$spans:null,//保存所有楼层的气泡
	$elevator:null,//保存电梯按钮的div
	init(){
		var me=this;//me->elevator
		//计算UPLEVEL和DOWNLEVEL
		me.UPLEVEL=(innerHeight-me.FHEIGHT)/2;
		me.DOWNLEVEL=me.UPLEVEL+me.FHEIGHT;
		//找到所有楼层的气泡
		me.$spans=$(".floor>header>span");
		//找到电梯按钮的div
		me.$elevator=$("#elevator");
		//为当前窗口添加滚动事件
		$(window).scroll(function(){
			me.checkSpan();
			//如果有气泡亮，就设置elevator显示
			if(me.$spans.is(".hover")) me.$elevator.show();
			//否则就隐藏elevator
			else me.$elevator.hide();
		});
		//为elevator下的ul绑定鼠标进入事件委托，只允许li响应
		me.$elevator.children("ul")
			.on("mouseover","li",function(){//this->li
			//第一个a隐藏，第二个a显示
			$(this).children(":first").hide()
				.next().show();
		})
			.on("mouseout","li",function(){
			//获得当前li的下标i
			var i=$(this).index("#elevator>ul>li");
			//如果当前li对应的span没亮灯
			if(!me.$spans.eq(i).is(".hover"))
				//第一个a显示，第二个a隐藏
				$(this).children(":first").show()
					.next().hide();
		})
			.on("click","li",function(){
			//获得当前li的下标
			var i=$(this).index("#elevator>ul>li");
			//获得spans中i位置的span的offsetTop
			var offsetTop=me.$spans.eq(i).offset().top;
			var scroll=offsetTop-me.UPLEVEL;
			$(document.body).stop(true).animate({
				scrollTop:scroll
			},1000);
		});	
	}, 
	checkSpan(){//检查每个楼层的span是否亮灯
		var me=this;
		//对$spans中每个span执行相同操作
		me.$spans.each(function(i){//this->当前span
			//获得当前span的offsetTop
			var offsetTop=$(this).offset().top;
			//获得页面滚动的scrollTop
			var scrollTop=$(document.body).scrollTop();
			//如果offsetTop>=(scrollTop+UPLEVEL)且<(scrollTop+DOWNLEVEL)
			if(offsetTop>=(scrollTop+me.UPLEVEL)&&
			offsetTop<(scrollTop+me.DOWNLEVEL)){
				//设置当前span的class为hover
				$(this).addClass("hover");
				//找到id为elevator下的ul下的li,让li下第一个a隐藏，第二个a显示
				me.$elevator.find("ul>li").eq(i)
					.children(":first").hide()
					.next().show();
			}
			else{
				$(this).removeClass("hover");
				//找到id为elevator下的ul下的li,让li下第一个a显示，第二个a隐藏
				me.$elevator.find("ul>li").eq(i)
					.children(":first").show()
					.next().hide();
			}
		});
	},
}
elevator.init();