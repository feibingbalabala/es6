# es6

## let

### 基本用法

用来声明变量，用法类似于var，但声明的变量只在所在的代码块内有效。

```
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

在es5中由于for循环执行完毕，i最后等于9，导致打印出的就是9；<br />
在es6中let的块级作用域，使得每个i就是单独的i，则打印出来的是5。
```
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

```
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

```
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

```// 场景1
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

```// 场景2
  var string = "hello world!";
  for(var i = 0; i < string.length; i++) {
    console.log(string[i]);
  };
  console.log("end:", i); // 12
```

```// es5中立即执行函数，因为内部进入预编译状态，导致if内的fun覆盖了外部的fun输出"i am inside!"
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
  { // es6中立即执行函数的写法
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

```
  const pi = 3.14159265;
  console.log(pi); // 3.14159265
  pi = 3;
  console.log(pi) // Uncaught TypeError: Assignment to constant variable
  console.log(5 * pi) // 15.70796325
```

也存在块级作用域和暂时性死区

```
  if(true) {
    console.log(pi) // pi is not defined
    const pi = 3.14;
  };
  console.log(pi); // pi is not defined
```

const对象

```
  const person = {};
  person.name = 'zhangsan';
  person.age = 30;
  console.log(person.name); // zhangsan
  console.log(person.age); // 30
  console.log(person) //object {name: 'zhangsan', age: 30}
```

const数组

```
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

```
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

在module.js<br />
export const intVariantName = 100;<br />
export const FloatVariantName = 3.14;<br />
export const charVariantName = "variantValue";<br/>

在use.js<br />
import * as variant from './module';<br />
console.log(variant.intVariantName); //100<br />
console.log(variant.FloatVariantName); //3.14<br />
console.log(variant.charVariantName); //variantValue<br />

在otherUse.js<br/>
import {FloatVariantName, charVariantName} as variant from './module';<br/>
console.log(variant.FloatVariantName); // 3.14<br/>
console.log(variant.charVariantName); // "variantValue"<br/>

在onlyInt.js<br/>
import intVariantName as variant from './module';<br/>
console.log(variant.intVariantName); // 100

## 全局对象属性
全局对象是最顶层的对象，在浏览器环境指的是window对象，在Node.js指的是global对象。在javascript语言者，所有全局变量都是全局对象的属性。（Node的情况比较特殊，这一条只是对REPL环境适用，模块环境必须显示声明成global的属性。）<br/>
ES6规定，var命令和function声明是全局变量，属于全局对象的属性；let命令，const命令，class命令什么的全局变量，不属于全局对象的属性。
```
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