#! /usr/bin/env node
"use strict";

const fs = require ("fs");
const path = require ("path");
const shell = require ("shelljs");
const ttfInfo = require('ttfinfo');

let content = '';

fs.readdir('./',( err,files ) => {
    if (err) throw err;

    console.log('On process');

    let TTFs = files.filter( ( file ) => file.includes('.ttf') ); 

    let length = TTFs.length;
    let counter = 0;
    
    TTFs.forEach( ( file ) => {
        let fileName = path.basename(file,'.ttf');
        let familyName = fileName.split('-');

        ttfInfo(`${fileName}.ttf`,( err, info ) => {
            if (err) throw err;
            let fontWeight = (info.tables['OS\/2'].weightClass);
            let fontInfo = (info.tables.post.italicAngle);
            let fontStyle = fontInfo < 0 ? 'italic' : 'normal';
            
            console.log(`Converting ${fileName}`);

            shell.exec(`ttf2woff ${fileName}.ttf ${fileName}.woff`);
            shell.exec(`ttf2eot ${fileName}.ttf ${fileName}.eot`);
            shell.exec(`cat ${fileName}.ttf | ttf2woff2 >> ${fileName}.woff2`);
            
            content += stylesheetContent (familyName[0], fileName, fontWeight, fontStyle);
            counter++;

            if (counter === length) {
                fs.writeFile('stylesheet.css', content , (err) => {
                    if (err) throw err;

                    console.log('Convert finish');
                });   
            }
        }); 
    });
});

function stylesheetContent( familyName, fileName, fontWeight, fontStyle ) {

    return `
@font-face {
    font-family: '${familyName}';
    src: url('${fileName}.eot');
    src: url('${fileName}.eot?#iefix') format('embedded-opentype'),
         url('${fileName}.woff2') format('woff2'),
         url('${fileName}.woff') format('woff'),
         url('${fileName}.ttf') format('truetype');

    font-weight: ${fontWeight};
    font-style: ${fontStyle}; 
}`
}