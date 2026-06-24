// @ts-check

import {openSync,readSync} from 'node:fs';

import { predefinedTestfile } from 'predefined-test-files';

/** acmePNG is your swiss army knife, but only for PNGs
 * @example acmePNG(yourPNG)
 * @param yourPNG - name / path for image
 * @type {(image:string)=>void} */
const acmePNG=function(image){
  // Throw error if image is not a PNG
  const myMagic='137,80,78,71,13,10,26,10';
  let mySample=Buffer.alloc(8);
  readSync(openSync(image,'r'),mySample,0,8,0);
  if(mySample.toJSON().data.join()!==myMagic) {
    throw Error(`"${image}" is not a PNG image`);
  }
  console.log(`Progressing "${image}" ...`);
  // ...code...
}

console.log('\n# Test if acmePNG correctly rejects non-PNG images');
try{
  acmePNG( predefinedTestfile( 'image/gif' ) );
  console.log( '! TEST FAIL: acmePNG did NOT reject non-PNG');
}
catch(err){
  /** @type {any} */
  const myErr=err;
  console.log( `Test success: acmePNG reject non-PNG: "... ${myErr.toString().replaceAll('"','').split('/').slice(-1)}"`);
}

console.log('\n# Test if acmePNG correctly accepts PNG images');
try{
  acmePNG( predefinedTestfile( 'image/png' ) );
  console.log( 'Test success: acmePNG progresses with PNG file' );
}
catch(err){
  /** @type {any} */
  const myErr=err;
  console.log( `! TEST FAIL: acmePNG did NOT reject non-PNG: "${myErr.toString()}`);
}
