/*
import {
	ColorManagement,
	RawShaderMaterial,
	UniformsUtils,
	LinearToneMapping,
	ReinhardToneMapping,
	CineonToneMapping,
	ACESFilmicToneMapping,
	SRGBTransfer
} from 'three';
import { Pass, FullScreenQuad } from './Pass.js';
import { OutputShader } from '../shaders/OutputShader.js';

*/

( function () {

	class OutputPass extends THREE.Pass {

		constructor() {

			super();

			//

			const shader = THREE.OutputShader;

			this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

			this.material = new THREE.RawShaderMaterial( {
				uniforms: this.uniforms,
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader
			} );

			this.fsQuad = new THREE.FullScreenQuad( this.material );

			// internal cache

			this._outputColorSpace = null;
			this._toneMapping = null;

		}

		render( renderer, writeBuffer, readBuffer/*, deltaTime, maskActive */ ) {

			this.uniforms[ 'tDiffuse' ].value = readBuffer.texture;
			this.uniforms[ 'toneMappingExposure' ].value = renderer.toneMappingExposure;

			// rebuild defines if required

			if ( this._outputColorSpace !== renderer.outputColorSpace || this._toneMapping !== renderer.toneMapping ) {

				this._outputColorSpace = renderer.outputColorSpace;
				this._toneMapping = renderer.toneMapping;

				this.material.defines = {};

				if ( THREE.ColorManagement.getTransfer( this._outputColorSpace ) === THREE.SRGBTransfer ) this.material.defines.SRGB_TRANSFER = '';

				if ( this._toneMapping === THREE.LinearToneMapping ) this.material.defines.LINEAR_TONE_MAPPING = '';
				else if ( this._toneMapping === THREE.ReinhardToneMapping ) this.material.defines.REINHARD_TONE_MAPPING = '';
				else if ( this._toneMapping === THREE.CineonToneMapping ) this.material.defines.CINEON_TONE_MAPPING = '';
				else if ( this._toneMapping === THREE.ACESFilmicToneMapping ) this.material.defines.ACES_FILMIC_TONE_MAPPING = '';

				this.material.needsUpdate = true;

			}

			//

			if ( this.renderToScreen === true ) {

				renderer.setRenderTarget( null );
				this.fsQuad.render( renderer );

			} else {

				renderer.setRenderTarget( writeBuffer );
				if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
				this.fsQuad.render( renderer );

			}

		}

		dispose() {

			this.material.dispose();
			this.fsQuad.dispose();

		}

	}

	THREE.OutputPass = OutputPass;

} )();
