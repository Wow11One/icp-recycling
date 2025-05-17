import {
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
  Connection,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  createInitializeMintInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PorNft } from "./por_nft";
import * as anchor from '@coral-xyz/anchor';

export const mintNftWithPda = async ({
  connection,
  wallet,
  program,
}: {
  connection: Connection;
  wallet: anchor.Wallet;
  program: Program<PorNft>;
}) => {
  const testNftTitle = "POR NFT";
  const testNftSymbol = "POR";
  const testNftUri =
    "https://64ecaegqumlgkazch64q5ekoqhgmxlskvblkxnoji7yoxcojrtja.arweave.net/9wggENCjFmUDIj-5DpFOgczLrkqoVqu1yUfw64nJjNI";

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  // Generate new mint keypair
  const mintKeypair = Keypair.generate();

  // Derive program authority PDA
  const [programAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from("mint-authority")],
    program.programId
  );

  // Create and initialize mint
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

  await sendAndConfirmTransaction(connection, createMintTx, [
    wallet.payer,
    mintKeypair,
  ]);

  // Derive token account for the user
  const tokenAccount = getAssociatedTokenAddressSync(
    mintKeypair.publicKey,
    wallet.publicKey
  );

  // Derive metadata and edition PDAs
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

  // Call mintNft instruction
  const tx = await program.methods
    .mintNft(testNftTitle, testNftSymbol, testNftUri)
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
    .signers([wallet.payer])
    .rpc();

  console.log("NFT minted in tx:", tx);
  return tx;
};