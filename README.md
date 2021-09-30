# rewrap

Wrapping React components with custom elements.

## Installation

```
yarn add @sonicgarden/rewrap
```

## Usage

```jsx
import React from 'react'
import { rewrap, asyncRewrap } from '@sonicgarden/rewrap'

const MyComponent = ({ content }) => <p>{content}</p>
const MyComponentWithChildren = ({ children }) => <p>{children}</p>

rewrap('my-component', MyComponent)
rewrap('my-component-with-children', MyComponentWithChildren, true)
asyncRewrap('async-component', async () => (await import('components/xxx')).default)
```

You can then use this element in an HTML file:

```html
<my-component data-props="{\"content\":\"Hello, world!\"}"></my-component>
<async-component data-props="{\"content\":\"Hello, world!\"}"></async-component>

<my-component-with-children>
  <div class="alert">Hello, world!</div>
</my-component-with-children>

<!-- OR -->
<my-component-with-children>
  <template>
    <div class="alert">Hello, world!</div>
  </template>
</my-component-with-children>
```

## Limitation

- Attribute changes
- Events trigger
- ShadowDOM
