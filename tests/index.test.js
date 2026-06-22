// @ts-check

import { assert, suite, test } from 'node-test-bootstrap';
import {existsSync,mkdirSync,rmdirSync,rmSync,writeFileSync} from 'node:fs';

import { predefinedTestfile } from '../index.js';

suite('Fails on invalid arguments',()=>{
  test('Not enough arguments',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>predefinedTestfile(),
      /not enough arguments/
    )
  });
  test('Too many arguments',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>predefinedTestfile('y','z'),
      /too many arguments/
    )
  });
  test('mimeType not a string',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>predefinedTestfile([]),
      /mimeType must be a string/
    )
  })
  test('More than one command-argument separator ":"',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>predefinedTestfile('x:y:z'),
      /argument syntax/
    );
  })
  test('Unknown command',{skip:false},()=>{
    assert.throws(
      // @ts-ignore
      ()=>predefinedTestfile('x:y'),
      /Unknown command/
    );
  })
});

suite('Fails on non existing testfiles => not testable',{skip:true},()=>{
  /*
   * NOT TESTABLE: Production requires absolute path,
   * absolute paths cannot be mocked straightforward
   */
  // const myCwd=process.cwd();
  // const myTempDir='/tmp/'+crypto.randomUUID();
  // mkdirSync(myTempDir);
  // test('Folder "testfiles" does not exist',{skip:false},()=>{
  //   process.chdir(myTempDir);
  //   assert.throws(
  //     ()=>{predefinedTestfile('x');},
  //     /Folder "testfiles" not found/
  //   );
  //   process.chdir(myCwd);
  // });
  // test('"testfiles" is not a folder',{skip:false},()=>{
  //   writeFileSync(myTempDir+'/testfiles','');
  //   process.chdir(myTempDir);
  //   assert.throws(
  //     ()=>{predefinedTestfile('x');},
  //     /"testfiles" is not a folder/
  //   );
  //   rmSync(myTempDir+'/testfiles');
  //   process.chdir(myCwd);
  // });
  // test('"testfiles" folder is empty',{skip:false},()=>{
  //   mkdirSync(myTempDir+'/testfiles');
  //   process.chdir(myTempDir);
  //   assert.throws(
  //     ()=>{
  //       predefinedTestfile('x');
  //     },
  //     /No testfiles found/
  //   );
  //   rmdirSync(myTempDir+'/testfiles');
  //   process.chdir(myCwd);
  // });
});

suite('Search matching testfiles for type pattern',()=>{
  test('Returns array',{skip:false},()=>{
    assert.ok(Array.isArray(predefinedTestfile('search:/')));
  });
  test('Returns empty array for non existing mimeType pattern',{skip:false},()=>{
    assert.deepEqual(predefinedTestfile('search:0000'),[])
  });
  test('Returns identifiers for existing mimeType pattern',{skip:false},()=>{
    assert.deepEqual(predefinedTestfile('search:text/javascript'),['text/javascript'])
  });
});

suite('Get absolute path for exactly matching testfile',()=>{
  test('Returns string',{skip:false},()=>{
    assert.equal(typeof predefinedTestfile('text/javascript'),'string');
  });
  test('Throws on non existing type',{skip:false},()=>{
    assert.throws(
      ()=>predefinedTestfile('0000/0000'),
      /No testfile for type/
    );
  });
  test('Throws on possible typoe: invalid identifier structure (not "top/sub)"',{skip:false},()=>{
    assert.throws(
      ()=>predefinedTestfile('0000'),
      /is not a valid identifier structure/
    );
  });
  test('Throws on possible typo matching multiple types',{skip:false},()=>{
    assert.throws(
      ()=>predefinedTestfile('text/'),
      /does not lead to a valid type/
    );
  });
  test('Throws on possible typo matching no types',{skip:false},()=>{
    assert.throws(
      ()=>predefinedTestfile('text/javas'),
      /is not a valid type/
    );
  });
  test('Returns valid absolute path',{skip:false},()=>{
    const myFile=predefinedTestfile('text/javascript');
    if(typeof myFile==='string') assert.ok(existsSync(myFile))
  });
});
