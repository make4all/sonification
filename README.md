# sonification

Repository for sonification

## build instructions

We use node LTS 14.17.5. We recommend using [NVM](https://github.com/nvm-sh/nvm) to use multiple versions of node if you use a different version for other projects. The code goes into src/lib.ts.

### yarn install

Install all the necessary dependencies

### yarn build

Compiles and bundles the library into the dist folder.

### yarn test

Runs the mocha test suite

### yarn watch

Start a compile watch of the library build and tests for iterative development.

## bundling

Run yarn bundle to generate the bundles for the npm package.

_Please make sure yarn build works before you commit until we setup CI/CD to ensure this._
