/** Check provided args for predefinedTestfile()
 *  - Signature = predefinedTestfile, except return
 *  - ! Needs the args actually passed by user, therefore ""...args:any"
 * @returns true if no errors
 */
export type _ChkArgsPredefinedTestFile=(...args:any)=>boolean; 
export const _chkArgsPredefinedTestFile:_chkArgsPredefinedTestFile;

  /** Return array of names of existing testfiles matching search string
   *  - Depending on `mode`: exact or partial matches
 * @example function('javascript')
 * @example function('text/javascript','exact')
 * @param searchTerm - Term to search, interpreted as RegEx /^*searchTerm*$/
 * @param mode - How to match: 'exact' vs. 'partial'
 * @returns Array of strings
 */
export type _GetTestfiles=(searchTerm:string,mode:'exact'|'partial')=>string[]|string;
export const _getTestfiles:_GetTestfiles;

/** Return absolute path to a testfile or array of names of testfiles
 *  matching a search
 * @example predefinedTestfile(mimeType)
 * @example predefinedTestfile('search:'+mimeType)
 * @param mimeType - MIME Type for which a testfile is requested or
 *                   available testfiles searched (if prefixed with
 *                   "search:")
 * @returns string or array of strings
 */
export type PredefinedTestfile=(mimeType:string)=>string|string[];
export const predefinedTestfile:predefinedTestfile;
