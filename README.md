# es6

## let

### 基本用法

用来声明变量，用法类似于var，但声明的变量只在所在的代码块内有效。

``` js
  var a = 100;
  let b = 200;
  console.log(a); // 100
  console.log(b); // 200

  // let是块级作用域
  {
    var c = 10;
    let d = 20;
  };
  console.log(c); // 10
  console.log(d); // b is not defined
```

### 不存在变量提升

在es5中由于for循环执行完毕，i最后等于9，导致打印出的就是9;

在es6中let的块级作用域，使得每个i就是单独的i，则打印出来的是5。

``` js
  // es5的写法
  var e = [];
  for(var i = 0; i< 10; i++) {
    var f = i;
    e[i] = function() {
      console.log(f)
    }
  };
  e[5](); // 9
  // es6的写法
  var h = [];
  for(var i = 0; i< 10; i++) {
    let j = i;
    h[i] = function() {
      console.log(j)
    }
  };
  h[5](); // 5
```

### 暂时性死区

我对这个的理解应该是，是因为变量进行了声明，但是还没有赋值。

``` js
  {
    console.log(a); // 函数未定义Uncaught ReferenceError
    let a = 100;
    console.log(a); // 100
  }
  如果使用var，就会寻找上级，然后赋值。
  var a = 200;
  {
    console.log(a); // 200
    console.log(b); // undefined
    var a = 100;
    var b = 50;
    console.log(a); // 100
    console.log(b); // 50
  }
  console.log(a); // 100
```

### 模块内部不允许重复声明,模块之间不影响

``` js
  {
    var a = 100;
    var a = 200;
    console.log(a); // 200
  };
  {
    let a = 300;
    console.log(a); // 300
  };
  {
    var b = 100;
    let b = 200;
    console.log(b); // Uncaught SyntaxError: Identifier 'b' has already been declared
  };
  {
    let c = 100;
    var c = 200;
    console.log(c); // Uncaught SyntaxError: Identifier 'c' has already been declared
  };
  {
    let d = 100;
    let d = 200;
    console.log(d); // Uncaught SyntaxError: Identifier 'd' has already been declared
  };
```

## 块级作用域

### 为什么需要块级作用域

timer在fun中进入预编译进行了变量的声明，但是还没有进行赋值，导致输出的是undefined

``` js
    // 场景1
    var timer = new Date();
    function fun() {
      console.log(timer);
      if (false) {
        var timer = "hellow world";
      };
    };
    fun(); // undefined
```

i在执行后并没有在内存中释放出来，存在内存里面，导致可能出现后面如果有变量名为i的参数相互作用。

``` js
  // 场景2
  var string = "hello world!";
  for(var i = 0; i < string.length; i++) {
    console.log(string[i]);
  };
  console.log("end:", i); // 12
```

``` js
// es5中立即执行函数，因为内部进入预编译状态，导致if内的fun覆盖了外部的fun输出"i am inside!"
  function fun() {
    console.log("i am outside!")
  };
  (function() {
    if (false) {
        function fun() {
          console.log("i am inside!")
        };
    };
    fun();
  }()); //i am inside!

  // es6中块级作用域
  function fun1() {
    console.log("i am outside!")
  };
  {
    // es6中立即执行函数的写法
    if (false) {
        function fun1() {
          console.log("i am inside!")
        };
    };
    fun1();
  }
```

## const

const声明的是常量，常量的值一旦声明就不能改变。不可重复。

``` js
  const pi = 3.14159265;
  console.log(pi); // 3.14159265
  pi = 3;
  console.log(pi) // Uncaught TypeError: Assignment to constant variable
  console.log(5 * pi) // 15.70796325
```

也存在块级作用域和暂时性死区

``` js
  if(true) {
    console.log(pi) // pi is not defined
    const pi = 3.14;
  };
  console.log(pi); // pi is not defined
```

const对象

``` js
  const person = {};
  person.name = 'zhangsan';
  person.age = 30;
  console.log(person.name); // zhangsan
  console.log(person.age); // 30
  console.log(person) //object {name: 'zhangsan', age: 30}
```

const数组

``` js
  const arr = [];
  console.log(arr); // []
  console.log(arr.length); // 0
  console.log("----");
  arr.push("hello world");
  console.log(arr); // ['hello world']
  console.log(arr.length); // 1
  console.log("----");
  arr[0] = 'second';
  console.log(arr); // ['second']
  console.log(arr.length); //1
  console.log("----");
  arr.length = 0;
  console.log(arr); // []
  console.log(arr.length); // 0
  console.log("----");

  arr = ['123']; //Assignment to constant variable.
```

const对象冻结

``` js
    const person = Object.freeze({});
    person.name = "zhangsan";
    person.age = 30;
    console.log(person.name); // undefined
    console.log(person.age); // undefined
    console.log(person); // {}
    // 使用const冻结对象
    const person = Object.freeze({
      name: "zhangsan",
      age: 30
    });
    console.log(person.name); // zhangsan
    console.log(person.age); // 30
    console.log(person); // {}
    // 彻底冻结整个对象，包括对象中的key
    var constatize = (obj) => {
      Object.freeze(obj);
      Object.keys(obj).forEach((item, val) => {
        if(typeof obj[key] === 'object') {
          constatize(obj[key]);
        };
      });
    };
```

## 跨模块常量

在module.js

``` js
  export const intVariantName = 100;
  export const FloatVariantName = 3.14;
  export const charVariantName = "variantValue";
```

在use.js

``` js
import * as variant from './module';
console.log(variant.intVariantName); //100
console.log(variant.FloatVariantName); //3.14
console.log(variant.charVariantName); //variantValue
```

在otherUse.js

``` js
import {FloatVariantName, charVariantName} as variant from './module';

console.log(variant.FloatVariantName); // 3.14

console.log(variant.charVariantName); // "variantValue"
```

在onlyInt.js

``` js
import intVariantName as variant from './module';

console.log(variant.intVariantName); // 100
```

## 全局对象属性

全局对象是最顶层的对象，在浏览器环境指的是window对象，在Node.js指的是global对象。在javascript语言者，所有全局变量都是全局对象的属性。（Node的情况比较特殊，这一条只是对REPL环境适用，模块环境必须显示声明成global的属性。）

ES6规定，var命令和function声明是全局变量，属于全局对象的属性；let命令，const命令，class命令什么的全局变量，不属于全局对象的属性。

``` js
    var varName = "varValue";
    // 浏览器环境下
    console.log(window.varName); // varValue
    // node.js环境下
    console.log(global.varName); // varValue
    // 通用情况
    console.log(this.varName); // varValue

    let letName = "letValue";
    console.log(window.letName); // undefined -- use strict
    console.log(this.letName); // undefined -- use strict
```

## 变量的解构赋值

### 数组的解构赋值

Destructuring

es6允许按照一定模式，从数组和对象中提取值，对变量进行复制，这被称为解构（Destructuring）

``` js
    // es5
     var a = 1;
     var b = 2;
     var c = 3;

     es6
     var [a, b, c] = [1, 2, 3];
     console.log(a); // 1
     console.log(b); // 2
     console.log(c); // 3

    let [foo, [[bar], base]] = [1, [[2], 3]];
    console.log(foo); // 1
    console.log(bar); // 2
    console.log(base); // 3

    let [, ,third] = ['first', 'second', 'third'];
    console.log(third); // third

    let [one, , three] = ['one', '', 'three'];
    console.log(one); // one
    console.log(three); // three

    let [head, ...tail] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    console.log(head); // 0;
    console.log(tail); // [1, 2, 3, 4, 5, 6, 7, 8, 9]

    // 数组解构失败，默认undefined
    var [temp] = [];
    console.log(temp); //undefined
    var [a, b] = [100];
    console.log(a); // 100
    console.log(b); // undefined
```

不完全解构
等号左边的模式，只匹配一部分等号右边的数组。

``` js
  // 不完全解构

    let [x, y] = [1, 2, 3];
    console.log(x) // 1
    console.log(y) // 2

    let [a, [b], c] = [1, [2, 3], 4]
    console.log(a); // 1
    console.log(b); // 2
    console.log(c); // 4
```

指定默认值
es6中内部严格使用相等运算符(===)判断一个位置是否有值。所以如果一个数组成员不严格等于undefined,默认值是不会生效的。

``` js
    // 指定默认值

    var [temp = 'string'] = [];
    console.log(temp); // string

    var [temp = 'string'] = ['tempString'];
    console.log(temp) // tempString

    var [x = 'aaa', y] = ['bbb'];
    console.log(x) // bbb
    console.log(y) // undefined

    var [m, n = 'aaa'] = ["bbb"];
    console.log(m); // bbb;
    console.log(n); // aaa

    var [p, q = "aaa"] = ["bbb", undefined];
    console.log(p); // bbb
    console.log(q); // aaa 不会被undefined所覆盖，因为有默认值，所以不会被默认值覆盖
```

let和const命令

``` js
    // 非遍历解构，会直接报错

    var [temp] = 1;
    console.log(temp) // 1 is not iterable
    var [temp] = false;
    console.log(temp) //  false is not iterable
    var [temp] = undefined;
    console.log(temp) // undefined is not iterable
    var [temp] = NaN;
    console.log(temp) // NaN is not iterable
    var [temp] = null;
    console.log(temp) // null is not iterable
```

只要某种结构具有Iterator接口，都可以采用数组形式的解构赋值。

1、遍历器（Iterator）是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署Iterator接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

2、Iterator的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是ES6创造了一种新的遍历命令for...of循环，Iterator接口主要供for...of消费。

3、在ES6中，有些数据结构原生具备Iterator接口（比如数组），即不用任何处理，就可以被for...of循环遍历，有些就不行（比如对象）。原因在于，这些数据结构原生部署了Symbol.iterator属性（详见下文），另外一些数据结构没有。凡是部署了Symbol.iterator属性的数据结构，就称为部署了遍历器接口。调用这个接口，就会返回一个遍历器对象。

4、在ES6中，有三类数据结构原生具备Iterator接口：数组、某些类似数组的对象、Set和Map结构。
Destructuring

5、有一些场合会默认调用Iterator接口（即Symbol.iterator方法），除了下文会介绍的for...of循环，还有几个别的场合。

解构赋值

扩展运算符(...)

yield*_yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。
由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用

6、字符串是一个类似数组的对象，也原生具有Iterator接口。

7、遍历器对象除了具有next方法，还可以具有return方法和throw方法。如果你自己写遍历器对象生成函数，那么next方法是必须部署的，return方法和throw方法是否部署是可选的。

``` js
    //function* 这种声明方式(function关键字后跟一个星号）会定义一个生成器函数 (generator function)，它返回一个  Generator  对象。
    let [a, b, c] = new Set(['a', 'b', 'c']);
    console.log(a); // a
    console.log(b); // b
    console.log(c); // c

    function* fibs () {
      let a = 0;
      let b = 1;
      while (true) {
        yield a;
        [a, b] = [b, a + b];
      }
    };
    var [first, second, third, fourth, fifth, six] = fibs();
    console.log(six) // 5
```

他的返回值满足可遍历的结构的返回值

### 对象的解构赋值

对象的属性没有次序，变量名必须与属性同名，擦能取到正确的值

``` js
  var {name, age, id} = {id: '001', name: 'jwy', age: 26};
  console.log(name); // jwy
  console.log(age); // 26
  console.log(id); // 001

  var {name: person_name, age: person_age} = {id: '001', name: 'jwy', age: 26};
  console.log(person_name); // jwy
  console.log(person_age); // 26

  let object = {first: 'hello', last: 'world'};
  let {first: first_name, last: last_name} = object
  console.log(first_name, last_name) // hello world
```

指定默认值
默认值的生效条件，对象的属性严格等于Undefined

``` js
  var {x = 3} = {};
  console.log(x); // 3

  var {x, y = 5} = {x: 1}
  console.log(x); // 1
  console.log(y);  // 5

  var {message: msg = 'I am superman'} = {};
  console.log(msg); // I am superman
  // console.log(message); // message is not defined

  var {x = 3} = {x: undefined};
  console.log(x) // 3
  var {y = 5} = {y: null};
  console.log(y) // null
```

已声明的变量用于解构赋值

``` js
  var s;
  // {s} = {s: 1}; Unexpected token =
  ({s} = {s: 1})
  console.log(s) // 1
```

现有对象的方法
对象的解构赋值，可以很方便使用对象中的方法，赋值到某个变量

``` js
  console.log(Math.sin(Math.PI / 6)); // 0.49999999999999994

  let {sin, cos, tan, PI} = Math;
  // 这个PI要注意大小写
  console.log(sin(PI/6)) // 0.49999999999999994
```

### 字符串的解构赋值

字符串也可以解构赋值，字符串被转换成了一个类似数组的对象

``` js
  const [a, b, c, d, e] = 'hello';
  console.log(a); // h
  console.log(b); // e
  console.log(c); // l
  console.log(d); // l
  console.log(e); // o
```

字符串的属性解构，类似数组的对象都有一个length属性，因此还可以对这个属性解构赋值。

``` js
  const {length: len} = 'hello';
  console.log(len); // 5
  const {length} = 'hello world!';
  console.log(length) // 12
```

### 函数的解构赋值

函数参数的解构赋值

``` js
  function sum ([x, y]) {
    return x + y;
  };
  
  console.log(sum([1, 2])); // 3
```

函数参数的解构赋值也可以使用默认值

``` js
  function fun ({x = 0, y = 0} = {}) {
    return [x, y]
  };
  console.log(fun({x: 100, y: 200})); // [100, 200]
  console.log(fun({x: 100})) // [100, 0]
  console.log(fun({})); // [0, 0]
  console.log(fun()); // [0, 0]
```

函数并不是在()中做了一个解构赋值，所以会出现undefined

``` js
  function no ({x, y} = {x: 0, y: 0}) {
    return [x, y]
  }
  console.log(no({x: 100, y: 200})); // [100, 200]
  console.log(no({x: 100})) // [100, undefined]
  console.log(no({})); // [undefined, undefined]
  console.log(no()); // [0, 0]
```

### 解构赋值的运用

交换变量的值

``` js
  // ES5的交换变量
  var a = 100;
  var b = 200;
  console.log(a, b); // 100 200
  var temp = '';
  temp = a;
  a = b;
  b = temp;
  console.log(a, b); // 200 100

  // ES6
  var x = 100;
  var y = 200;
  console.log(x, y); // 100 200
  [x, y] = [y, x];
  console.log(x, y); // 200 100
```

函数返回多个值

``` js
  // 返回一个数组
  function retrunArr () {
    return [1, 2, 3];
  }
  console.log(retrunArr()) // [1, 2, 3]

  var [x, y, z] = retrunArr();
  console.log(x); // 1
  console.log(y); // 2
  console.log(z); // 3

  // 返回一个对象
  function retrunObj () {
    return {
      id: '001',
      name: 'jwy',
      age: 18
    }
  };
  var {id, name, age} = retrunObj();
  console.log(id); // 001
  console.log(name); // jwy
  console.log(age); // 18

  var {id: person_id, name: person_name, age: person_age} = retrunObj()
  console.log(person_id); // 001
  console.log(person_name); // jwy
  console.log(person_age); // 18
```

函数参数的定义

``` js
  // 1、参数是一种有次序的值
  function arrFun([x, y, z]) {
    console.log(x, y, z);
  };
  arrFun([100, 200, 300]); // 100, 200, 300
  // 2、参数是一组无次序的值
  function fun ({id, name, age}) {
    console.log(id, name, age)
  };
  fun({id: '001', name: 'jwy', age: 18}) // 001 jwy 18
```

提取json数据

``` js
  var jsonData = {
    id: '001',
    name: 'jwy',
    sex: 'man',
    age: 18,
    classes: {
      computer: 98,
      englist: 100
    },
    arr: [1, 2]
  };
  // es5
  console.log(jsonData.id); // 001
  console.log(jsonData.name); // jwy
  console.log(jsonData.sex); // man
  console.log(jsonData.age); // 18
  console.log(jsonData.classes.computer); // 98
  console.log(jsonData.classes.englist); // 100
  console.log(jsonData.arr[0]); // 1
  console.log(jsonData.arr[1]); // 2
  // es6
  let {id: number, name, age, classes: {computer}, arr: [x]} = jsonData;
  console.log(number); // 001
  console.log(name); // jwy
  console.log(age); // 18
  console.log(computer); // 98
  console.log(x); // 1
```

遍历map结构

``` js
  var map = new Map();
  map.set('id', '001');
  map.set('name', 'jwy');
  console.log(map) // {"id" => "001", "name" => "jwy"}
  for (let [key, value] of map) {
    console.log(key, value) // id 001
                            // name jwy
  };
  // 获取map的值
  for (let [, value] of map) {
    console.log(value); // 001
                        // jwy
  }
```

输入模块的指定方法

``` js
import {func1, func2} from 'func.js'
```