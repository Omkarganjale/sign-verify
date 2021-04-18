# Abstract
This is a simple prototype of the GSoC project,
*Accord Project: Signing Templates and Signing Contracts*

If a contract/template is signed, then the signature  can be found the signature.json along with it's file name. An array of signatures are used so any number of signatures can be stored(planning to associate signature with file hash so even if the file is renamed it cannot be missed out)

Ideally signature.json should be a read-only file(under progress).

# Usage

 >Note:
 * I am still working on this prototype so some mentioned functionalities will not available yet.
 * Following functionalities are proposed ones.
 * Available ones are tick marked in front of them.
 * User input exceptions are not handeled yet.

- [x] ## Signing the template or document

```sh
$ node sign -f filePath -k privKeyPath -p passphrase
```
Break through is shown below
1. f - path of the file, which is to be signed
2. k - path of the private key, which is to be used for signing (.pem extension)
3. p - passphrase of the encrypted private key

- [ ] ## Verifying the template or document for the signature

```sh
$ node verify -f filePath -k pubKeyPath 
```
Break through is shown below
1. f - path of the file, which is to be verified
2. k - path of the public key, which is to be used for signing (.pem extension)