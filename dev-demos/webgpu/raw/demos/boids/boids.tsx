
import React, { useEffect, useState } from 'react';
import {
  loadImageBitmap,
  createTextureFromSource,
} from '../utils'
import spriteWGSL from './sprite.wgsl';
import updateSpritesWGSL from './updateSprites.wgsl';

export default () => {
  const [output, setOutput] = useState<Float32Array>()
  useEffect(() => {
    async function main() {
         
          
      async function loadImage(url) {
        const imgBitmap = await createImageBitmap(await fetch(url).then(response => response.blob()));
        return imgBitmap;
      }

    // 创建纹理和纹理视图
    const image = await loadImage('https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*p4PURaZpM-cAAAAAAAAAAAAADmJ7AQ/original')

      const $canvas = document.getElementById('canvas') as HTMLCanvasElement
      const adapter = await navigator.gpu.requestAdapter() as GPUAdapter;

      const hasTimestampQuery = adapter.features.has('timestamp-query');
      const device = await adapter.requestDevice({
        requiredFeatures: hasTimestampQuery ? ['timestamp-query'] : [],
      });

      const context = $canvas.getContext('webgpu') as GPUCanvasContext;

      const devicePixelRatio = window.devicePixelRatio;
      $canvas.width = $canvas.clientWidth * devicePixelRatio;
      $canvas.height = $canvas.clientHeight * devicePixelRatio;
      const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

      context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      });


      const texture = createTextureFromSource(device, image);

      const spriteShaderModule = device.createShaderModule({ code: spriteWGSL });
      const renderPipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
          module: spriteShaderModule,
          entryPoint: 'vert_main',
          buffers: [
            {
              // instanced particles buffer
              arrayStride: 4 * 4,
              stepMode: 'instance',
              attributes: [
                {
                  // instance position
                  shaderLocation: 0,
                  offset: 0,
                  format: 'float32x2',
                },
                {
                  // instance velocity
                  shaderLocation: 1,
                  offset: 2 * 4,
                  format: 'float32x2',
                },
              ],
            },
            {
              // vertex buffer
              arrayStride: 2 * 4,
              stepMode: 'vertex',
              attributes: [
                {
                  // vertex positions
                  shaderLocation: 2,
                  offset: 0,
                  format: 'float32x2',
                },
              ],
            },
          ],
        },
        fragment: {
          module: spriteShaderModule,
          entryPoint: 'frag_main',
          targets: [
            {
              format: presentationFormat,
            },
          ],
        },
        primitive: {
          topology: 'triangle-list',
        },
      });

      const computePipeline = device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: device.createShaderModule({
            code: updateSpritesWGSL,
          }),
          entryPoint: 'main',
        },
      });

      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: undefined as unknown as GPUTextureView, // Assigned later
            clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
            loadOp: 'clear' as const,
            storeOp: 'store' as const,
          },
        ],
      };

      const computePassDescriptor: GPUComputePassDescriptor = {};


      // prettier-ignore
      const vertexBufferData = new Float32Array([
        -0.01, -0.02, 0.01,
        -0.02, 0.0, 0.02,
      ]);

      const spriteVertexBuffer = device.createBuffer({
        size: vertexBufferData.byteLength,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
      });
      new Float32Array(spriteVertexBuffer.getMappedRange()).set(vertexBufferData);
      spriteVertexBuffer.unmap();

      const simParams = {
        deltaT: 0.04,
        rule1Distance: 0.1,
        rule2Distance: 0.025,
        rule3Distance: 0.025,
        rule1Scale: 0.02,
        rule2Scale: 0.05,
        rule3Scale: 0.005,
      };

      const simParamBufferSize = 7 * Float32Array.BYTES_PER_ELEMENT;
      const simParamBuffer = device.createBuffer({
        size: simParamBufferSize,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      function updateSimParams() {
        device.queue.writeBuffer(
          simParamBuffer,
          0,
          new Float32Array([
            simParams.deltaT,
            simParams.rule1Distance,
            simParams.rule2Distance,
            simParams.rule3Distance,
            simParams.rule1Scale,
            simParams.rule2Scale,
            simParams.rule3Scale,
          ])
        );
      }

      updateSimParams();

      const numParticles = 1500;
      const initialParticleData = new Float32Array(numParticles * 4);
      for (let i = 0; i < numParticles; ++i) {
        initialParticleData[4 * i + 0] = 2 * (Math.random() - 0.5);
        initialParticleData[4 * i + 1] = 2 * (Math.random() - 0.5);
        initialParticleData[4 * i + 2] = 2 * (Math.random() - 0.5) * 0.1;
        initialParticleData[4 * i + 3] = 2 * (Math.random() - 0.5) * 0.1;
      }

      const particleBuffers: GPUBuffer[] = new Array(2);
      const particleBindGroups: GPUBindGroup[] = new Array(2);
      for (let i = 0; i < 2; ++i) {
        particleBuffers[i] = device.createBuffer({
          size: initialParticleData.byteLength,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
          mappedAtCreation: true,
        });
        new Float32Array(particleBuffers[i].getMappedRange()).set(
          initialParticleData
        );
        particleBuffers[i].unmap();
      }

      for (let i = 0; i < 2; ++i) {
        particleBindGroups[i] = device.createBindGroup({
          layout: computePipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: {
                buffer: simParamBuffer,
              },
            },
            {
              binding: 1,
              resource: {
                buffer: particleBuffers[i],
                offset: 0,
                size: initialParticleData.byteLength,
              },
            },
            {
              binding: 2,
              resource: {
                buffer: particleBuffers[(i + 1) % 2],
                offset: 0,
                size: initialParticleData.byteLength,
              },
            },
          ],
        });
      }


      const bindRenderGroup = device.createBindGroup({
        label: 'renderPipeline bindGroup',
        layout: renderPipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: texture.createView() },
        ],
      });

      let t = 0;

      function frame() {
        // Sample is no longer the active page.
    
        renderPassDescriptor.colorAttachments[0].view = context
          .getCurrentTexture()
          .createView();
    
        const commandEncoder = device.createCommandEncoder();
        {
          const passEncoder = commandEncoder.beginComputePass(
            computePassDescriptor
          );
          passEncoder.setPipeline(computePipeline);
          passEncoder.setBindGroup(0, particleBindGroups[t % 2]);
          passEncoder.dispatchWorkgroups(Math.ceil(numParticles / 64));
          passEncoder.end();
        }
        {
          const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
          passEncoder.setPipeline(renderPipeline);
          passEncoder.setBindGroup(0,bindRenderGroup);
          passEncoder.setVertexBuffer(0, particleBuffers[(t + 1) % 2]);
          passEncoder.setVertexBuffer(1, spriteVertexBuffer);
          passEncoder.draw(3, numParticles, 0, 0);
          passEncoder.end();
        }
    

  
        device.queue.submit([commandEncoder.finish()]);
        
    
        ++t;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

    }




    main();

  }, [])


  return <div style={{ width: '100%', height: '500px' }}><canvas style={{width:'100%', height:'500px'}} id='canvas'></canvas></div>

};



