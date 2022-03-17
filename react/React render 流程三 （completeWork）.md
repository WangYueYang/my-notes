React 在 beginWork 的处理中会不断的创建 DOM 节点对应的 FiberNode，通过 return 和 children 连接起来，当 beginWork 执行到纯文本节点的时候就不会创建新的 FIber 了，而是返回 null，开始 completeWork 部分。

这个时候的 workInProgress 是整个 Fiber tree 最后一个的 FiberNode，把他传给 completeUnitOfWork 函数。

## completeWork

和 beginWork 的做法相同，completeUnitFoWork 里也是判断 completedWork !== null 来循环执行 completeWork 然后对 completedWork 做处理。beginWork 的顺序是从上到下生成每个 DOM 节点对应的 FiberNode，并将他们关联起来形成 Fiber tree 的过程。completeWork 则是从下到上，根据当前 completedWork（workInProgress） 对应的 FiberNode 生成真实 DOM。

所以 compelteWork 和 beginWork 一样，也是根据 workInProgress.tag 的类型来做不同的处理。（我们这次 completeWork 流程的 workInProgress 是 `<div>>React Class Component</div>` 对应的 FiberNode，他的 tag 就是 HostComponent）。

## HostComponent 的 completeWork

当 workInProgress.tag == HostComponent 时，会执行 careateInstance 函数，通过当前 workInProgress.type，在 createElement 里执行 document.createElement 创建对应的 DOM 节点。这个时候创建的 DOM 节点时没有内容的，

```js
// react-reconciler/src/ReactFiberCompleteWork.old.js
function completeWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
    const newProps = workInProgress.pendingProps;
    switch (workInProgress.tag) {
        case HostComponent: {
          // 获取到 React 应用的根容器 <div id="app"></div>
          const rootContainerInstance = getRootHostContainer();
          const type = workInProgress.type;
          ...
          const instance = createInstance(
            type,
            newProps,
            rootContainerInstance,
            currentHostContext,
            workInProgress,
          );
        }
    }
  }

// react-dom/src/client/ReactDOMHostConfig.js
export function createInstance(
  type: string,
  props: Props,
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Object,
): Instance {
  ...
  
  const domElement: Instance = createElement(
    type,
    props,
    rootContainerInstance,
    parentNamespace,
  );

  return domElement;
}

// react-dom/src/client/ReactDOMComponent.js
// 里面也对 type === 'script' 的情况有做处理
export function createElement(
  type: string,
  props: Object,
  rootContainerElement: Element | Document,
  parentNamespace: string,
): Element {
  // 返回的是 return 判断 rootContainerElement === DOCUMENT_NODE, 返回 document或者是 Node.ownerDocument 这里返回的是 rootContainerElement.ownerDocument 
  // 所以这里得到的是 当前 rootContainerElement 节点的顶层的 document 对象
  const ownerDocument: Document = getOwnerDocumentFromRootContainer(
    rootContainerElement,
  );
  let domElement: Element;
 	...
  domElement = ownerDocument.createElement(type);
  ...
  return domElement;
}
```

