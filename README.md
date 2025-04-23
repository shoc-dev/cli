# The Shoc Platform CLI

![Release Workflow](https://github.com/shoc-dev/cli/actions/workflows/release.yml/badge.svg) ![NPM Version](https://img.shields.io/npm/v/@shoc/shoc)

The Shoc Platform CLI is a command-line interface for interacting with the [Shoc Platform](https://shoc.dev). It enables users to build and run jobs, monitor their execution, view logs, and manage various platform components such as clusters, secrets, registries, and more. Designed for both developers and operators, Shoc Platform CLI streamlines workflows and provides a powerful way to automate and control Shoc Platform resources directly from the terminal.

## Introduction

The Shoc Platform CLI is a command-line tool for interacting with the [Shoc Platform](https://shoc.dev). It empowers developers and operators to manage platform resources efficiently from the terminal.

### Key Features

- Build and run jobs on the Shoc Platform  
- Monitor execution and stream job logs  
- Manage clusters and compute resources  
- Handle secrets and environment configurations  
- Configure and access container registries  

## Installation

### Prerequisites

- **Node.js**: Ensure that Node.js is installed on your system. You can download it from the [official website](https://nodejs.org/).
- **(Linux only) libsecret**: For Linux systems, make sure `libsecret` is installed. This library is required for securely storing credentials. Install it using your system's package manager:

### Install via npm

To install Shoc Platform CLI globally using npm, run the following command:

```bash
npm install -g @shoc/shoc
```

This command will make the `shoc` command available globally on your system. Once installed, you can verify the installation by running:

```bash
shoc --help
```

This will display the help information, confirming that the installation was successful.
