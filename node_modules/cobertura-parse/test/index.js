"use strict";

var assert = require( "assert" );
var parse = require( "../source" );
var path = require( "path" );


describe( "parseFile", function ()
{
    it( "should parse a file", function ( done )
    {
        parse.parseFile( path.join( __dirname, "assets", "sample.xml" ), function ( err, result )
        {
            assert.equal( err, null );
            assert.equal( result.length, 4 );
            assert.equal( result[ 0 ].functions.found, 16 );
            assert.equal( result[ 0 ].functions.hit, 14 );
            assert.equal( result[ 0 ].lines.found, 45 );
            assert.equal( result[ 0 ].lines.hit, 40 );
            assert.equal( result[ 0 ].functions.details[ 0 ].line, 5 );
            assert.equal( result[ 0 ].functions.details[ 0 ].hit, 6 );
            assert.equal( result[ 0 ].lines.details[ 0 ].line, 2 );
            assert.equal( result[ 0 ].lines.details[ 0 ].hit, 178 );
            done();
        } );
    } );

    it( "should parse a sparse file", function ( done )
    {
        parse.parseFile( path.join( __dirname, "assets", "sample2.xml" ), function ( err, result )
        {
            assert.equal( err, null );
            assert.equal( result.length, 2 );
            assert.equal( result[ 0 ].functions.found, 0 );
            assert.equal( result[ 0 ].functions.hit, 0 );
            assert.equal( result[ 0 ].lines.found, 2 );
            assert.equal( result[ 0 ].lines.hit, 0 );
            assert.equal( result[ 0 ].functions.details.length, 0 );
            assert.equal( result[ 0 ].lines.details.length, 2 );
            done();
        } );
    } );

    it( "should extract branch coverage", function ( done )
    {
        parse.parseFile( path.join( __dirname, "assets", "sample.xml" ), function ( err, result )
        {
            assert.equal( err, null );
            assert.equal( result[ 0 ].branches.found, 6 );
            assert.equal( result[ 0 ].branches.hit, 3 );
            assert.equal( result[ 0 ].branches.details[ 0 ].taken, 0 );
            assert.equal( result[ 0 ].branches.details[ 1 ].taken, 1 );
            assert.equal( result[ 0 ].branches.details[ 2 ].taken, 0 );
            assert.equal( result[ 0 ].branches.details[ 3 ].taken, 1 );
            assert.equal( result[ 0 ].branches.details[ 4 ].taken, 0 );
            assert.equal( result[ 0 ].branches.details[ 5 ].taken, 1 );

            assert.equal( result[ 2 ].branches.found, 6 );
            assert.equal( result[ 2 ].branches.hit, 5 );
            assert.equal( result[ 2 ].branches.details[ 0 ].taken, 0 );
            assert.equal( result[ 2 ].branches.details[ 1 ].taken, 1 );
            assert.equal( result[ 2 ].branches.details[ 2 ].taken, 1 );
            assert.equal( result[ 2 ].branches.details[ 3 ].taken, 1 );
            assert.equal( result[ 2 ].branches.details[ 4 ].taken, 1 );
            assert.equal( result[ 2 ].branches.details[ 5 ].taken, 1 );
            done();
        } );
    } );

} );
