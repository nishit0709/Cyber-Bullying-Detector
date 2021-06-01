const crypto=require('crypto');
const rsa=require('node-rsa');
var fs=require('fs');


function GeneratePair(){
    var key=new rsa().generateKeyPair(1024);
    var pub_key=key.exportKey("public");
    var priv_key=key.exportKey("private");
    return[pub_key,priv_key]
}
//Decrypt with private key
function priv_Decrypt(text,priv_key){
    var data_ue=crypto.privateDecrypt(priv_key,Buffer.from(text,'base64'));
    return data_ue.toString('utf8');
}

//Encrypt with public key
function pub_Encrypt(text,pub_key){
    var buffer = Buffer.from(text);
    var data_e=crypto.publicEncrypt(pub_key,buffer);
    return data_e.toString('base64'); 
}

var x=GeneratePair();
var data= "[97,247,55,85,197,243,48,116,223,34,92,65,207,218,47,17,200,116,160,16,204,98,223,139,158,131,62,119,212,1,102,51].[153,148,183,35,185,184,234,25,54,19,254,229,218,114,100,205]"
var y=pub_Encrypt(data,x[0]);
var z=priv_Decrypt(y,x[1]);
console.log(y);
console.log(z);





/* const crypto=require('crypto');

//generate thread key
function generate_thread_key(){
    let key = crypto.randomBytes(32);   
    let iv = crypto.randomBytes(16);
    return [key,iv];
}

function to_String(typedArray){
    const arr = Array.from ? Array.from(typedArray) : [].map.call(typedArray, (v => v));
    const str = JSON.stringify(arr);
    return str
}

function to_Key(data){
    const retrievedArr = JSON.parse(data);
    const retrievedTypedArray = new Uint8Array(retrievedArr);
    return retrievedTypedArray;
}

//Encrypt the messages with aes-256-cbc encryption
function encrypt(text,key,iv) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}

//Decrypt the aes-256-cbc encrypted messages
function decrypt(text,key,iv) {
    let iv_d = Buffer.from(iv,toString('hex'), 'hex');
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv_d);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

var x=generate_thread_key();
var Key=x[0];
var Iv=x[1];
console.log(Key);
console.log(Iv);
var a=to_String(Key);
var b=to_String(Iv);
var m=to_Key(a);
var n=to_Key(b);

var e=encrypt('hello',m,n);
console.log(typeof(e));
console.log(decrypt(e,m,n)); */