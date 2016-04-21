# WebFont generator (WFG)

> is a tool to convert .ttf files to .eot, .woff and .woff2 along with the stylesheet containing `@font-face` rules

## Status

This tool is still work in progress

## Requirement

* NodeJS v4

**Note**: WFG will automatically install ttf2eot, ttf2woff and ttf2woff2 modules globally via npm.

## Installation

1. Clone this repository
2. `cd` into the directory
3. Run command `npm run setup` to install required modules

## Update

1. `cd` into the directory
2. Pull from this repository
3. Run command `npm run setup` again to install new required modules

## Usage

1. `cd` into directory containing .ttf font files you want to convert
2. Run command `wfg`
3. WFG will automagically convert .ttf files to .eot, .woff and .woff2 then generate a stylesheet
4. Done. All assets are ready to use
