## Effect 链表

在 completeWork 阶段中的 completeWork 函数执行完成后，会把当前 workInProgress 的 firstEffect 添加到 returnFiber.laseEffect.nextEffect 上，形成一条 Effect 链表，这条链表具体是干什么的，我们这里先不用关注，后面在 Hooks 部分再去仔细了解，我们只需要知道以下两点：

1. 当 workInProgress 是 <App/> 的 Fiber 的时候，会把 <App/> 的 FiberNode 添加到 returnFiber.lastEffect.nextEffect 上
2. commit 阶段里几个重要函数内部的循环判断条件就是是否有 nextEffect

```js
// react-reconciler/src/ReactFiberWorkLoop.old.js/completeUnitOfWork
// flags > PerformedWork代表当前这个fiber节点是有副作用的，需要将这个fiber节点加入到父级fiber的effectList链表中。
if (flags > PerformedWork) {
  if (returnFiber.lastEffect !== null) {
    returnFiber.lastEffect.nextEffect = completedWork;
  } else {
    returnFiber.firstEffect = completedWork;
  }

  returnFiber.lastEffect = completedWork;
}

```



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

在开始前说明一下，我们的示例代码只是一个最基础的纯展示的 class Component，没有其他的任何东西（比如生命周期，state，context等等）所以在这里我们只专注于 class Component 最基本的 commit 流程。

在 commitRootImpl 函数里，除去其他的一些操作外，有一下几个函数是 commit 阶段的核心：

1. commitBeforeMutationEffects ，befor mutation 阶段（执行 DOM 操作前）
2. commitMutationEffects ， mutation 阶段 （执行 DOM 操作后）
3. commitLayoutEffects ， layout 阶段 （执行 DOM 操作后）

整个 commit 阶段，也可以大致分为这三部分。而在 befor mutation 开始前，看看 commitRootImpl 做了哪些事情。

```js
 do {
    // 触发useEffect回调与其他同步任务。由于这些任务可能触发新的渲染，所以这里要一直遍历执行直到没有任务
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  // finishedWork 当前 react 应用的 Fiber
  const finishedWork = root.finishedWork;
  const lanes = root.finishedLanes;

  root.finishedWork = null;
  root.finishedLanes = NoLanes;
	// 重置Scheduler绑定的回调函数
  root.callbackNode = null;
	
	let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  markRootFinished(root, remainingLanes);

	// 重置全局变量
	if (root === workInProgressRoot) {
    // We can reset these now that they are finished.
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } else {
  }

	let firstEffect;
	// 如果当前 Fiber 有副作用的话会将 finishedWork 添加到他自己的 Effect 链表的最后面，形成闭环
  if (finishedWork.flags > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect;
  }
```

## befor muitation

commitBeforeMutationEffects 里根据 Effect 链表循环，主要做了一下几件事：

1. focus blur 相关          beforeActiveInstanceBlur();
2. 执行  commitBeforeMutationEffectOnFiber 函数
3. 调度 useEffect

我们这里只关注第二步  commitBeforeMutationEffectOnFiber, commitBeforeMutationEffectOnFiber 函数是 commitBeforeMutationLifeCycles 函数的别名，里面做的事情很简单，如果是  ClassComponent 执行 getSnapshotBeforeUpdate 如果是 HostRoot，调用 clearContainer 方法将 `container.textContent = ''`  如果是其他类型的话就直接 return

```js
// react-reconciler/src/ReactFiberWorkLoop.old.js
let nextEffect: Fiber | null = null;
nextEffect = firstEffect;
do {
      // 主要来看 commitBeforeMutationEffects 
    if (__DEV__) {
      invokeGuardedCallback(null, commitBeforeMutationEffects, null);
    } 
} while (nextEffect !== null);

function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;
		...
    const flags = nextEffect.flags;
    if ((flags & Snapshot) !== NoFlags) {
      setCurrentDebugFiberInDEV(nextEffect);
      // 调用getSnapshotBeforeUpdate
      commitBeforeMutationEffectOnFiber(current, nextEffect);

      resetCurrentDebugFiberInDEV();
    }
		...
    nextEffect = nextEffect.nextEffect;
  }
}

// react-reconciler/src/ReactFiberCommitWork.old.js
function commitBeforeMutationLifeCycles(
  current: Fiber | null,
  finishedWork: Fiber,
): void {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case ForwardRef:
    case SimpleMemoComponent:
    case Block: {
      return;
    }
    case ClassComponent: {
      if (finishedWork.flags & Snapshot) {
        if (current !== null) {
          const prevProps = current.memoizedProps;
          const prevState = current.memoizedState;
          const instance = finishedWork.stateNode;
          const snapshot = instance.getSnapshotBeforeUpdate(
            finishedWork.elementType === finishedWork.type
              ? prevProps
              : resolveDefaultProps(finishedWork.type, prevProps),
            prevState,
          );
        }
      }
      return;
    }
    case HostRoot: {
      if (supportsMutation) {
        if (finishedWork.flags & Snapshot) {
          const root = finishedWork.stateNode;
          clearContainer(root.containerInfo);
        }
      }
      return;
    }
    case HostComponent:
    case HostText:
    case HostPortal:
    case IncompleteClassComponent:
      // Nothing to do for these component types
      return;
  }

}
```

## mutation

commitMutationEffects 同样会遍历EffectList 然后根据 nextEffect.tags 分别做： Placement | PlacementAndUpdate | Update | Deletion 操作。我们这里只看 Placement 操作。case Placement 里执行了 commitPlacement 函数。

```js

// 因为 nextEffect 是全局变量，在 befor mutation 里对他做了修改，这里再重新赋值回来
nextEffect = firstEffect;
do {
  if (__DEV__) {
    invokeGuardedCallback(
      null,
      commitMutationEffects,
      null,
      root,
      renderPriorityLevel
    );
  }
} while (nextEffect !== null);

function commitMutationEffects(
  root: FiberRoot,
  renderPriorityLevel: ReactPriorityLevel,
) {
    while (nextEffect !== null) {
      const primaryFlags = flags & (Placement | Update | Deletion | Hydrating);
      switch (primaryFlags) {
        case Placement: {
          commitPlacement(nextEffect);
          nextEffect.flgs &= ~Placement;
          break;
        }
      }
    }
  }
```

在 commitPlacement 里声明了 parentFiber 获取当前 <App/> Fiber 的 returnFiber，和 siblingFiber, 然后根据 parentFiber 是否是 HostRoot 执行 insertOrAppendPlacementNodeIntoContainer。

```js
function commitPlacement(finishedWork: Fiber): void {
  const parentFiber = getHostParentFiber(finishedWork);

  let parent;
  let isContainer;
  const parentStateNode = parentFiber.stateNode;	
	switch (parentFiber.tag) {
      case HostRoot:
        parent = parentStateNode.containerInfo;
        isContainer = true;
        break;
  }

	// 获取 finishedWork 的 siblingFiber
	const before = getHostSibling(finishedWork);

  if (isContainer) {
    insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent);
  } else {
    insertOrAppendPlacementNode(finishedWork, before, parent);
  }
}
```

























