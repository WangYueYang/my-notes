## performUnitOfWork 中的 beginWork 和 completeWork

performUnitOfWork 的工作内容分为两个部分，第一部分是通过 beginWork 生成当前 Fiber 的 children Fiber，并赋值给 workInProgress，在 workLoopSync 中不断的循环直到 workInProgress === null。第二部分当获取的 next === null 的时候，执行 completeUnitOfWork 开始 completeWork 阶段。

```js
// react-reconciler/src/ReactFiberWorkLoop.old.js
let workInProgress: Fiber | null = null;

function performUnitOfWork(unitOfWork: Fiber): void {
  
  const current = unitOfWork.alternate;
  let next;
  next = beginWork(current, unitOfWork, subtreeRenderLanes);
	if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    completeUnitOfWork(unitOfWork);
  } else {
    // workInProgress = workInProgress.child 
    // workLoopSync 里循环的时候会判断 workLoopSync !== null 知道这里的 next = null  workLoopSync 才会跳出循环
    workInProgress = next;
  }
}

function workLoopSync() {
  // Already timed out, so perform work without checking if we need to yield.
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}
```

## 执行 beginWork

performUnitOfWork 里的 beginWork 是一个过渡函数，里面调用了 originalBeginWork 方法，实际执行的是 ReactFiberBeginWork.old.js 里的 beginWork

beginWork 里通过判断 workInProgress.tag 判断当前 Fiber 是什么类型的，从而执行不同的逻辑。第一次渲染的时候，我们的 workInProgress Node 是我们最开始创建的 FIberRootNode.current ，他是一个类型为 `HostRoot` 的特殊 FiberNode，代表着整个Fiber tree 的根节点，充当最顶层组件的父级。所以第一遍 beginWork 的逻辑是 `workInProgress.tag === HostRoot` 然后执行 updateHostRoot 更新我们整个 Fiber tree 的根节点。

```js
// react-reconciler/src/ReactFiberBeginWork.old.js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
    switch (workInProgress.tag) {
      case HostRoot:
      	return updateHostRoot(current, workInProgress, renderLanes);
    }
  }
```

## updateHostRoot 创建子 Fiber 节点

updateHostRoot 的主要工作内容就是给根节点的 hostRoot Fiber 创建子 Fiber，赋值给 workInProgress.child 并且返回给 next。























