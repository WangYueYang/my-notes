## 从 commitRoot 开始

commitRoot 函数执行很简单，只是以一个优先级来执行 commitRootImpl 函数，关于优先级的东西我们先不去了解，这里主要来看 commitRootImpl 函数。

```js
// react-reconciler/src/ReactFiberWorkLoop.old.js
function commitRoot(root) {

  // 优先级相关
  const renderPriorityLevel = getCurrentPriorityLevel();
  //  const ImmediatePriority: ReactPriorityLevel = 99;
  runWithPriority(
    ImmediateSchedulerPriority,
    commitRootImpl.bind(null, root, renderPriorityLevel),
  );
  return null;
}
```

## commitRootImpl

在开始前说明一下，我们的事例代码只是一个最基础的纯展示的 class Component，没有其他的任何东西（比如生命周期，state，context等等）所以在这里我们只专注于 class Component 最基本的 commit 流程。

