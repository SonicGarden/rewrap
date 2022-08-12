import React from 'react'
import { createRoot, Root } from 'react-dom/client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Component = React.FunctionComponent<any> | React.ComponentClass<any>

const fragmentToReactElement = (fragment: DocumentFragment) => {
  // SEE: https://filipmolcik.com/react-children-vanilla-html-element/
  return React.createElement('div', {
    ref: (ref) => ref?.append(fragment.cloneNode(true)),
  })
}

const getChildren = (el: HTMLElement) => {
  if (el.childNodes.length === 0) return

  const fragment = document.createDocumentFragment()
  while (el.childNodes.length > 0) {
    if (el.childNodes[0].nodeName === 'TEMPLATE') {
      fragment.append((el.childNodes[0] as HTMLTemplateElement).content)
      el.childNodes[0].remove()
    } else {
      fragment.append(el.childNodes[0])
    }
  }
  return fragmentToReactElement(fragment)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getProps = (element: HTMLElement): any => {
  const json = element.dataset.props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!json) return {} as any

  return JSON.parse(json)
}

const roots = new WeakMap<HTMLElement,Root>()
const childNodes = new WeakMap<HTMLElement,Node[]>()

const saveChildren = (container: HTMLElement) => {
  childNodes.set(container, Array.from(container.childNodes).map(n => n.cloneNode(true)))
}

const restoreChildren = (container: HTMLElement) => {
  for (const node of childNodes.get(container) || []) {
    container.append(node)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const render = (container: HTMLElement, component: Component, props: any) => {
  const elem = React.createElement(component, props)
  const root = createRoot(container)
  root.render(elem)
  roots.set(container, root)
}

const defineRewrapComponent = (name: string, connectedCallback: (el: HTMLElement) => void): void => {
  class RewrapElement extends HTMLElement {
    connectedCallback() {
      connectedCallback(this)
    }

    disconnectedCallback() {
      roots.get(this)?.unmount()
      restoreChildren(this)
    }
  }

  window.customElements.define(name, RewrapElement)
}

export const rewrap = (name: string, component: Component, hasChildren = false): void => {
  defineRewrapComponent(name, (el) => {
    const props = getProps(el)

    if (!hasChildren) {
      return render(el, component, props)
    }

    // NOTE: Wait for children to render
    window.requestAnimationFrame(() => {
      saveChildren(el)
      render(el, component, {
        ...props,
        children: getChildren(el),
      })
    })
  })
}

export const asyncRewrap = (name: string, component: () => Promise<Component>, hasChildren = false): void => {
  defineRewrapComponent(name, async (el) => {
    const props = getProps(el)
    const resolvedComponent = await component()

    render(el, resolvedComponent, {
      ...props,
      ...(hasChildren ? { children: getChildren(el) } : {}),
    })
  })
}
