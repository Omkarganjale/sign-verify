const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const argv = require('yargs').argv;

if (!fs.existsSync('./signature.json')) {
    console.warn(`Warning:Signature.json does not exist`);
    fs.writeFileSync('./signature.json', '{}', 'utf8', err => {
        if (err) throw err;
    });
    console.log(`Created a signature.json file in ${__dirname}`);
        
};

const date = require('date-and-time')
let signJson = require('./signature');
const filePath = argv.f;
const fileName = path.basename(filePath);   
const PrivKeyPath = argv.k; 
const password = argv.p

// exit if file absent
if (!fs.existsSync(filePath)) {
    console.error(`Error: ${filePath} does not exist`);
    process.exit(1);
}

// exit if PrivKey absent
if(!fs.existsSync(PrivKeyPath)){
    console.error(`Error: ${PrivKeyPath} does not exist`);
    process.exit(1);
}

// hashing the file
const hashAlgo = crypto.createHash('sha256');
hashAlgo.update(fs.readFileSync(filePath));
const fileHash = hashAlgo.digest('hex');
//console.log('FILE HASH : \n'+ fileHash + '\n');

// sign sha256 digest of file
const sign = crypto.createSign('SHA256');
sign.update(fs.readFileSync(filePath));
sign.end();
const hexsign = sign.sign({
  key : fs.readFileSync(PrivKeyPath),
  passphrase: password
},'hex');

console.log(`\nFollowing is the signature obtained after processing ${filePath} with the given private key\n`);
console.log(hexsign);
console.log();

const now = new Date();


//check fileHash
if(!(fileHash in signJson)){

  signJson[fileHash]={
      name:fileName,
      count:0,
      signatureArr:[] // {sign: ... , timestamp:date.format(now, 'YYYY/MM/DD HH:mm:ss [GMT]Z')}
    };

}

// check name

if (fileName != signJson[fileHash].name){
  console.log(`Change in file name detected \nOld fileName: ${signJson[fileHash].name} \nNew fileName: ${fileName} \nNow the file will be tracked with the new name \n`);
  signJson[fileHash].name = fileName;
} 

// check hexsign
const hexsignIndex = signJson[fileHash].signatureArr.findIndex( ele => ele.sign === hexsign); 
if(hexsignIndex !== -1){

  console.log(`Given file ${filePath} is already signed with the given private key at ${PrivKeyPath} on ${signJson[fileHash].signatureArr[hexsignIndex].timestamp}`);
  signJson[fileHash].signatureArr[hexsignIndex].timestamp = date.format(now, 'YYYY/MM/DD HH:mm:ss [GMT]Z');
  console.log(`Timestamp for the above signature is updated to ${signJson[fileHash].signatureArr[hexsignIndex].timestamp}`)

}else{

  signJson[fileHash].signatureArr.push(
        {
        sign:hexsign,
        timestamp:date.format(now, 'YYYY/MM/DD HH:mm:ss [GMT]Z')
        }
      );

  signJson[fileHash].count++;

}

//write signature.json
fs.writeFile(__dirname+"/signature.json",JSON.stringify(signJson,null,2),err=>{
  if (err) throw err
});