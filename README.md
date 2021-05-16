# rewrap

Wrapping React components with custom elements.

## Installation

```
yarn add @sonicgarden/rewrap
```

## Usage

```jsx
import React from 'react'
import { rewrap } from '@sonicgarden/rewrap'

const MyComponent = ({ content }) => <p>{content}</p>
const MyComponentWithChildren = ({ children }) => <p>{children}</p>

rewrap('my-component', MyComponent)
rewrap('my-component-with-children', MyComponentWithChildren, true)
```

You can then use this element in an HTML file:

```html
<my-component data-props="{\"content\":\"Hello, world!\"}"></my-component>

<my-component-with-children>
  <div class="alert">Hello, world!</div>
</my-component-with-children>
```

## Limitation

- Attribute changes
- Events trigger
- ShadowDOM
