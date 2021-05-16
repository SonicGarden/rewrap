import React from 'react'
import ReactDOM from 'react-dom'

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
    fragment.append(el.childNodes[0])
  }
  return fragmentToReactElement(fragment)
}

const getProps = (element: HTMLElement): any => {
  const json = element.dataset.props
  if (!json) return {} as any

  return JSON.parse(json)
}

const render = (root: HTMLElement, component: Component, props: any) => {
  const elem = React.createElement(component, props)
  ReactDOM.render(elem, root)
}

export const rewrap = (
  name: string,
  component: Component,
  hasChildren = false
): void => {
  class RewrapElement extends HTMLElement {
    connectedCallback() {
      const props = getProps(this)

      if (!hasChildren) {
        return render(this, component, props)
      }

      // NOTE: Wait for children to render
      window.setTimeout(() => {
        render(this, component, {
          ...props,
          children: getChildren(this),
        })
      }, 0)
    }

    disconnectedCallback() {
      ReactDOM.unmountComponentAtNode(this)
    }
  }

  window.customElements.define(name, RewrapElement)
}
