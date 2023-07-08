<div align="center">
  <h3>A node editor webapp for building linear algebra intuition in three dimensions</h3>

  <img src="./docs/preview-light-mode.png#gh-light-mode-only">
  <img src="./docs/preview-dark-mode.png#gh-dark-mode-only">
</div>

The intention of linalg.dev is to provide the user with mostly elementary
mathematical tools and letting them use these to form vectors, planes, and
matrices. Its purpose is to be a tool for students studying linear algebra to
get an intuition of the underlying mathematics behind the concepts in linear
algebra. By letting the user play with the vector space in three dimensions, the
user may be able to get a better understanding of the concepts. It is also a lot
more engaging to play with an actual three-dimensional environment than having
to draw it out in mere two dimensions. It can also be used by linear algebra
educators, because it is easy to download environments and hand them in as part
of assignments.

## Usage

linalg.dev consists of two parts; the node editor and the three dimensional
space that contains the vectors and planes defined by the node editor. The
purpose of this tool is to build linear algebra intuition for what the various
operations in linear algebra do and represent. By building the concepts with
only elementary mathematical operators in the form of nodes, students will
learn how the concepts work "behind the scenes" and relate it to whatever is
happening in the vector space. It is also faster to iterate in linalg.dev than
it is to redraw a two-dimensional space with pen and paper while studying
certain concepts. Additionally, it can be used by educators for assignments,
because environments can be downloaded and uploaded, so it is easy to hand in
environments as part of an assignment.

Many nodes are defined in linalg.dev and can be connected with edges in the node
editor. For example, the output of a multiplication node can be connected to the
x-axis of a vector. Relations between nodes can be defined in this way and is
what makes the tool powerful.

In the space, all vector and plane nodes are shown in a three-dimensional
vector space. As the components of the vectors and planes change, they animate
to their new position. Furthermore, it is possible to apply matrix
transformations to the vector space. These transformations are animated as well.

An in depth manual can be found in [the manual](./docs/manual.pdf).

## Contributing

Contributions are always welcome. Please open an issue with an example
environment if you encounter a bug. Also feel free to open an issue with feature
requests, such as ideas for new nodes.

## Credits

The major open source projects that this project relies on are

-   [THREE.js](https://github.com/mrdoob/three.js/) — The three-dimensional vector space.
-   [React three fiber](https://github.com/pmndrs/react-three-fiber) — Using THREE.js in React.
-   [React flow](https://github.com/wbkd/react-flow) — The node-based editor.
-   [Radix UI](https://github.com/radix-ui) — The accessible user interface components and icons in React.

## License

MIT License
