# `Freelancer's project agreement`

This contract is to help freelancers and project owner manage their project while giving the contractor the assurance of getting paid and project owner the assurance of quality

## Usage

### Getting started

#### Step 1: Prerequisites

Make sure you've installed [Node.js] ≥ 12 (we recommend use [nvm])

INSTALL `NEAR CLI` first like this: `npm i -g near-cli`

#### Step 2: Configure your NEAR CLI

```
near login
```

#### Interaction Script

1. clone this repo to a local folder
2. run `yarn install` to install dependencies
3. run `./scripts/1.dev-deploy.sh` to deploy on development
4. run `./scripts/2.create-project.sh` to create a freelancer project agrement
5. run `./scripts/3.latest_project.sh` to view the lastest 10 projects
6. run `./scripts/4.projects-created.sh` to view projeects created
7. run `./scripts/5.projects-assigned.sh` to view projects assign ed
8. run `./scripts/6.project-detail.sh` to see project detail information
9. run `./scripts/7.reassign-contractor.sh` to reassign a project to another contractor
9. run `./scripts/8.update-status.sh` update project status (e.g accept, cancel, review,
10. run `./scripts/9.cleanup.sh` to delete build


```sh
export BENEFICIARY=<your-account-here>   # this account receives contract account balance
export ACCOUNT=<your-account-here>   # this account will interact with contract
export CONTRACT=<contract-account>   # deployed contract account
```

[![asciicast](https://asciinema.org/a/409580.svg)](https://asciinema.org/a/409580)

## package Installation
To run this project locally you need to follow the next steps:

Step 1: Prerequisites
Make sure you've installed [Node.js] ≥ 12 (we recommend use [nvm])

Make sure you've installed yarn: npm install -g yarn

Install dependencies: yarn install

Create a test near account [NEAR test account]

Install the NEAR CLI globally: [near-cli] is a command line interface (CLI) for interacting with the NEAR blockchain

yarn install --global near-cli

Step 2: Configure your NEAR CLI
Configure your near-cli to authorize your test account recently created:

near login
Step 3: Build and make a smart contract development deploy
Build the NEAR library smart contract code and deploy the local development server: yarn build:release (see package.json for a full list of scripts you can run with yarn). This script return to you a provisional smart contract deployed (save it to use later). You can also follow the instructions on the folder scripts.

## The file system

```sh
├── README.md                          # this file
├── as-pect.config.js                  # configuration for as-pect (AssemblyScript unit testing)
├── asconfig.json                      # configuration for AssemblyScript compiler (supports multiple contracts)
├── package.json                       # NodeJS project manifest
├── scripts
│   ├── 1.dev-deploy.sh                # helper: build and deploy contracts
│   ├── 2.create-project.sh            # helper: to create a freelancer project agrement
│   ├── 3.latest_project.sh            # helper: to view the lastest 10 projects
│   ├── 4.projects-created.sh          # helper: to view projeects created
│   ├── 5.projects-assigned.sh         # helper: to view projects assign ed
│   ├── 6.project-detail.sh            # helper: to see project detail information
│   ├── 7.reassign-contractor.sh       # helper: to reassign a project to another contractor
│   ├── 8.update-status.sh             # helper: update project status (e.g accept, cancel, review, etc project)
│   ├── 9.cleanup.sh                   # helper: delete build and deploy artifacts
│   └── README.md                      # documentation for helper scripts
├── src
│   ├── as_types.d.ts                  # AssemblyScript headers for type hints
│   ├── simple                         # Contract 1: "Simple example"
│   │   ├── __tests__
│   │   │   ├── as-pect.d.ts           # as-pect unit testing headers for type hints
│   │   │   └── index.unit.spec.ts     # unit tests for contract 1
│   │   ├── asconfig.json              # configuration for AssemblyScript compiler (one per contract)
│   │   └── assembly
│   │       └── index.ts               # contract code for contract 1
│   ├── singleton                      # Contract 2: "Singleton-style example"
│   │   ├── __tests__
│   │   │   ├── as-pect.d.ts           # as-pect unit testing headers for type hints
│   │   │   └── index.unit.spec.ts     # unit tests for contract 2
│   │   ├── asconfig.json              # configuration for AssemblyScript compiler (one per contract)
│   │   └── assembly
│   │       └── index.ts               # contract code for contract 2
│   ├── tsconfig.json                  # Typescript configuration
│   └── utils.ts                       # common contract utility functions
└── yarn.lock                          # project manifest version lock
```
