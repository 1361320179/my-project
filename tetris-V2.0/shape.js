//定义Cell类型描述格子
function Cell(r, c, src) {
  this.r = r;
  this.c = c;
  this.src = src;
}

//定义父类型Shape描述图形
function Shape(r0, c0, r1, c1, r2, c2, r3, c3, src, states, orgi) {
  this.cells = [
    new Cell(r0, c0, src),
    new Cell(r1, c1, src),
    new Cell(r2, c2, src),
    new Cell(r3, c3, src)
  ];
  this.states = states;//旋转状态数组
  this.orgCell = this.cells[orgi];//根据下标获得参照格
  this.statei = 0;//所有图形的初始状态为0状态
}

//在父类型Shape的原型对象中添加共有方法
Shape.prototype = {
  moveDown() {//this->当前图形
    //遍历当前图形的cells数组中每个cell
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].r++;//将当前cell的r+1
    }
  },
  moveLeft() {
    //遍历当前图形的cells数组中每个cell
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].c--;//将当前cell的c-1
    }
  },
  moveRight() {
    //遍历当前图形的cells数组中每个cell
    for (var i = 0; i < this.cells.length; i++) {
      this.cells[i].c++;//将当前cell的c+1
    }
  },
  rotateR() {
    this.statei++;//将statei+1
    //如果statei等于states的个数，将statei改回0
    this.statei == this.states.length && (this.statei = 0);
    this.rotate();
  },
  rotate() {
    //获得states中statei位置的状态对象
    var state = this.states[this.statei];
    //遍历当前图形的cells中每个格
    for (var i = 0; i < this.cells.length; i++) {
      var cell = this.cells[i];//将当前格临时保存在cell中
      if (cell != this.orgCell) {//如果当前格不是orgCell
        //将cell的r和c,以orgCell的r和c为参照，进行修正
        cell.r = this.orgCell.r + state["r" + i];
        cell.c = this.orgCell.c + state["c" + i];
      }
    }
  },
  rotateL() {
    this.statei--;//将statei-1
    //如果statei等于-1，将statei改回states的length-1
    this.statei == -1 && (this.statei = this.states.length - 1);
    this.rotate();
  },
}

//定义状态类型State
function State(r0, c0, r1, c1, r2, c2, r3, c3) {//相对于参照格的偏移量
  this.r0 = r0;
  this.c0 = c0;
  this.r1 = r1;
  this.c1 = c1;
  this.r2 = r2;
  this.c2 = c2;
  this.r3 = r3;
  this.c3 = c3;
}

//定义子类型T
function T() {
  Shape.call(this, 0, 3, 0, 4, 0, 5, 1, 4, "img/T.png",
    [//四个状态
      new State(0, -1, 0, 0, 0, +1, +1, 0),
      new State(-1, 0, 0, 0, +1, 0, 0, -1),
      new State(0, +1, 0, 0, 0, -1, -1, 0),
      new State(+1, 0, 0, 0, -1, 0, 0, +1)
    ],
    1
  );
}

//设置T的原型继承Shape的原型
Object.setPrototypeOf(T.prototype, Shape.prototype);

//定义子类型I,继承Shape的原型
function I() {
  Shape.call(this, 0, 3, 0, 4, 0, 5, 0, 6, "img/I.png",
    [
      new State(0, -1, 0, 0, 0, +1, 0, +2),
      new State(-1, 0, 0, 0, +1, 0, +2, 0)
    ],
    1
  );
}

Object.setPrototypeOf(I.prototype, Shape.prototype);

//定义子类型O,继承Shape的原型
function O() {
  Shape.call(this, 0, 4, 0, 5, 1, 4, 1, 5, "img/O.png",
    [
      new State(0, -1, 0, 0, +1, -1, +1, 0)
    ],
    1
  );
}

Object.setPrototypeOf(O.prototype, Shape.prototype);

//定义子类型L,继承Shape的原型
function L() {
  Shape.call(this, 0, 4, 1, 4, 2, 4, 2, 5, "img/L.png",
    [
      new State(-1, 0, 0, 0, +1, 0, +1, +1),
      new State(0, +1, 0, 0, 0, -1, +1, -1),
      new State(+1, 0, 0, 0, -1, 0, -1, -1),
      new State(0, -1, 0, 0, 0, +1, -1, +1)
    ],
    1
  );
}

Object.setPrototypeOf(L.prototype, Shape.prototype);

//定义子类型J,继承Shape的原型
function J() {
  Shape.call(this, 0, 5, 1, 5, 2, 5, 2, 4, "img/J.png",
    [
      new State(-1, 0, 0, 0, +1, 0, +1, -1),
      new State(0, +1, 0, 0, 0, -1, -1, -1),
      new State(+1, 0, 0, 0, -1, 0, -1, +1),
      new State(0, -1, 0, 0, 0, +1, +1, +1)
    ],
    1
  );
}

Object.setPrototypeOf(J.prototype, Shape.prototype);

//定义子类型Z,继承Shape的原型
function Z() {
  Shape.call(this, 0, 3, 0, 4, 1, 4, 1, 5, "img/Z.png",
    [
      new State(0, -1, 0, 0, +1, 0, +1, +1),
      new State(-1, 0, 0, 0, 0, -1, +1, -1)
    ],
    1
  );
}

Object.setPrototypeOf(Z.prototype, Shape.prototype);

//定义子类型S,继承Shape的原型
function S() {
  Shape.call(this, 0, 5, 0, 4, 1, 4, 1, 3, "img/S.png",
    [
      new State(0, +1, 0, 0, +1, 0, +1, -1),
      new State(+1, 0, 0, 0, 0, -1, -1, -1)
    ],
    1
  );
}

Object.setPrototypeOf(S.prototype, Shape.prototype);
