# Vue2 初始化data
在文章开始之前，先提几个问题给自己：
1. `Vue` 的 `data` 数据是怎么挂载到 `Vue` 对象上的，为什么我们可以直接通过 `this.xxx` 来获取到
1. `Vue` 里的 `data` 是如何做响应式更新的
1. `Vue` 的数据更新流程是什么样的

带着这几个问题，来看看 `Vue.data` 从初始化到更新的过程是怎么样的。

## `Vue._init`

```js
Vue.prototype._init = function (options?: Object) {
  ...
  callHook(vm, 'beforeCreate')
  initState(vm)
  callHook(vm, 'created')
  ...
}
```

 在 `Vue._init` 函数里有一个 `initState` 函数，里面对 `data.props,methods` 做了初始化，

```js
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

我们主要看看 `initData` 发生了什么

```js
// src/core/instance/state.js
function initData (vm: Component) {
  let data = vm.$options.data
  // 这里判断 data 是不是一个函数
  data = vm._data = typeof data === 'function'
  // 如果是一个函数的话，返回 data()，this指向 vue
    ? getData(data, vm)
    : data || {}
  // isPlainObject 判断 data 是不是一个对象
  if (!isPlainObject(data)) {
    data = {}
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    )
  }
  
  // 这里获取到 data 的 keys 和 Vue.props , Vue.methods
  const keys = Object.keys(data)
  const props = vm.$options.props
  const methods = vm.$options.methods
  let i = keys.length
  while (i--) {
    const key = keys[i]
    // 这里做了两次判断。主要是让 key 不能和 props, methods 冲突
    
    // 判断如果不是内部私有的保留属性，做一层代理，代理到 _data 上。
    if (!isReserved(key)) {
      proxy(vm, `_data`, key)
    }
  }
  // 最后监听 data，让它变成响应式数据
  observe(data, true /* asRootData */)
}
```

对于 `initData` 来说它其实就是先获取到 `options.data` 然后判断了一下 `data` 的类型，需要让它的类型是一个 `obj` 然后不能和 `props, methods` 相冲突，最后执行了 `proxy` 和 `observer` 方法。

对于一开始的第一个问题，我们看看 `proxy(vm, '_data', key)` 里做了些什么就可以得到答案了

## `proxy(vm, '_data', key)`

```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

其实就是对我们的 `vm` 对象添加了一个监听，通过 `Object.defineProperty` 把 `data` 里的 `key` 直接定义到了 `vm` 上，而当我们获取和操作对应的数据时，其实 `set get` 的是 `vm._data` 上的数据。

## observer

```js
export function observe (value: any, asRootData: ?boolean): Observer | void {
  let ob: Observer | void
  ob = new Observer(value)
  return ob
}
```

在 `observe` 函数中最核心的步骤就是 `new Observer` 并且把我们的 `data` 传递进去。

## Observer 对象

在 `Observer` 这个对象里主要做的事情就是把传入的 `value` 变成响应式数据，通过 `Object.defineProperty 监听 `get set` `我们来看看 `Observer` 里做了什么事情。

```js
// src/core/observer/index.js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; 
	constructor (value: any) {
    this.value = value
    // src/core/util/lang.js def
    // 在 value 上定义 __ob__ 属性，参数是 Observert
    def(value, '__ob__', this)
		this.walk(value)
  }
  
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}


// src/core/util/lang.js
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    // 当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
    enumerable: !!enumerable,
    // writable 为 true 时，属性的值才可以被修改
    writable: true,
    // configurable 为 true 时，才能被删除，该属性的描述符才能够被改变
    configurable: true
  })
}

```

在 `Observer` 的构造函数里主要做了一下几步：

1. 首先通过 `def` 函数，把 `__ob__` 属性添加到传入的 `value` 上，也就是添加到 `options.data` 上，表示当前属性是不是响应式数据
2. 执行 `walk` 遍历 `data` ，把里面的每一项属性都传入 `defineReactive` 里，通过 `Object.defineProperty` 监听 `data` 的 `get set`

```js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      ...
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      ...
      dep.notify()
    }
  }
}
```

## 总结



