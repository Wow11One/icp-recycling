# Proof of recycling

![PoR](https://res.cloudinary.com/dbkgbcqcf/image/upload/v1743410699/PoR_lglivd.png)

The project aims to promote environmental responsibility among Ukrainian citizens through the use of ICP blockchain technology.

This example application is written in Rust, TypeScript (React).

## Project structure

 - The `backend` folder contains the Rust smart contract, used mostly for authentication purposes.
 - The `icrc2` folder contains the Rust smart contract, used for ICRC2 token logic (currency for bonuses).
 - The `nft` folder contains the Rust smart contract, used for ICRC2 toke logic (bonuses).
 - The `storage` folder contains the Rust smart contract, built to store recycling records of users.
 - The `frontend` folder contains web assets for the application's user interface. The user interface is written using the React framework.

## Unique features

- HTTPS outcalls
- Fully on-chain (frontend and backend)
- Stable memory usage
- API integrations with AI services
- QR code scanning with synchronous communication (websockets are used)


## How to start project locally

The project includes `Makefile`, so you can start it in the local environment just using the command:

```
make deploy-all
```

If you do not want to use `Makefile`, then you can write all required commands by yourself. You can use this commands to start dfx and then to generate IDs for the canister:

```
dfx start --background
dfx canister create --all
```

To deploy the backend canisters for local development:

```
dfx deploy backend
dfx deploy icrc2
dfx deploy nft
dfx deploy storage
dfx deploy internet_identity
```

To deploy the frontend canister for local development:

```
dfx deploy frontend
```

To run the frontend part in a watch mode:

```
npm install
npm run dev
```

## Description

The project aims to promote environmental responsibility among Ukrainian citizens through the use of ICP blockchain technology.

Anyone who brings waste to the "Ukraine Without Waste" station receives tokens, which can be used to purchase NFTs that grant discounts at partner store chains as a reward for their contribution to recycling.

## How It Works

1. A person arrives at the "Ukraine Without Waste" station with recyclable waste.
2. They take a photo of themselves in front of the station's sign along with the waste they brought.
3. They upload the photo to a mobile app or web platform powered by ICP.
4. They receive 1,000 ICRC2 tokens in their balance.
5. On the project's partner offers page, users can purchase three types of NFTs, which grant discounts at partner stores.

## Expected Results

 - An increase in the number of people who sort and recycle waste.
 - The development of a culture of environmental responsibility.
 - The promotion of blockchain and Web3 technology in social initiatives.
 - The creation of a sustainable incentive mechanism for recycling.

## Links

 - [Presentation link](https://docs.google.com/presentation/d/1HwgGLAqxJhjB4TFSljMQF67l3jtmz99O/edit?slide=id.p1#slide=id.p1)
 - [Demo video](https://drive.google.com/file/d/1O4S4A_055JRA0pBVEBfUoskLWMRvY2US/view?usp=sharing)
 - [Deployed project on ICP](https://janwu-4qaaa-aaaak-qukwq-cai.icp0.io/)
