import React from 'react'
import ReactDOM from 'react-dom'

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
    if (el.childNodes[0].nodeName !== 'TEMPLATE') {
      fragment.append(el.childNodes[0])
      continue
    }
    const div = document.createElement('div')
    div.innerHTML = (el.childNodes[0] as HTMLTemplateElement).innerHTML
    fragment.append(div)
    el.childNodes[0].remove()
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const render = (root: HTMLElement, component: Component, props: any) => {
  const elem = React.createElement(component, props)
  ReactDOM.render(elem, root)
}

const defineRewrapComponent = (name: string, connectedCallback: (el: HTMLElement) => void): void => {
  class RewrapElement extends HTMLElement {
    connectedCallback() {
      connectedCallback(this)
    }

    disconnectedCallback() {
      ReactDOM.unmountComponentAtNode(this)
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
    window.setTimeout(() => {
      render(el, component, {
        ...props,
        children: getChildren(el),
      })
    }, 0)
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
