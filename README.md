# Abstract
This is a simple prototype for signing and verfying the documents using nodejs

If a contract/template is signed, then the signature  can be found in the signature.json along with it's file hash. A file can be signed by more than one user and signatures are stored in an array


Ideally signature.json should be a read-only file.

# Usage

## Signing the template or document

```sh
$ node sign -f filePath -k privKeyPath -p passphrase
```
Break through is shown below
1. f - path of the file, which is to be signed
2. k - path of the private key, which is to be used for signing (.pem extension)
3. p - passphrase of the encrypted private key

## Verifying the template or document for the signature

```sh
$ node verify -f filePath -k pubKeyPath 
```
Break through is shown below
1. f - path of the file, which is to be verified
2. k - path of the public key, which is to be used for signing (.pem extension)
