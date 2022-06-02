## ic3 Dashboards Integration

A working example for embedding an icCube Dashboards instance via an iFrame or a DIV.

This example is showing how to use the icCube Dashboards API to drive the icCube Dashboards instance from a host
Javascript/Typescript application:

- open standalone dashboards,
- open a dashboard application (e.g., global filter) and dashboards,
- open two dashboards that communicate to each other via events.

### Getting Started

Clone that Git repository that is proposing a common Javascript/Typescript project using Webpack.

Use `npm` to install the dependencies:

    npm install

A JetBrains IntelliJ project is available for a quick start.

The `package.json` file is containing common scripts:

    start : start a Webpack dev. server listening @4100 

### Develop

This example starts a host application @ `localhost:4100` (see `webpack.dev.js` file) that is embedding and driving a
bunch of dashboards available @ `livedemo.icCube.com` via an HTTP proxy setup in `webpack.dev.js`.

See the self explained code for more details about using the public API.

### Documentation

See this [page](https://github.com/ic3-software/ic3-reporting-api/blob/main/doc/embed/Overview.md)
for a detailed documentation of the API.

_
