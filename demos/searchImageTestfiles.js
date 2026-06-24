// @ts-check

import {openSync,readSync} from 'node:fs';

import { predefinedTestfile } from 'predefined-test-files';

/** acmeImage aims to cover the most common image formats
 * @example acmeImage(yourImage)
 * @param yourImage - name / path for image
 * @type {(image:string)=>void} */
const acmeImage=function(image){
  const knownFormats=[
    [ '42 4d', 'Bitmap' ],
    [ '47 49 46 38', 'GIF' ],
    [ 'ff d8 ff e0', 'JPEG File Interchange' ],
    [ '49 49 4e 31', 'NIFF (Navy TIFF)' ],
    [ '89 50 4e 47', 'PNG' ],
    [ '4d 4d 00 2a', 'TIFF' ],
    [ '49 49 2a 00', 'TIFF' ]
  ]
  // Throw error if image format is not known
  let formatKnown=undefined;
  let mySample=Buffer.alloc(16);
  readSync(openSync(image,'r'),mySample,0,16,0);
  for(let i=0;i<knownFormats.length;i++){
    const myMagic=knownFormats[i][0].replaceAll(' ','');
    if(mySample.toString('hex').slice(0,myMagic.length)===myMagic) {
      formatKnown=true;
      i=knownFormats.length;
    }
  }
  if(!formatKnown) throw Error('Image format not recognized');
  // ...code...
}

console.log('\n# Test for each known image type if acmeImage can currently handle it' );
predefinedTestfile('search:image/').sort().forEach(
  /**@type {(value:string)=>any}*/
  value => {
    try{
      acmeImage( predefinedTestfile( value ) );
      console.log( value,'\tOK' );
    }
    catch(err){
      console.log( value,'\tFAIL' );
    }
  }
)
