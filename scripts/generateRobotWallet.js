const { Ed25519Keypair } = require('@mysten/sui.js/keypairs/ed25519');
const { toB64 } = require('@mysten/sui.js/utils');

const keypair = new Ed25519Keypair();
const publicKey = keypair.getPublicKey();
const address = publicKey.toSuiAddress();
const privateKey = keypair.export();

console.log(address);
console.log(privateKey.privateKey);


