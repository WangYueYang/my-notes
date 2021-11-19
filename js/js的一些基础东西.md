# JS原型和原型链

> 模拟一下js原型链的关系图
>
> ``` js
> // 现在我们有一个构造函数 Fn()
> function Fn() {};
> // 生成Fn 的实例
> const fn = new Fn();
> // 一下是fn的原型和原型链的关系
> fn.__proto__ === Fn.prototype;
> Fn.prototype.__proto__ === Object.prototype;
> Fn.__proto__ === Function.prototype;
> Function.prototupe.__proto__ === Object.prototype;
> Object.prototype.__proto__ === null;
> Function.prototype.constructor === f Function()
> Object.prototype.constructor === f Object()
> f Object .__proto__ === Function.prototype
> ```
>
> 

## 什么是原型

js的函数里会有一个prototype属性，这个属性指向一个对象，那么这个对象就叫做函数fn的原型对象。在这个原型对象上有一个constructor属性，指向函数本身。

## 原型和原型链的关系

在js中有这么一条查找规则，如果试图寻找某个属性的时候，首先会在对象内部进行查找，找不到的话会去该对象的原型上进行查找。那么如果我们将一个对象的原型改写为另外一个对象比如：

Obj1.prototype = Obj2

如果我们查找obj1的某个属性name时，

- 首先会在Obj1内部进行查找，
- 其次在Obj1.prototype上也就是Obj2内部进行查找
- 在Obj2.prototype上进行查找，一直找到Object的原型对象上

这种搜索的轨迹,形似一条长链, 又因prototype在这个游戏规则中充当链接的作用,于是我们把这种实例与原型的链条称作 **原型链**

# 关于JS继承

## 构造函数继承

``` js
    // 构造函数继承
    function Father(name) {
      this.name = name;
      this.color = ['red', 'blue'];
      console.log('调用了father')
    }
    Father.prototype.say = function () {
      console.log('color', this.color);
      console.log('name', this.name)
    }
    function Son(name) {
      Father.call(this, name); // 构造函数继承
    }
    var son1 = new Son('son1'); 
    son1.color.push('black'); 
		console.log(son1.color, son1.name); // ['red', 'blue', 'black'] son1
    son1.say(); // son1.say is not func 无法继承父类原型上的属性, say为undefined
		var son2 = new Son('son2');
		console.log(son2.color, son2.name); // ['red', 'blue'] son2

```

在子类的构造函数内部直接通过call改变子类的this指向，

优点：保证了父类引用值的独立性，不再被所有实例共享，子类创建时也可以向父类传递参数，

缺点：子类无法继承父类原型上的属性。并且方法都在构造函数中定义, 因此函数复用也就不可用了

## 组合继承

``` js
		// 组合继承
    function Father(name) {
      this.name = name;
      this.color = ['red', 'blue'];
      console.log('调用了father')
    }
    Father.prototype.say = function () {
      console.log('color', this.color);
      console.log('name', this.name)
    }
    function Son(name) {
      Father.call(this, name); // 第一次调用 Father
    }
    Son.prototype = new Father(); // 第二次调用 Father

    var son1 = new Son('son1'); 
    son1.say();
```

在构造函数继承的基础上，我们把子类的prototype改写为父类的实例

优点：组合继承避免了原型链和借用构造函数的缺陷，而且, instanceof 和 isPrototypeOf( )也能用于识别基于组合继承创建的对象.

缺点：在我们继承时，调用了两次父类构造函数，造成了不必要的消耗。

## 原型继承

```js
// 原型继承
    function Object(o) {
      function F(){};
      F.prototype = o;
      return new F();
    }
    
    var obj = {
      names: ['haha', 'quer', 'geihei']
    }

    var sonObj1 = Object(obj);
    console.log(sonObj1.names, '第一次打印');
    sonObj1.names.push('aoligei');
    console.log(sonObj1.names, '第二次打印');
    var sonObj2 = Object(obj);
    console.log(sonObj2.names, 'sonObj2 第一次打印');
    sonObj2.names.push('zhuliy');
    console.log(sonObj2.names, 'sonObj2 第二次打印');
    console.log(sonObj1.names, 'sonObj1第三次打印');
```

通过构造函数直接改变prototype的形式来进行继承

缺点： 父类的引用值数据会被共享，也就是会出现一个子类修改了父类的引用值数据后其他子类也会发生改变。

解决办法：使用Object.create()

## 寄生组合继承

```js
    // 寄生组合继承
    function exted(father, child) {
      var proto = Object(fatehr.prototype); // 通过Object方法创建一个新的对象，这个对象的原型指向需要继承的父类
      proto.constructor = child; // Object方法中是直接通过原型继承的，proto的constructor被重写了，所以这里需要把proto的constructor指向需要继承的子类
      child.prototype = proto; // 指定继承对象
    }
```





