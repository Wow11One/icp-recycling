# Tokenmania!

![Tokenmania](https://icp.ninja/examples/_attachments/tokenmania.jpg)

Tokenmania is a simplified token minting application. When the application is ran, it will automatically mint tokens based on the backend smart contract's hardcoded configuration values for things such as token name, token symbol, and total supply.

> [!CAUTION]
> This sample application is not production-ready code. Actual tokens deployed on ICP will require a ledger and an index smart contract. For this example's demonstration, this functionality has been simplified and the ledger functionality has been included in the backend. Tokens deployed using this example are only available for 20 minutes and will be deleted afterwards. They should be treated as "testnet" assets and should not be given real value.
> For more information on creating tokens using a recommended production workflow, view the [create a token documentation](https://internetcomputer.org/docs/current/developer-docs/defi/tokens/create).

This example application is written in [Rust](https://internetcomputer.org/docs/building-apps/developer-tools/cdks/rust/intro-to-rust).

## What is ICP Ninja?

ICP Ninja is a web-based integrated development environment (IDE) for the Internet Computer. It allows you to write code and deploy applications directly from your web browser in a temporary, sandbox-like environment.

For users who may already be familiar with the Internet Computer or who would rather use more **advanced tooling** such as command-line development tools, please refer to the [ICP developer documentation](https://internetcomputer.org/docs/building-apps/getting-started/install) to learn more.

Projects deployed to ICP from ICP Ninja are available on the mainnet for 20 minutes at a time. After 20 minutes, the project must be redeployed.

To deploy your project for long-term, production use such that it persists longer than 20 minutes without needing to be redeployed, you must migrate the files off of ICP Ninja and deploy them to the mainnet via `dfx` in a command-line environment.

## Project structure

The `/backend` folder contains the Rust smart contract:

- `Cargo.toml`, which defines the crate that will form the backend
- `lib.rs`, which contains the core logic of the smart contract, and exports its interface
- `types.rs`, which contains type declarations and some conversion functions to keep the main logic cleaner.

The `/frontend` folder contains web assets for the application's user interface. The user interface is written using the React framework.

## Deploying from ICP Ninja

When viewing this project in ICP Ninja, you can deploy it directly to the mainnet for free by clicking "Deploy" in the upper right corner.

To **download** or **reset** the project files, click the menu option next to the deploy button.

## Editing files

To make adjustments to this project, you can edit any file that is unlocked. Then, redeploy your application to view your changes.

To edit files that are immutable in ICP Ninja, you can export the project to GitHub or download the project to your local environment using the "Download files" option.

## Build and deploy from the command-line

To migrate your ICP Ninja project off of the web browser and develop it locally, follow these steps. These steps are necessary if you want to deploy this project for long-term, production use on the mainnet.

### 1. Download your project from ICP Ninja using the 'Download files' button on the upper left corner under the pink ninja star icon.

### 2. Open the `BUILD.md` file for further instructions.
