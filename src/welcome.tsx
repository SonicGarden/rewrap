import React from 'react';

export function Welcome({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

export function WelcomeWithChildren({ children }: { children: React.ReactNode }) {
  return <h1>Hello, {children}</h1>;
}
