import {
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  Connection,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Program } from "@coral-xyz/anchor";
import { PorNft } from "./por_nft";
import * as anchor from '@coral-xyz/anchor';

export const mintNftWithPda = async ({
  connection,
  wallet,
  program,
  nftTitle,
  nftUri,
}: {
  nftTitle: string,
  nftUri: string,
  connection: Connection;
  wallet: anchor.Wallet;
  program: Program<PorNft>;
}) => {console.log('wallet1', wallet)
  const nftSymbol = "POR";

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const mintKeypair = Keypair.generate();
  console.log('wallet.payer2', wallet.payer)
  const [programAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from("mint-authority")],
    program.programId
  );
  const lamports = await connection.getMinimumBalanceForRentExemption(82);
  const createMintTx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: 82,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      0,
      programAuthority,
      programAuthority // freeze authority must not be null
    )
  );
  
  createMintTx.feePayer = wallet.publicKey;
  createMintTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  createMintTx.partialSign(mintKeypair);

  const signedTxArray = await wallet.signAllTransactions([createMintTx]);
  const signedTx = signedTxArray[0];
  const txId = await connection.sendRawTransaction(signedTx.serialize());
  await connection.confirmTransaction(txId, "confirmed");
  console.log('mintKeypair3', mintKeypair)

  const tokenAccount = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    wallet.publicKey
  );

  const [metadata] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const [masterEdition] = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintKeypair.publicKey.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  console.log('wallet4', wallet)

  // Call mintNft instruction
  const tx = await program.methods
    .mintNft(nftTitle, nftSymbol, nftUri)
    .accounts({
      mint: mintKeypair.publicKey,
      tokenAccount,
      metadata,
      masterEdition,
      programAuthority,
      mintAuthority: wallet.publicKey,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    })
    .signers([])
    .rpc();

  console.log("NFT minted in tx:", tx);
  return tx;
};