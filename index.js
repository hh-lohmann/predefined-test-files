// @ts-check

import {readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import pkg from './package.json' with {type:'json'};

/** @import {_ChkArgsPredefinedTestFile,_GetTestfiles,PredefinedTestfile} from './types.d.ts' */

const _errPrefix=pkg.name+': ';

/** @type { _ChkArgsPredefinedTestFile} */
const _chkArgsPredefinedTestFile=function(mimeType){
  if(arguments.length<1) throw SyntaxError(_errPrefix+'not enough arguments');
  if(arguments.length>1) throw SyntaxError(_errPrefix+'too many arguments');
  if(typeof mimeType!=='string') throw TypeError(_errPrefix+'mimeType must be a string');
  if(mimeType.split(':').length>2) throw SyntaxError(_errPrefix+`Wrong argument syntax: "${mimeType}"`);
  if(mimeType.split(':').length===2&&mimeType.split(':')[0]!=='search') throw SyntaxError(_errPrefix+`Unknown command: "${mimeType.split(':')[0]}"`);
  return true;
}

/** @type {_GetTestfiles} */
const _getTestfiles=function(searchTerm,mode){
  const internalSearch=searchTerm.replace('/','.');
  let existingFiles=[];
  try{
    existingFiles=readdirSync('./testfiles');
    if(existingFiles.length===0) throw ReferenceError('No testfiles found');
  }
  catch(/** @type {any} */ err){
    if(err.code==='ENOENT') throw ReferenceError(_errPrefix+'Folder "testfiles" not found');
    if(err.code==='ENOTDIR') throw ReferenceError(_errPrefix+'"testfiles" is not a folder');
    if(err.message!=='') throw Error(_errPrefix+err.message);
    throw Error(_errPrefix+'Unknown error while checking for existence of test files');
  }
  existingFiles=existingFiles.filter(value=>value.includes(internalSearch))
  if(mode==='exact'){
    if(searchTerm.split('/').length!==2) throw Error(_errPrefix+`"${searchTerm}" is not a valid identifier structure for a type`);
    if(existingFiles.length===0) throw Error(_errPrefix+`No testfile for type "${searchTerm}" available - maybe not a valid type`);
    if(existingFiles.length>1) throw Error(_errPrefix+`"${searchTerm}" does not lead to a valid type - maybe a Typo`);
    if(existingFiles[0]!=='testfile.'+searchTerm.replace('/','.')) throw Error(_errPrefix+`"${searchTerm}" is not a valid type - maybe a Typo`);
    return resolve('testfiles/'+existingFiles[0]);
  }
  existingFiles=existingFiles.map(value=>value.replace(/testfile\.([^\.]+)\./,'$1/'));
  return existingFiles;
}


/** @type {PredefinedTestfile} */
export const predefinedTestfile=function(mimeType){
  _chkArgsPredefinedTestFile(...arguments);
  if(mimeType.split(':').length>1){
    return _getTestfiles(mimeType.split(':')[1],'partial');
  }
  else{
    return _getTestfiles(mimeType,'exact');
  }
}
