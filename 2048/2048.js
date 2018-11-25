var game={
	data:null,RN:4,CN:4,//保存游戏二维数组，总行数，列数
	score:0,//保存得分
	state:1,//保存游戏状态：1表示运行中，0表示结束
	RUNNING:1,//专门表示运行中状态
	GAMEOVER:0,//专门表示游戏结束状态
	//每个属性和方法之间必须用逗号分隔！
	//对象自己的方法要使用自己的属性，必须this.
	start(){//游戏启动
		this.state=this.RUNNING;//重置游戏状态为运行中
		score=0;//分数清零
		//新建空数组保存在data中
		this.data=[];
		for(var r=0;r<this.RN;r++){//r从0开始，到<RN结束
			//新建空数组保存到data中r行
			this.data[r]=[];
			for(var c=0;c<this.CN;c++){//c从0开始，到<CN结束
				//设置data中r行c列的值为0
				this.data[r][c]=0;
			}
		}
		//(遍历结束)
		this.randomNum();
		this.randomNum();
		//console.log(this.data.join("\n"));
		this.updateView();
		//事件：内容/设备状态的改变
		//事件处理函数：在事件发生时自动执行的操作
		document.onkeydown=function(e){
		//this->.前的document->game
			switch(e.keyCode){
				case 37://左移
					this.moveLeft();
					break;
				case 38://上移
					this.moveUp();
					break;
				case 39://右移
					this.moveRight();
					break;
				case 40://下移
					this.moveDown();
			}
		}.bind(this);
	},
	randomNum(){//在一个随机位置生成2或4
		//反复：
		while(true){
			//在0~RN-1之间生成一个随机数r
			var r=Math.floor(Math.random()*this.RN);
			//在0~CN-1之间生成随机数c
			var c=Math.floor(Math.random()*this.CN);
			//如果data中r行c列的值为0
			if(this.data[r][c]==0){
				//将data中r行c列赋值为：
					//随机生成一个小数，如果<0.5,就取2，否则就取4
				this.data[r][c]=Math.random()<0.5?2:4;
				//退出循环
				break;
			}
		}
	},
	updateView(){//将data中的数据更新到每个div中
		//遍历二维数组
		for(var r=0;r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				var n=this.data[r][c];
				//找到id为"c"rc的div
				var div=document.getElementById("c"+r+c);
				if(n!=0){//如果n不是0
					//设置div的内容为n
					div.innerHTML=n;
					//设置div的class为"cell n"+n
					div.className="cell n"+n;
				}
				else{//否则
				//清除div的内容
				div.innerHTML="";
				//恢复div的class为cell
				div.className="cell";
				}
			}
		}
		document.getElementById("score").innerHTML=this.score;
		//找到id为gameOver的div
		var div=document.getElementById("gameOver");
		if(this.state==this.GAMEOVER){
			//如果游戏状态为GAMEOVER就设置div显示
			div.style.display="block";
			//找到id为final的span,设置其内容为score
			document.getElementById("final").innerHTML=this.score;
		}
		//否则就设置div隐藏
		else{
			div.style.display="none";
		}
	},
	getNextInRow(r,c){//查找r行c位置下一个不为0的位置
		//i从c+1开始到<CN结束
		for(var i=c+1;i<this.CN;i++){
			//如果i位置的值不为0，就返回i
			if(this.data[r][i]!=0)
			{
				return i;
			}
		}
		//(遍历结束)
		//返回-1
		return -1;
	},
	moveLeftInRow(r){//左移第r行
		//c从0开始，到<CN-1
		for(var c=0;c<this.CN-1;c++){
			//查找r行c位置下一个不为0的位置nextc
			var nextc=this.getNextInRow(r,c);
			//如果没找到就退出循环
			if(nextc==-1)
			{
				break;
			}
			//否则
			else{
				if(this.data[r][c]==0){//如果c位置的值是0
				//将nextc位置的值赋值给c位置
				this.data[r][c]=this.data[r][nextc];
				//将nextc位置的值置为0
				this.data[r][nextc]=0;
				//c留在原地
				c--;
				}
				//否则，如果c位置的值等于nextc位置的值
				else if(this.data[r][c]==this.data[r][nextc]){
					//将c位置的值*2
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					//将nextc位置的值置为0
					this.data[r][nextc]=0;
				}
			}
		}
	},
	moveLeft(){//左移所有行
		//为数组拍照保存在before中
		var before=String(this.data);
		//r从0开始，到<RN结束
		for(var r=0;r<this.RN;r++){
			//左移第r行
			this.moveLeftInRow(r);
		}
		//(循环结束)
		//为数组拍照保存在after中
		var after=String(this.data);
		//如果before!=after
		if(before!=after){
			//随机生成数
			this.randomNum();
				if(this.isGameOver()){//如果游戏结束
					this.state=this.GAMEOVER;//修改游戏状态
				}
			//更新页面
			this.updateView();
		}
	},
	getPrevInRow(r,c){//查找r行c位置左侧前一个不为0的位置
		//i从c-1开始，到=0结束
		for(var i=c-1;i>=0;i--){
			//如果data中r行i位置的值不为0,就返回i
			if(this.data[r][i]!=0){
				return i;
			}
		}
		//循环结束
		//返回-1
		return -1;
	},//,别忘记了，找错误浪费了很久
	moveRightInRow:function(r){//右移第r行
    //c从CN-1开始,到>0结束,反向遍历r行中每个格
		for(var c=this.CN-1;c>0;c--){
      //找r行c列左侧前一个不为0的位置prevc
			var prevc=this.getPrevInRow(r,c);
      //如果prevc为-1,就退出循环
			if(prevc==-1){
				break;
				}
      //否则
      else{
				if(this.data[r][c]==0){//如果c列的值是0
					//将prevc列的值赋值给c列
					this.data[r][c]=this.data[r][prevc];
					//将prevc列的值置为0
					this.data[r][prevc]=0;
					//c留在原地
					c++;
				}
				//否则
				else if(this.data[r][c]==this.data[r][prevc]){//如果c列的值等于prevc列的值
					//将c列的值*2
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
					//将prevc列置为0
					this.data[r][prevc]=0;
				}
			}
		}
	},
	moveRight:function(){//右移所有行
    //为data拍照，保存在before中
		var before=String(this.data);
    for(var r=0;r<this.RN;r++){//遍历data中每一行
      //右移第r行
			this.moveRightInRow(r);
		}
    //(遍历结束)
    //为data拍照，保存在after中
		var after=String(this.data);
    if(before!=after){//如果发生了移动
      //随机生成数
			this.randomNum();
			if(this.isGameOver()){//如果游戏结束
					this.state=this.GAMEOVER;//修改游戏状态
				}
      //更新页面
			this.updateView();
		}
  },
	getNextInCol:function(r,c){
    //r+1
    for(var i=r+1;i<this.RN;i++){//循环，到<RN结束，i每次递增1
      //如果i位置c列不等于0, 就返回i
			if(this.data[i][c]!=0){
				return i;
			}
		}
    //(遍历结束)
    return -1;//返回-1	
	},
	moveUpInCol:function(c){
    //r从0开始,到r<RN-1结束，r每次递增1
		for(var r=0;r<this.RN-1;r++){
      //查找r行c列下方下一个不为0的位置nextr
			var nextr=this.getNextInCol(r,c);
      //如果没找到,就退出循环
			if(nextr==-1){break;}
      else{//否则  
        //如果r位置c列的值为0
				if(this.data[r][c]==0){
          //将nextr位置c列的值赋值给r位置
					this.data[r][c]=this.data[nextr][c];
          //将nextr位置c列置为0
					this.data[nextr][c]=0;
          //r留在原地
					r--;
				}
        //否则，如果r位置c列的值等于nextr位置的值    
				else if(this.data[r][c]==this.data[nextr][c]){
          //将r位置c列的值*2
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
          //将nextr位置c列的值置为0
					this.data[nextr][c]=0;
				}
			}
		}
	},
	moveUp:function(){
		//为data拍照保存在before中
		var before=String(this.data);
		for(var c=0;c<this.CN;c++){//遍历data中每一列
			//调用moveUpInCol上移第c列
			this.moveUpInCol(c);
		}
		//为data拍照保存在after中
		var after=String(this.data);
		if(before!=after){//如果before不等于after
			//随机生成数
			this.randomNum();
			if(this.isGameOver()){//如果游戏结束
					this.state=this.GAMEOVER;//修改游戏状态
				}
			//更新页面
			this.updateView();
		}
	},
	getPrevInCol:function(r,c){
    //r-1
    //循环，i到>=0结束，每次递减1
		for(var i=r-1;i>=0;i--){
      //如果i位置c列不等于0, 就返回i
			if(this.data[i][c]!=0){
				return i;
			}
		}
    //(遍历结束)
    return -1;//返回-1
	},
	moveDownInCol:function(c){
    //r从RN-1开始，到r>0结束，r每次递减1
		for(var r=this.RN-1;r>0;r--){
      //查找r位置c列上方前一个不为0的位置prevr
			var prevr=this.getPrevInCol(r,c);
      //如果没找到,就退出循环
			if(prevr==-1){break;}
      else{//否则  
        //如果r位置c列的值为0
				if(this.data[r][c]==0){
          //将prevr位置c列的值赋值给r位置
					this.data[r][c]=this.data[prevr][c];
          //将prevr位置c列置为0
					this.data[prevr][c]=0;
          r++;//r留在原地
				}
        //否则，如果r位置c列的值等于prevr位置的值
				else if(this.data[r][c]==this.data[prevr][c]){
          //将r位置c列的值*2
					this.data[r][c]*=2;
					this.score+=this.data[r][c];
          //将prevr位置c列置为0
					this.data[prevr][c]=0;
				}
			}
		}
	},
	moveDown:function(){
		//为data拍照保存在before中
		var before=String(this.data);
		//遍历data中每一列
		for(var c=0;c<this.CN;c++){
			//调用moveDownInCol下移第c列
			this.moveDownInCol(c);
		}
		//为data拍照保存在after中
		var after=String(this.data);
		//如果before不等于after
			if(before!=after){
				//随机生成数
				this.randomNum();
				if(this.isGameOver()){//如果游戏结束
					this.state=this.GAMEOVER;//修改游戏状态
				}
				//更新页面
				this.updateView();
			}
	},
	isGameOver(){//判断游戏是否结束
		for(var r=0;r<this.RN;r++){//遍历data
			for(var c=0;c<this.CN;c++){
			//如果当前元素是0，返回false
			if(this.data[r][c]==0){return false}
			//否则，如果c<CN-1且当前元素等于右侧元素
			else if((c<this.CN-1)&&(this.data[r][c]==this.data[r][c+1]))
				{return false}//返回false
			//否则，如果r<RN-1且当前元素等于下方元素
			else if((r<this.RN-1)&&(this.data[r][c]==this.data[r+1][c]))
				{return false}//返回false
			}
		}
		//(遍历结束)
		return true;//返回true
	},
}
game.start();