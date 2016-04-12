#! /usr/bin/env node

const fs = require ("fs");
const path = require ("path");
const shell = require ("shelljs");

var content = '';

fs.readdir('./',function(err,files){
    if (err) throw err;
    console.log('On process');
    
    files.forEach(function(file){
    	if (file.includes('.ttf')) {
            var filename = path.basename(file,'.ttf');
            var familyName = filename.split('-');
            console.log(`Converting ${filename}`);

            shell.exec('ttf2woff '+ filename +'.ttf '+ filename +'.woff');
            shell.exec('ttf2eot '+ filename +'.ttf '+ filename +'.eot');
            shell.exec('cat '+ filename +'.ttf | ttf2woff2 >> '+ filename +'.woff2');
            
            content += stylesheetContent (familyName,filename);
        }
    });
    
    fs.writeFile('stylesheet.css', content , (err) => {
        if (err) throw err;
    });
    console.log('Convert finish');
});

function stylesheetContent (familyName,filename) {
    return `
@font-face {
    font-family: '${familyName[0]}';
    src: url('${filename}.eot');
    src: url('${filename}.eot?#iefix') format('embedded-opentype'),
         url('${filename}.woff2') format('woff2'),
         url('${filename}.woff') format('woff'),
         url('${filename}.ttf') format('truetype');

    font-weight: normal;
    font-style: normal; 
}`
}