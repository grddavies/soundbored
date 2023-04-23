import { Component } from 'solid-js';

type DirectoryProps = {
  name: string;
  open: boolean;
};

export const Directory: Component<DirectoryProps> = (props) => (
  <div>{props.name}</div>
);
