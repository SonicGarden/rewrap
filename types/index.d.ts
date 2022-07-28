import React from 'react';
declare type Component = React.FunctionComponent<any> | React.ComponentClass<any>;
export declare const rewrap: (name: string, component: Component, hasChildren?: boolean) => void;
export declare const asyncRewrap: (name: string, component: () => Promise<Component>, hasChildren?: boolean) => void;
export {};
