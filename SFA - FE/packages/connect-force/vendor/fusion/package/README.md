⚠️ **Important Notice: This Code is Closed Source** ⚠️

The content of this repository is proprietary and intended solely for internal use by `ICP Technologies.` Do not share, distribute, or make this code available to the public or unauthorized individuals. If you have access to this repository, please respect the confidentiality of the codebase.

# React Fusion 

Welcome to the React Fusion code repository developed by ICP Technologies. This repository is built using Rollup, Babel, Reactjs, Mui, Storybook and is equipped with tools like Husky, Conventional Commits, Prettier, and ESLint to ensure consistent code quality and streamlined development processes.

<p align="center">
  <a href="https://icptechno.com/" target="blank"><img src="https://icptechno.com/assets/img/home/ICP-Logo.png" width="200" alt="ICP Techno Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Installation

#### Step 1: Install vsts-npm-auth helper. 
```
npm install -g vsts-npm-auth --registry https://registry.npmjs.com --always-auth false
```

#### Step 2: Add a **.npmrc** to your project, in the same directory as your package.json

```
@icp:registry=https://pkgs.dev.azure.com/ICPTechnoDevOps/13cbe4d5-8107-4266-9c4a-884f12be8c10/_packaging/Default%40Prerelease/npm/registry/
registry=https://registry.npmjs.org/
always-auth=true
```

#### Step 3: Install Peer Dependencies

```
npm install --save @emotion/react@^11.11.1 @emotion/styled@^11.11.0 @mui/icons-material@^5.14.7 @mui/material@^5.14.7 notistack@^3.0.1 nprogress@^0.2.0 react@^18.2.0 react-dom@^18.2.0 react-lazy-load-image-component@^1.6.0
```

#### Step 4: Install the React-Fusion

```
npm install @icp/react-fusion
```

#### Step 5: Install the React-Crystals

```
npm install @icp/react-crystals
```

#### Step 6: Add pipeline authentication

```
- task: npmAuthenticate@0
  inputs:
    workingFile: '.npmrc'
```

#### Step 7: Add the build service of the pipeline such that it has the access role of Feed And Upstream Reader(Collaborator)

### Setup guide for React-Fusion Charts
> The React Fusion charts are currently supports only for Nextjs Projects.

#### Step 1: Add bellow compilerOptions to your tsconfig.json
```
{
  "compilerOptions": {
    <!-- other configurations -->

    "typeRoots": ["node_modules/react-fusion/charts"]
  }
}
```

Step 2: Import Charts to the your component.
```
<!-- 

React-Fusion Charts are client side components. currently this components are not supporting
SSR Components.

 -->

const DynamicQualitativeChart = dynamic(async () => (await import('react-fusion/dist/charts')).QualitativeChart, {
  loading: () => <p>Loading...</p>,
  ssr: false
})

export default function Component() {
  return (
    <DynamicQualitativeChart
      labels={["Team A", "Team B", "Team C", "Team D"]}
      legend
      series={[44, 55, 13, 43]}
      showLabel
      variant="donut"
      width={400}
    />
  );
}

```

## Contributing

Contributions are welcome! We follow a trunk-based development workflow to ensure a streamlined and collaborative approach to development. To contribute to the project, follow these steps:

1. Clone the repository.
2. Create a new branch for your feature/bugfix: `git checkout -b feature/my-feature`.
3. Make your changes and commit them following the [Conventional Commits](https://www.conventionalcommits.org/) style.
4. Push your changes to your fork: `git push origin feature/my-feature`.
5. Open a pull request against the `main` branch of this repository.

Please ensure your code passes the linting and formatting checks before submitting the pull request.

### Trunk-Based Development

We follow the trunk-based development model for managing our codebase. In this approach, the `main` branch is considered the mainline of development. Feature branches are short-lived and are used to develop and test a specific feature or fix. Once a feature is complete and tested, it's merged back into the `main` branch through a pull request.

By using trunk-based development, we aim to minimize long-lived branches, encourage continuous integration, and maintain a healthy pace of development. This approach also allows us to release new features and fixes more frequently.

If you're unsure about which branch to base your changes on, always use the latest version of the `main` branch as your starting point.

### Code Review

All code contributions undergo a thorough code review process. Your pull request will be reviewed by other team members, who will provide feedback and suggestions to ensure the code's quality, consistency, and adherence to best practices.

Thank you for your contributions!
### License
This project is licensed under the [ICP Technologies Closed Source License] - see the LICENSE file for details.

