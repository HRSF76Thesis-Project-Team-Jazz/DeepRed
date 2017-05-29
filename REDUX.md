# Redux overview

- One **Store** with many properties
- One **Provider Component**
- **Smart Components**: top level "pages"/components
  - Can pull properties from the store
- **Dumb Components**: receives data as props
- Components dispatch **actions** (like flux)
- **Reducers**: modify a piece of data off of the store in an _immutable way_

## Three Principles of Redux

1. Single source of truth
  - State of the whole app stored in a single store
2. State is read-only
  - Only way to change the state is to emit an **action**, an object describing what happened
3. Changes are made with pure functions

## State Tree
- All changes in state are explicit; all are tracked and stored in the **State Tree**
- Read only; changes are made by **dispatching actions**
- _Review_: **pure functions** - return value depends only on its arguments, no side effects, predictable, do not modify arguments passed in
- Functions in redux _must be pure functions_
- Redux: previous state + dispatching action = _next state_.  This function is the **reducer**:

```js
function counter(state, action) {

  if (typeof state === 'undefined') return 0;
  // if initial passed in state is undefined,
  // return the expected initial state

  if (stateChange) {
    return {new state};
  } else {
    return state;
  }
```

**ES6 refactor + switch/case**

```js
const counter = (state = 0, action) => {
  switch (action.tyupe) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
    // Return current state if action unknown
  }
}
```

### Immutability in Redux/Javascript
- **Objects**: use `Object.assign({}, /** new properties **/)`
- **Arrays**: use `concat` | `filter` | `map` | `reduce` which all return a new array
