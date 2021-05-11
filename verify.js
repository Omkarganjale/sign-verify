const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const crypto = require('crypto');

// exit if signature.json absent
if (!fs.existsSync('./signature.json')) {
    console.error(`Error:signature.json file does not exist in ${__dirname} \nAborting the program \nNone of your files and signatures were read`);
    process.exit(1);
};

let signJson = require('./signature');
const filePath = argv.f;
const fileName = path.basename(filePath);   
const PubKeyPath = argv.k;

// exit if file absent
if (!fs.existsSync(filePath)) {
    console.error(`Error: ${filePath} does not exist`);
    process.exit(1);
}

// exit if PubKey absent
if(!fs.existsSync(PubKeyPath)){
    console.error(`Error: ${PubKeyPath} does not exist`);
    process.exit(1);
}

// hashing the file
const hashAlgo = crypto.createHash('sha256');
hashAlgo.update(fs.readFileSync(filePath));
const fileHash = hashAlgo.digest('hex');
//console.log('FILE HASH : \n'+ fileHash + '\n');

//check fileHash
if(!(fileHash in signJson)){

  console.error(`Signatures for given ${fileName} cannot be found in signature.json \nPlease sign the file before verification`);
  process.exit(1);

}

const verify = crypto.createVerify('SHA256');
verify.update(fs.readFileSync(filePath));

const PubKeyContent = fs.readFileSync(PubKeyPath,'utf8');

const searchResult = signJson[fileHash].signatureArr.find(ele => verify.verify(PubKeyContent, ele.sign, 'hex'));

var result = {
	'FileName':filePath,
	'Key':PubKeyPath,
	'TotalSignatures':signJson[fileHash].count,
	'Result':'Pending',
	'Remark':'Pending'
}

if(searchResult === undefined){
	result.Result = false
	result.Remark = 'File was not signed with the Private key corresponding to the given Public key'
}else{
	result.Result = true
	result.Remark = `File was last signed on ${searchResult.timestamp}`
}

console.log(JSON.stringify(result,null,2));