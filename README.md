## ic3 Dashboards Integration (iFrame)

A working example for embedding an icCube Dashboards instance via an iFrame.

This example is showing how to use the icCube Dashboards API to drive the icCube Dashboards instance from a host
Javascript/Typescript application.

### Getting Started

Clone that Git repository that is proposing a common Javascript/Typescript project using Webpack.

Use `npm` to install the dependencies:

    npm install

A JetBrains IntelliJ project is available for a quick start.

The `package.json` file is containing common scripts:

    start : start a Webpack dev. server listening @4100 

### Debug

This example starts a host application @ `localhost:4100` (see `webpack.dev.js` file) that is embedding and driving a
bunch of dashboards available @ `livedemo.icCube.com`. See the self explained code for more details.

### Documentation

See this [page](https://github.com/iccube-software/ic3-reporting-api/blob/main/doc/embed/Overview.md)
for a detailed documentation of the API.

_
