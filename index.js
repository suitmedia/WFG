#! /usr/bin/env node

const fs = require ("fs");
const path = require ("path");
const shell = require ("shelljs");
const ttfInfo = require('ttfinfo');

var content = '';

fs.readdir('./', function(err,files) {
    if (err) throw err;

    console.log('On process');

    var TTFs = files.filter( function(file) {
        return file.includes('.ttf');
    }) 

    var length = TTFs.length;
    var counter = 0;
    
    TTFs.forEach( function(file) {
        var fileName = path.basename(file,'.ttf');
        var familyName = fileName.split('-');

        ttfInfo(`${fileName}.ttf`, function(err, info) {
            if (err) throw err;
            var fontWeight = (info.tables['OS\/2'].weightClass);
            var fontInfo = (info.tables.post.italicAngle);
            var fontStyle = '';

            if ( fontInfo < 0 ) {
                fontStyle = 'italic';
            } else {
                fontStyle = 'normal';
            }

            console.log(`Converting ${fileName}`);

            shell.exec(`ttf2woff ${fileName}.ttf ${fileName}.woff`);
            shell.exec(`ttf2eot ${fileName}.ttf ${fileName}.eot`);
            shell.exec(`cat ${fileName}.ttf | ttf2woff2 >> ${fileName}.woff2`);
            
            content += stylesheetContent (familyName,fileName,fontWeight,fontStyle);
            counter++;

            if (counter === length) {
                fs.writeFile('stylesheet.css', content , (err) => {
                    if (err) throw err;
                });

                console.log('Convert finish');
            }
        }); 
    });
});

function stylesheetContent (familyName,fileName,fontWeight,fontStyle) {

    return `
@font-face {
    font-family: '${familyName[0]}';
    src: url('${fileName}.eot');
    src: url('${fileName}.eot?#iefix') format('embedded-opentype'),
         url('${fileName}.woff2') format('woff2'),
         url('${fileName}.woff') format('woff'),
         url('${fileName}.ttf') format('truetype');

    font-weight: ${fontWeight};
    font-style: ${fontStyle}; 
}`
}