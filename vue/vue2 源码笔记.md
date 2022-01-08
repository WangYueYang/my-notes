# Vue 初始化

在 src/core/instance/index.js 下有 Vue 的实例函数，这个文件里声明了 vue 的主函数，并且执行了 initMixin stateMixin eventsMixin lifecycleMixin renderMixin 这五个函数，我们可以分别来看一下这五个函数都是做什么的

``` js

function Vue(options) {
    this._init(options)
}


initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

## initMixin(Vue)

在 Vue.prototype 上挂载了 _init 函数，在Vue的构造函数里会执行此方法，

```typescript
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
 			......   
  }
}  
```

在 _init 里执行了 beforeCreate，created 声明周期，以及其他东西的初始化

## stateMixin(Vue)

[实例方法 / 数据](https://cn.vuejs.org/v2/api/#实例方法-数据)

```typescript
export function stateMixin (Vue: Class<Component>) {
    const dataDef = {}
  dataDef.get = function () { return this._data }
  const propsDef = {}
  propsDef.get = function () { return this._props }
  ...
    Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)
    Vue.prototype.$set = set
  	Vue.prototype.$delete = del
   	Vue.prototype.$watch = function (){}
}
```

在stateMixin里对 Vue.prototype.$data 和 $props 通过 Object.definePrototype 的 get 操作，返回的是 vm 的 _data || _props ，并且只能获取，不能通过 vm.$data = xxx 来进行修改。

在 Vue.prototype 上挂载了 $set $delete 和 $watch 方法。

## eventsMixin(Vue)

[实例方法 / 事件](https://cn.vuejs.org/v2/api/#实例方法-事件)

```typescript
export function eventsMixin (Vue: Class<Component>) {
  Vue.prototype.$on = function (event: string | Array<string>, fn: Function): Component {}
  Vue.prototype.$once = function (event: string, fn: Function): Component {}
  Vue.prototype.$off = function (event?: string | Array<string>, fn?: Function): Component {}
  Vue.prototype.$emit = function (event: string): Component {}
}
```

在 vue 的原型上挂载了 $on, $once, $off, $emit 事件

## lifecycleMixin(Vue)

```typescript
export function lifecycleMixin (Vue: Class<Component>) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {}
  Vue.prototype.$forceUpdate = function () {}
  Vue.prototype.$destroy = function () {}
}
```

在 vue 原型上挂载了 _update, $forceUpdate, $destroy 方法。

其中_update: render函数执行以后会生成虚拟节点Vnode，Vnode以参数传入_update方法，此方法的作用就是更新或渲染真实的dom节点 非常重要

## renderMixin(Vue)

```js
export function renderMixin (Vue: Class<Component>) {
  installRenderHelpers(Vue.prototype)
  Vue.prototype.$nextTick = function (fn: Function) {}
  Vue.prototype._render = function (): VNode {}
}
```

`installRenderHelpers` 函数是给 Vue.prototype 上挂载一些运行时需要用到的工具方法 具体在 instalce/render-helpers 里，以及，挂载了 $nextTick 和 _render 函数。

##  `this._init && Vue.prototype._init`

这个时候我们再回过头来看看 this._init(options) 发生了什么

```js
Vue.prototype._init = function (options?: Object) {
  ......
  
    initLifecycle(vm)
    // 初始化事件，在这里 创建了 vm._events = Object.create(null)
    initEvents(vm)
    // 初始化 render
    initRender(vm)
    // 生命周期
    callHook(vm, 'beforeCreate')
    // provide / inject 的初始化？
    initInjections(vm) // resolve injections before data/props
    // 对 props, methods, data, computed, watch 的初始化
    initState(vm)
    // provide / inject ？ 跨组件传值？
    initProvide(vm) // resolve provide after data/props
    // created
    callHook(vm, 'created')
  ...... 
  
    if (vm.$options.el) {
      // web/runtime/index
      vm.$mount(vm.$options.el)
    }
}
```

首先也是一堆数据的初始化，一起 vue 的生命周期函数的执行。最后通过 vm.$mount 方法把我们的组件挂在到了 el 上。

## vm.$mount 是如何挂载的

在 src/platforms/web/entry-runtime-with-compiler.js 里往 vue 原型上挂载了 $mount 方法

```js
import Vue from './runtime/index'

const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (){
  .....
  return mount.call(this, el, hydrating)
}
export default Vue
```

这里将原有的 $mount 缓存起来，重写了 $mount ，然后再执行缓存的 $mount 。为什么需要这样做呢？因为`runtime`里是没有编译环节的，所以只需要进行更新虚拟`Dom`即可。而后者是需要编译`template`的，为了实现这一目的，需要重写`$mount`方法：将原有`$mount`缓存起来，然后在编译模板后再调用原有的`$mount`方法。

```js
// el 挂载的 dom, hydration 和 ssr 有关
Vue.prototype.$mount = function(el, hydration) {
  el = el && query(el)
  if (el === document.body || el === document.documentElement) {
    warn('...')
  }
  
  const options = this.$options
  // 当我们 new Vue({}) 没有加render的时候会进来
  if(!options.render) {
    // 拿 new Vue 时的 template 参数
    let template = options.template
    // 判断 tempalte 是字符串还是dom节点
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      }else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
      
    } else if (el) {
      // 没有template参数 有 el 的话拿 el.outerHTML
      template = getOuterHTML(el)
    }
    if (template) {
      // 这里执行 compileToFunctions 对 vue 模板进行编译，转换成 render 函数，添加到 options 上
       const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        // 意味着Vue在编译模板的时候，是否要对a标签的 href 属性值中的换行符或制表符做兼容处理。
        shouldDecodeNewlinesForHref,
        // options.delimiters & options.comments
        // delimiters 默认值：["{{", "}}"]，也就是说把 vue 的 {{data}}这种双大括号模板改成 delimiters 的值，比如：delimiters:['$$','$$'] {{data}} => $$data$$
        delimiters: options.delimiters,
        // comments 是否保留注释 默认false 当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }
  // 执行缓存的 $mount
	return mount.call(this, el, hydrating)
}
```

我们再去找到缓存的 $mount 的函数, 在 src/platforms/web/runtime/index.js 里面

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

判断了一下是否是浏览器环境，然后执行了 `mountComponent`函数

`mountComponent`在`core/instance/lifecycle`里，在 `mountComponent`实现vue 的挂载

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  // 执行 beforeMount 生命周期
  callHook(vm, 'beforeMount')
  
  let updateComponent
  // 更新组件，执行 vm._render() 和 vm._update()
  updateComponent = () => {
     vm._update(vm._render(), hydrating)
  }
  
  // 开启监听
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  
  // 最后挂载成功，执行 mounted 生命周期
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

`vm._render`和`vm._update`里又发生了什么呢？

## `vm._render`

之前在 `renderMixin` 函数里，就给 vue 原型上挂载了 `_render` 函数。看看里面发生了什么

```js
Vue.prototype._render = function (): VNode {
  const vm: Component = this
  const { render, _parentVnode } = vm.$options
  ...
  let vnode
  vnode = render.call(vm._renderProxy, vm.$createElement)
  ...
  return vnode
}
```

在`_render`方法里，执行了`vm.$options.render`方法，而这个方法就是在 `src/platforms/web/entry-runtime-with-compiler.js` 这个文件里的 `$mount` 方法里添加到 `options.render` 上的，还记得吗，我们回顾一下

```js
// src/platforms/web/entry-runtime-with-compiler.js
Vue.prototype.$mount = function (el) {
  const options = this.$options
  const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        // 意味着Vue在编译模板的时候，是否要对a标签的 href 属性值中的换行符或制表符做兼容处理。
        shouldDecodeNewlinesForHref,
        // options.delimiters & options.comments
        // delimiters 默认值：["{{", "}}"]，也就是说把 vue 的 {{data}}这种双大括号模板改成 delimiters 的值，比如：delimiters:['$$','$$'] {{data}} => $$data$$
        delimiters: options.delimiters,
        // comments 是否保留注释 默认false 当设为 true 时，将会保留且渲染模板中的 HTML 注释。默认行为是舍弃它们。
        comments: options.comments
      }, this)
  options.render = render
}
```

## `vm._update`

同样在文章的最开始我们有提到过在 `lifecycleMixin` 这个函数里面有在 `vue.prototype` 上挂载了 `_update` 方法。我们可以看一下他里面发生了什么

```js
 Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
   const vm: Component = this
   ...
   if (!prevVnode) {
     // initial render
     vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
   } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
   ...
 }
```

在 `_updata` 里核心就是调用 `vm.__patch__` 方法，赋值给了 `vm.$el` 他被调用的时机分两种，一种是首次渲染时，一种是数据更新时。我们来看看 `vm.__patch__` 

```js
// src/platforms/web/runtime/index.js
import { patch } from './patch'
Vue.prototype.__patch__ = inBrowser ? patch : noop
```

这里判断了一下是否是浏览器环境，我们看看 `inBrowser == ture` 时的 `path`

```js
// src/platforms/web/runtime/patch.js
import { createPatchFunction } from 'core/vdom/patch'
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

可以看到 `path` 函数是通过 `createPatchFunction` 返回的。这个方法也就赋值给了 `vm.__patch__`

## `vm.__path__`

```js
export function createPatchFunction (backend) {
  ...
  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    ...
    // 这里判断 oldVnode 是不是 undefined, 为 true 的话说明是第一次创建
    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      createElm(vnode, insertedVnodeQueue)
    }
  }
}
```

最后在 `patch` 里可以看到通过 `createElm` 创建了元素。

