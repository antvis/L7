// jscs:disable
/* eslint-disable */

import * as THREE from '../three';

/**
 * @author alteredq / http://alteredqualia.com/
 */

var RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.enabled = true;
	this.clear = false;
	this.needsSwap = false;

};

RenderPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

    this.scene.overrideMaterial = this.overrideMaterial;
    const oldAutoClear = renderer.autoClear;
    // renderer.autoClear = false;
		if ( this.clearColor ) {

			this.oldClearColor.copy( renderer.getClearColor() );
			this.oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

    renderer.render( this.scene, this.camera, readBuffer, this.clear );
    // if(this.clear)renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );

		if ( this.clearColor ) {

			renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

		}

    this.scene.overrideMaterial = null;
    renderer.autoClear = oldAutoClear;

	}

};

export default RenderPass;
