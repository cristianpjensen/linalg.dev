<div align="center">
  <h3>Linear algebra node environment</h3>
  <p>Submission for the <a href="https://www.youtube.com/watch?v=hZuYICAEN9Y">Summer of Math Exposition 2022</a></p>

  <img src="./docs/preview-light-mode.png#gh-light-mode-only">
  <img src="./docs/preview-dark-mode.png#gh-dark-mode-only">
</div>

The idea behind this project is to provide the user with mostly elementary mathematical tools and letting them use these to form vectors. Its purpose is to be a tool for students studying linear algebra to get an intuition of the underlying mathematics behind the concepts in linear algebra. By recreating the concepts, the user will be able to remember them better. By letting the user play with the vector space in three dimensions, the user may be able to get a better understanding of the concepts. It is also a lot more fun to play with an actual three-dimensional environment than having to draw it out in mere two dimensions.

## Usage

Nodes can be added to the environment by selecting one of the node types in the toolbar and clicking anywhere in the environment. The nodes can be connected by dragging from one handle to another — on mobile, you just have to click on one and then the next for a connection between the two. Vectors and planes will be shown in the vector space on the right. You can click on a vector there to show its node in the environment and vice versa. Lastly, you can also define matrices and use these to transform the entire vector space.

You are also provided with two examples — these can be found in the info tab in the toolbar. One example is of the [singular value decomposition](https://en.wikipedia.org/wiki/Singular_value_decomposition). The matrix can be changed dynamically and the decomposed matrices will also change. How the matrix gets decomposed can be seen by looking at the intermediary nodes. This is useful, because as you transform the space with the decomposed matrices, it highlights the rotation → scale → rotation nicely. The other example is of [principal component analysis](https://en.wikipedia.org/wiki/Principal_component_analysis). In this example, 6 vectors are used as three-dimensional data points and can be changed dynamically. These 6 data points get turned into their [covariance matrix](https://en.wikipedia.org/wiki/Covariance_matrix). The eigenvectors of this matrix are the principal components of the data points. The user can transform the space with these eigenvectors as its basis to align the axes with the principal components. Then, the space can be transformed to one or two dimensions.

Environments can be downloaded and uploaded. This is useful for sharing environments with others. The download and upload buttons in the toolbar are used for this. They are pretty self-explanatory.

## Contributing

Contributions are always welcome. Please open an issue with an example environment if you encounter a bug. Also feel free to open an issue with feature requests, like ideas for new nodes.

## Credits

The major open source projects that this project relies on are

-   [THREE.js](https://github.com/mrdoob/three.js/) — The three-dimensional vector space.
-   [React three fiber](https://github.com/pmndrs/react-three-fiber) — Using THREE.js in React.
-   [React flow](https://github.com/wbkd/react-flow) — The node-based editor.
-   [Radix UI](https://github.com/radix-ui) — The accessible user interface components and icons in React.

## License

MIT License

Do whatever you want.
