- React16 更新优先级。高优先级 CPU 任务会打断低优先级 IO 任务
- React17 对优先级进行了扩展，从指定一个优先级到指定一个连续的优先级区间（要仔细定义这个区间）

## React 17

Concurrent mode suspense

 ## React 15 的架构

- Reconciler （协调器） —— 负责找出变化的组件
- Renderer （渲染器）—— 负责将变化的组件渲染到页面上

## React 16 的架构

在原先 React 15 的架构上新加的 `Scheduler` 调度器——调度任务的优先级，高优任务优先进入 `Reconciler`

在 React 16 的 `Reconciler` 中，更新的工作从递归变成了可以中断的循环，每次循环都会调用 `shouldYield` 判断当前是否有剩余时间

```js
// packages/react-reconciler/src/ReactFiberWorkLoop.new.js
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  // React 16 中的 Reconciler 通过 shouldYield 判断当前浏览器更新是否有剩余时间
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

## 关于FIber

FIberRootNode

- rootFiber (current Fiber)
- rootFiber (workInProgress Fiber)

## JSX

本质其实是 `React.createElement`

``` js
// packages/react/src/ReactElement.js
export function createElement(type, config, children) {
    let propName;

  // Reserved names are extracted
  const props = {};

  let key = null;
  let ref = null;
  let self = null;
  let source = null;
  ......
  
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props,
  );
}

const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    // 用来判断是不是 React Element
    $$typeof: REACT_ELEMENT_TYPE,  // symbolFor('react.element')

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };
    return element;
};
```

最终会返回一个包含组件数据的对象

