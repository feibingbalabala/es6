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