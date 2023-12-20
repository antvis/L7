
import React, { useEffect, useState } from 'react';
import {
  Device,
  Bindings,
  BufferUsage,
  Buffer,
  BufferFrequencyHint,
  VertexStepMode,
  Format,
  TextureDimension,
  PrimitiveTopology,
  TextureUsage,
  TransparentWhite,
  MipmapFilterMode,
  AddressMode,
  FilterMode,
  ChannelWriteMask,
  BlendMode,
  BlendFactor,
  CullMode,
  WebGPUDeviceContribution,
} from '@antv/g-device-api';
export default () => {
    useEffect(() => {

        async function main() {
            const $canvas = document.getElementById('canvas') as HTMLCanvasElement

            const deviceContribution = new WebGPUDeviceContribution({
                shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
            });
            const swapChain = await deviceContribution.createSwapChain($canvas);
            swapChain.configureSwapChain($canvas.width, $canvas.height);
            const device = swapChain.getDevice();

      
            const renderProgram = device.createProgram({
                vertex: {
                    entryPoint: "vert_main",
                    wgsl: `
              struct VertexOutput {
                @builtin(position) position : vec4<f32>,
              }
           

              @vertex
              fn vert_main(
                @location(0) a_particlePos : vec2<f32>,
                @location(1) a_particleVel : vec2<f32>,
                @location(2) a_pos : vec2<f32>
              ) -> VertexOutput {
                let angle = -atan2(a_particleVel.x, a_particleVel.y);
                let pos = vec2(
                  (a_pos.x * cos(angle)) - (a_pos.y * sin(angle)),
                  (a_pos.x * sin(angle)) + (a_pos.y * cos(angle))
                );
            
                var output : VertexOutput;
                output.position = vec4(pos + a_particlePos, 0.0, 1.0);
                return output;
              }
              `
                },
                fragment: {
                    entryPoint: "frag_main",
                    wgsl: `
                   
              @group(0) @binding(0) var myTexture: texture_2d<f32>;
              @group(0) @binding(1) var mySampler: sampler;
              @fragment
              fn frag_main() -> @location(0) vec4<f32> {
                return textureSample(myTexture, mySampler, vec2(0.5,0.5));;
              }
              `
                }
            });

            const computeProgram = device.createProgram({
                compute: {
                    wgsl: `
            struct Particle {
              pos : vec2<f32>,
              vel : vec2<f32>,
            }
            struct SimParams {
              deltaT : f32,
              rule1Distance : f32,
              rule2Distance : f32,
              rule3Distance : f32,
              rule1Scale : f32,
              rule2Scale : f32,
              rule3Scale : f32,
            }
            struct Particles {
              particles : array<Particle>,
            }
            @binding(0) @group(0) var<uniform> params : SimParams;
            @binding(1) @group(0) var<storage, read> particlesA : Particles;
            @binding(2) @group(0) var<storage, read_write> particlesB : Particles;
            
            // https://github.com/austinEng/Project6-Vulkan-Flocking/blob/master/data/shaders/computeparticles/particle.comp
            @compute @workgroup_size(64)
            fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
              var index = GlobalInvocationID.x;
            
              var vPos = particlesA.particles[index].pos;
              var vVel = particlesA.particles[index].vel;
              // var vVel = textureSample(myTexture, mySampler, vPos);
              var cMass = vec2(0.0);
              var cVel = vec2(0.0);
              var colVel = vec2(0.0);
              var cMassCount = 0u;
              var cVelCount = 0u;
              var pos : vec2<f32>;
              var vel : vec2<f32>;
            
              for (var i = 0u; i < arrayLength(&particlesA.particles); i++) {
                if (i == index) {
                  continue;
                }
            
                pos = particlesA.particles[i].pos.xy;
                vel = particlesA.particles[i].vel.xy;
                if (distance(pos, vPos) < params.rule1Distance) {
                  cMass += pos;
                  cMassCount++;
                }
                if (distance(pos, vPos) < params.rule2Distance) {
                  colVel -= pos - vPos;
                }
                if (distance(pos, vPos) < params.rule3Distance) {
                  cVel += vel;
                  cVelCount++;
                }
              }
              if (cMassCount > 0) {
                cMass = (cMass / vec2(f32(cMassCount))) - vPos;
              }
              if (cVelCount > 0) {
                cVel /= f32(cVelCount);
              }
              vVel += (cMass * params.rule1Scale) + (colVel * params.rule2Scale) + (cVel * params.rule3Scale);
            
              // clamp velocity for a more pleasing simulation
              vVel = normalize(vVel) * clamp(length(vVel), 0.0, 0.1);
              // kinematic update
              vPos = vPos + (vVel * params.deltaT);
              // Wrap around boundary
              if (vPos.x < -1.0) {
                vPos.x = 1.0;
              }
              if (vPos.x > 1.0) {
                vPos.x = -1.0;
              }
              if (vPos.y < -1.0) {
                vPos.y = 1.0;
              }
              if (vPos.y > 1.0) {
                vPos.y = -1.0;
              }
              // Write back
              particlesB.particles[index].pos = vPos;
              particlesB.particles[index].vel = vVel;
            }
            `
                }
            });


            const numParticles = 1500;
            const initialParticleData = new Float32Array(numParticles * 4);
            for (let i = 0; i < numParticles; ++i) {
                initialParticleData[4 * i + 0] = 2 * (Math.random() - 0.5);
                initialParticleData[4 * i + 1] = 2 * (Math.random() - 0.5);
                initialParticleData[4 * i + 2] = 2 * (Math.random() - 0.5) * 0.1;
                initialParticleData[4 * i + 3] = 2 * (Math.random() - 0.5) * 0.1;
            }

            const particleBuffers: Buffer[] = [];
            for (let i = 0; i < 2; ++i) {
                particleBuffers[i] = device.createBuffer({
                    viewOrSize: initialParticleData,
                    usage: BufferUsage.VERTEX | BufferUsage.STORAGE
                });
            }

            const vertexBufferData = new Float32Array([
                -0.01, -0.02, 0.01, -0.02, 0.0, 0.02
            ]);
            const spriteVertexBuffer = device.createBuffer({
                viewOrSize: vertexBufferData,
                usage: BufferUsage.VERTEX
            });

            async function loadImage(url) {
              const img = new Image();
              const imgBitmap = await createImageBitmap(await fetch(url).then(response => response.blob()));
              return imgBitmap;
            }

          // 创建纹理和纹理视图
          const image = await loadImage('https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*p4PURaZpM-cAAAAAAAAAAAAADmJ7AQ/original')

          const texture = device.createTexture({
              format: Format.U8_RGBA_NORM,
              width: image.width,
              height: image.height,
              usage: TextureUsage.SAMPLED
          });
          texture.setImageData([image]);

          const sampler = device.createSampler({
              addressModeU: AddressMode.CLAMP_TO_EDGE,
              addressModeV: AddressMode.CLAMP_TO_EDGE,
              minFilter: FilterMode.POINT,
              magFilter: FilterMode.BILINEAR,
              mipmapFilter: MipmapFilterMode.LINEAR,
              lodMinClamp: 0,
              lodMaxClamp: 0
            });

            const uniformBuffer = device.createBuffer({
                viewOrSize: 7 * Float32Array.BYTES_PER_ELEMENT,
                usage: BufferUsage.UNIFORM
            });

            const inputLayout = device.createInputLayout({
                vertexBufferDescriptors: [
                    {
                        arrayStride: 4 * 4,
                        stepMode: VertexStepMode.INSTANCE,
                        attributes: [
                            {
                                // instance position
                                shaderLocation: 0,
                                offset: 0,
                                format: Format.F32_RG
                            },
                            {
                                // instance velocity
                                shaderLocation: 1,
                                offset: 4 * 2,
                                format: Format.F32_RG
                            }
                        ]
                    },
                    {
                        arrayStride: 4 * 2,
                        stepMode: VertexStepMode.VERTEX,
                        attributes: [
                            {
                                // vertex positions
                                shaderLocation: 2,
                                offset: 0,
                                format: Format.F32_RG
                            }
                        ]
                    }
                ],

                indexBufferFormat: null,
                program: renderProgram
            });

            const renderPipeline = device.createRenderPipeline({
                inputLayout,
                program: renderProgram,
                colorAttachmentFormats: [Format.U8_RGBA_RT]
            });
            device.setResourceName(renderPipeline, "Main Render renderPipeline");
            const computePipeline = device.createComputePipeline({
                inputLayout: null,
                program: computeProgram
            });

            const simParams = {
                deltaT: 0.04,
                rule1Distance: 0.1,
                rule2Distance: 0.025,
                rule3Distance: 0.025,
                rule1Scale: 0.02,
                rule2Scale: 0.05,
                rule3Scale: 0.005
            };

            const bindings: Bindings[] = [];
            for (let i = 0; i < 2; ++i) {
                bindings[i] = device.createBindings({
                    pipeline: computePipeline,
                    uniformBufferBindings: [
                        {
                            binding: 0,
                            buffer: uniformBuffer,
                            size: 7 * Float32Array.BYTES_PER_ELEMENT
                        }
                    ],
                    storageBufferBindings: [
                        {
                            binding: 1,
                            buffer: particleBuffers[i],
                            size: initialParticleData.byteLength
                        },
                        {
                            binding: 2,
                            buffer: particleBuffers[(i + 1) % 2],
                            size: initialParticleData.byteLength
                        }
                    ]
                });
            }

    
            const renderBindings = device.createBindings({
              pipeline: renderPipeline,
              samplerBindings: [
                {
                  texture,
                  sampler
                }
              ]
            });
            device.setResourceName(renderBindings, "renderBindings");
            const renderTarget = device.createRenderTarget({
                format: Format.U8_RGBA_RT,
                width: $canvas.width,
                height: $canvas.height
            });
            device.setResourceName(renderTarget, "Main Render Target");

            uniformBuffer.setSubData(
                0,
                new Uint8Array(
                    new Float32Array([
                        simParams.deltaT,
                        simParams.rule1Distance,
                        simParams.rule2Distance,
                        simParams.rule3Distance,
                        simParams.rule1Scale,
                        simParams.rule2Scale,
                        simParams.rule3Scale
                    ]).buffer
                )
            );

            let id;
            let t = 0;
            const frame = () => {
                const computePass = device.createComputePass();
                computePass.setPipeline(computePipeline);
                computePass.setBindings(bindings[t % 2]);
                computePass.dispatchWorkgroups(Math.ceil(numParticles / 64));
                device.submitPass(computePass);

                /**
                 * An application should call getCurrentTexture() in the same task that renders to the canvas texture.
                 * Otherwise, the texture could get destroyed by these steps before the application is finished rendering to it.
                 */
                const onscreenTexture = swapChain.getOnscreenTexture();
                const renderPass = device.createRenderPass({
                    colorAttachment: [renderTarget],
                    colorResolveTo: [onscreenTexture],
                    colorClearColor: [TransparentWhite]
                });
          
  
                renderPass.setPipeline(renderPipeline);
                renderPass.setVertexInput(
                    inputLayout,
                    [
                        {
                            buffer: particleBuffers[(t + 1) % 2]
                        },
                        {
                            buffer: spriteVertexBuffer
                        }
                    ],
                    null
                );
          
                renderPass.setViewport(0, 0, $canvas.width, $canvas.height);
                renderPass.setBindings(renderBindings)
                renderPass.draw(3, numParticles);

                device.submitPass(renderPass);
                ++t;
                id = requestAnimationFrame(frame);
            };

            frame();

        }
        main();

    }, [])


    return <div><canvas  id='canvas' width={1000} height={500}></canvas>

    </div>
};



