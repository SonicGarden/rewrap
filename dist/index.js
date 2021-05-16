import React from 'react';
import ReactDOM from 'react-dom';
const fragmentToReactElement = (fragment) => {
    // SEE: https://filipmolcik.com/react-children-vanilla-html-element/
    return React.createElement('div', {
        ref: (ref) => ref === null || ref === void 0 ? void 0 : ref.append(fragment.cloneNode(true)),
    });
};
const getChildren = (el) => {
    if (el.childNodes.length === 0)
        return;
    const fragment = document.createDocumentFragment();
    while (el.childNodes.length > 0) {
        fragment.append(el.childNodes[0]);
    }
    return fragmentToReactElement(fragment);
};
const getProps = (element) => {
    const json = element.dataset.props;
    if (!json)
        return {};
    return JSON.parse(json);
};
const render = (root, component, props) => {
    const elem = React.createElement(component, props);
    ReactDOM.render(elem, root);
};
export const rewrap = (name, component, hasChildren = false) => {
    class RewrapElement extends HTMLElement {
        connectedCallback() {
            const props = getProps(this);
            if (!hasChildren) {
                return render(this, component, props);
            }
            // NOTE: Wait for children to render
            window.setTimeout(() => {
                render(this, component, {
                    ...props,
                    children: getChildren(this),
                });
            }, 0);
        }
        disconnectedCallback() {
            ReactDOM.unmountComponentAtNode(this);
        }
    }
    window.customElements.define(name, RewrapElement);
};
