###### npm package


# Providing predefined files of certain types to test functions working with them

Testing functions that work with files benefits from having testfiles at hand, as well for the file type(s) that must be handled as for those that must be excluded from handling to prevent errors.

**The goal of this package is to test if a function can identify, distinguish and reject file types**. Providing all possible properties of a certain type and narrowing down to specific configurations and possible errors goes far beyond its scope (this should be better done with packages of multiple testfiles for only one file type).

The package installs an extensible collection of small testfiles for different file types and a function to get a path for a testfile of a specific type to be used in a function call (see below). Note that full MIME types are used for easier distinguishing between e.g. `image/jpeg` and `video/JPEG`, moreover MIME types are clear concerning e.g. "jpeg" vs. "jpg" and wrongly set file extensions may crash your application, i.e. you should already prefer them in your code. Refer to sources like [MDN's list of common media types](#mdn-common-media-types-web) to clarify historical idiosyncrasies like `.txt` files being `text/plain` or `.mp3` files being `audio/mpeg`.

**The provided testfiles have real content and structure to distinguish e.g. actual plaintext files from CSS files** - usually tools like [mimetype](#mimetype--file-mimeinfo) and the well established [Linux file command](#linux-file-command) do not analyse contents and would classify an empty `xy.css` as `text/css` or a CSS file `xy` with missing `.css` extension as `text/plain` as a default for any file missing a ["magic" file signature](#wikipedia-list-of-file-signatures) (not to speak of plain fakes like Bun's "file.type" and Deno's "contentType" that fully rely on a file's extension). The provided testfiles have enough content to support possible file type checking by taking samples from their beginning.

Note that not all discussed types are provided yet, but you could add them yourself to the local directory (see [Details](#details)).

*[hh lohmann &lt;hh.lohmann@gmail.com&gt;](mailto:hh.lohmann@gmail.com?subject=predefined-test-files)*

<!-- see https://hh-lohmann.github.io/github-readme-pages-switch -->
<p align="center" id="github_readme_pages_switch" style="display:none;">
  <b><i>This page may be displayed more optimal in its
  <a href="https://hh-lohmann.github.io/predefined-test-files">GitHub Pages view</a>
  </i></b>
</p>


## Synopsis

```js
  import { predefinedTestfile } from 'predefined-test-files'

  myFunctionConsumingFiles( predefinedTestfile( mimeType ) )

  const arrayOfExistingTypessMatchingSearch = predefinedTestfile( `search:` + mimeType )
```



## Parameters

#### mimeType
  * without `search:` prefix: Exact MIME type identifier of requested testfile
    * e.g. `image/jpeg` will return the absolute path to `testfile.image.jpeg`
  * with `search:` prefix: Part of MIME type identifier to search testfiles for
    * e.g. `search:image/` may return `[ 'image/jpeg', 'image/png' ]`
    * meant to check if testfiles for [defined MIME types](#internet-assigned-numbers-authority-iana-media-types) are available, not for guessing probably defined types or their spelling

## Returns

  * without `search:` prefix = `predefinedTestfile( mimeType )`
    * Absolute path to `testfile.[ mimeType.top ].[ mimeType.sub ]`
    * `[ mimeType.top ]` / `[ mimeType.sub ]`: see [Details](#details)

  * with `search:` prefix = `predefinedTestfile( `search:` + mimeType )`
    * Array of MIME types for which testfiles exist
    * e.g. `[ 'image/jpeg', 'image/png' ]`


## Examples

  * Testing with PDF testfile
    ```js
      myPdfReader( predefinedTestfile( 'application/pdf' ) )
    ```

  * Testing with all existing "image/" testfiles
    ```js
      predefinedTestfile( 'search:image/' )
      .forEach( value => {
        myImgProcessor( predefinedTestfile( value ) )
      } )
    ```

  * Testing with all existing "/javascript" testfiles
    ```js
      // This would help if an outdated documentation relies on
      // "application/javascript" which is officially replaced by
      // "text/javascript"
      predefinedTestfile( 'search:/javascript' )
      .forEach( value => {
        myJsValidator( predefinedTestfile( value ) )
      } )
    ```

  * Handling not yet existing testfiles
    ```js
      if( predefinedTestfile( 'search:image/bmp' ).length!==0 ){
        myImgProcessor( predefinedTestfile( 'image/bmp' ) )
      }
      else{
        console.log( 'Bitmaps currently not testable' )
      }
    ```


## Caveats

  * Intentionally no options for testing by properties like file size, naming etc. since these do not depend on the type of a file.

  * Not intended for "meta types" (... top level type ...) like "image"
    * You may utilize a `forEach` iteration to test exactly those image types that your function is expected to handle, e.g.
      ```js
        ['gif','jpeg','png'].forEach( value => {
          yourFunction( predefinedTestfile( 'image/'+value ) )
        })
      ```

  * Notorious ambiguities like CSV files with semicolons instead of commas / with or without a header line / double quotes or not etc. are regarded as a natural fate for your function working with "CSV" files, i.e. there are no different testfiles here, but only one adhering to the reference definiton give in the [IANA registry](#internet-assigned-numbers-authority-iana-media-types)  


## Installation

<!--???? dev dependencies, else delete -->
Dev dependencies like this should be installed explicitly as such to make it easier for humans and tooling to separate it from production critical / less exchangeable things, so do not dismiss the "-D" switch ("-d" for Bun) just by regarding it as old-school.

Pick for your preferred package manager:

```shell
  npm i -D predefined-test-files
```

```shell
  pnpm i -D predefined-test-files
```

```shell
  bun i -d predefined-test-files
```

```shell
  # For Yarn you should double check docs for your and / or
  # current Yarn version, newer versions do not treat `i package_name`
  # as an alias for `add ...` and exclude global installations
  yarn add -D predefined-test-files
```


## Details

  * This package uses the following terms:
    * "MIME type" as the well introduced traditional expression for that what is officially called "Media type"
    * **MIME type identifier** for the string uniquely identifying a MIME type, e.g. `image/jpeg`
    * **mimeType.top** for the part before the `/` in an identifier, e.g. `image`
      > Note that the structure of a MIME type identifier is just implicitly defined over various [RFCs](#wikipedia-request-for-comments-rfc), in practice it is a [top level type](#internet-assigned-numbers-authority-iana-top-level-media-types) like `image` with a subtype like `jpeg` connected by a slash `/`
    * **mimeType.sub** for the part after the `/` in an identifier, e.g. `jpeg`

  * Possible MIME types are those listed in the [official IANA registy](#internet-assigned-numbers-authority-iana-media-types)

  * The testfiles are stored for simplicity in ./node_modules/predefined-test-files/testfiles as `testfile.[ mimeType.top ].[ mimeType.sub ]`
    * This simple structure allows quick adding of testfiles in a local installation that are immediately found by `predefinedTestfile`
    * Manually added testfiles must have real content and structure
    
  * `predefinedTestfile` returns an absolute path to `testfile.[ mimeType.top ].[ mimeType.sub ]`
    * e.g. `/home/joe-doe/fantastic-project/node_moules/predefined-test-files/testfiles/testfile.application.pdf`
    * Relative paths may not work in all contexts
    * Applications consuming relative paths in parameters are likely to resolve them internally to absolute paths anyway


## Demo

<!--???? Interactive use case(s) for exposed function(s) / executable(s) -->

<!-- see https://hh-lohmann.github.io/github-readme-demos-switch -->
<p id="github_readme_demos_switch">
  See <a href="https://...repo-owner....github.io/...project-name.../demos"
  onclick="if( location.hostname.replace( /\d/g, '' ).replaceAll( '.', '' ) === ''
  || location.hostname === 'localhost' ){ this.href='./demos/';
  alert( 'Dev environment detected - switching to local version' ); }"
  >demos</a><span style="display:none;"> on GitHub Pages for this repo</span>
</p>


## Tests

  * Code tests to be run with Node.js / Bun available in [Source Code](#source-code)


## Source Code

  * GitHub: <https://github.com/hh-lohmann/predefined-test-files>


## License

  * MIT (see [LICENSE.txt](LICENSE.txt))

  * Testfiles for top level types `application`, `audio`, `font`, `image` and `video` as well as for `text/rtf` are taken from Edmundas Ramanauskas's file-type-mime package under [MIT license (c) 2023 Edmundas Ramanauskas](https://github.com/redmundas/file-type-mime/blob/main/LICENSE)
  


<!-- see https://hh-lohmann.github.io/readme-references -->
## References

### Internet Assigned Numbers Authority (IANA): Media Types
  * The authorative list of known Media Types (MIME types)
  * <https://www.iana.org/assignments/media-types/media-types.xhtml>

### Internet Assigned Numbers Authority (IANA): Top-Level Media Types
  * <https://www.iana.org/assignments/top-level-media-types/top-level-media-types.xhtml>

### mimetype / File-MimeInfo
  * CLI to check files for MIME type
  * <https://codeberg.org/michielb/File-MimeInfo>

### MDN: Common media types (Web) 
  * <https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types>

### Wikipedia: List of file signatures
  * NB: File signatures are often called "magic number / pattern / bytes"
  * <https://en.wikipedia.org/wiki/List_of_file_signatures>

### Wikipedia: Request for Comments (RFC)
  * <https://en.wikipedia.org/wiki/Request_for_Comments>

### Linux "file" command
  * Also known as the "Ian Darwin / Christos Zoulas implementation"
  * <https://man7.org/linux/man-pages/man1/file.1.html>
  * <https://www.darwinsys.com/file/>


<!-- see https://hh-lohmann.github.io/html-endspacer -->
<p id="endspacer" data-version="0.2.0" title="Endspacer - helps to align scrolling and positioning link targets | Scroll up to content or click / touch to jump to page top" align="center"><a href="#top"><img alt="Endspacer: './markdown-assets/endspacer.png' missing - see https://hh-lohmann.github.io/html-endspacer" src="./markdown-assets/endspacer.png" height="1000" width="100%"><br>[top]</a></p>
