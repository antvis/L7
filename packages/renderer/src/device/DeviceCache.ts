import type {
  AttachmentState,
  Bindings,
  BindingsDescriptor,
  ChannelBlendState,
  Color,
  Device,
  InputLayout,
  InputLayoutDescriptor,
  MegaStateDescriptor,
  Program,
  ProgramDescriptor,
  RenderPipeline,
  RenderPipelineDescriptor,
} from '@antv/g-device-api';
import {
  TransparentBlack,
  bindingsDescriptorCopy,
  bindingsDescriptorEquals,
  inputLayoutDescriptorCopy,
  inputLayoutDescriptorEquals,
  renderPipelineDescriptorCopy,
  renderPipelineDescriptorEquals,
} from '@antv/g-device-api';
import { HashMap, hashCodeNumberFinish, hashCodeNumberUpdate, nullHashFunc } from './utils/HashMap';

function blendStateHash(hash: number, a: ChannelBlendState): number {
  hash = hashCodeNumberUpdate(hash, a.blendMode);
  hash = hashCodeNumberUpdate(hash, a.blendSrcFactor);
  hash = hashCodeNumberUpdate(hash, a.blendDstFactor);
  return hash;
}

function attachmentStateHash(hash: number, a: AttachmentState): number {
  hash = blendStateHash(hash, a.rgbBlendState);
  hash = blendStateHash(hash, a.alphaBlendState);
  hash = hashCodeNumberUpdate(hash, a.channelWriteMask);
  return hash;
}

function colorHash(hash: number, a: Color): number {
  hash = hashCodeNumberUpdate(hash, (a.r << 24) | (a.g << 16) | (a.b << 8) | a.a);
  return hash;
}

function megaStateDescriptorHash(hash: number, a: MegaStateDescriptor): number {
  for (let i = 0; i < a.attachmentsState.length; i++)
    hash = attachmentStateHash(hash, a.attachmentsState[i]);
  hash = colorHash(hash, a.blendConstant || TransparentBlack);
  hash = hashCodeNumberUpdate(hash, a.depthCompare);
  hash = hashCodeNumberUpdate(hash, a.depthWrite ? 1 : 0);
  hash = hashCodeNumberUpdate(hash, a.stencilFront?.compare);
  hash = hashCodeNumberUpdate(hash, a.stencilFront?.passOp);
  hash = hashCodeNumberUpdate(hash, a.stencilFront?.failOp);
  hash = hashCodeNumberUpdate(hash, a.stencilFront?.depthFailOp);
  hash = hashCodeNumberUpdate(hash, a.stencilBack?.compare);
  hash = hashCodeNumberUpdate(hash, a.stencilBack?.passOp);
  hash = hashCodeNumberUpdate(hash, a.stencilBack?.failOp);
  hash = hashCodeNumberUpdate(hash, a.stencilBack?.depthFailOp);
  hash = hashCodeNumberUpdate(hash, a.stencilWrite ? 1 : 0);
  hash = hashCodeNumberUpdate(hash, a.cullMode);
  hash = hashCodeNumberUpdate(hash, a.frontFace ? 1 : 0);
  hash = hashCodeNumberUpdate(hash, a.polygonOffset ? 1 : 0);
  return hash;
}

function renderPipelineDescriptorHash(a: RenderPipelineDescriptor): number {
  let hash = 0;
  hash = hashCodeNumberUpdate(hash, a.program.id);
  if (a.inputLayout !== null) hash = hashCodeNumberUpdate(hash, a.inputLayout.id);
  hash = megaStateDescriptorHash(hash, a.megaStateDescriptor!);
  for (let i = 0; i < a.colorAttachmentFormats.length; i++)
    hash = hashCodeNumberUpdate(hash, a.colorAttachmentFormats[i] || 0);
  hash = hashCodeNumberUpdate(hash, a.depthStencilAttachmentFormat || 0);
  return hashCodeNumberFinish(hash);
}

function bindingsDescriptorHash(a: BindingsDescriptor): number {
  let hash = 0;
  if (a.samplerBindings) {
    for (let i = 0; i < a.samplerBindings.length; i++) {
      const binding = a.samplerBindings[i];
      if (binding !== null && binding.texture !== null)
        hash = hashCodeNumberUpdate(hash, binding.texture.id);
    }
  }
  if (a.uniformBufferBindings) {
    for (let i = 0; i < a.uniformBufferBindings.length; i++) {
      const binding = a.uniformBufferBindings[i];
      if (binding !== null && binding.buffer !== null) {
        hash = hashCodeNumberUpdate(hash, binding.buffer.id);
        hash = hashCodeNumberUpdate(hash, binding.binding);
        hash = hashCodeNumberUpdate(hash, binding.offset);
        hash = hashCodeNumberUpdate(hash, binding.size);
      }
    }
  }
  if (a.storageBufferBindings) {
    for (let i = 0; i < a.storageBufferBindings.length; i++) {
      const binding = a.storageBufferBindings[i];
      if (binding !== null && binding.buffer !== null) {
        hash = hashCodeNumberUpdate(hash, binding.buffer.id);
        hash = hashCodeNumberUpdate(hash, binding.binding);
        hash = hashCodeNumberUpdate(hash, binding.offset);
        hash = hashCodeNumberUpdate(hash, binding.size);
      }
    }
  }
  if (a.storageTextureBindings) {
    for (let i = 0; i < a.storageTextureBindings.length; i++) {
      const binding = a.storageTextureBindings[i];
      if (binding !== null && binding.texture !== null) {
        hash = hashCodeNumberUpdate(hash, binding.texture.id);
        hash = hashCodeNumberUpdate(hash, binding.binding);
      }
    }
  }
  return hashCodeNumberFinish(hash);
}

function programDescriptorEquals(a: ProgramDescriptor, b: ProgramDescriptor): boolean {
  return a.vertex?.glsl === b.vertex?.glsl && a.fragment?.glsl === b.fragment?.glsl;
}

function programDescriptorCopy(a: Readonly<ProgramDescriptor>): ProgramDescriptor {
  return {
    vertex: {
      glsl: a.vertex?.glsl,
    },
    fragment: {
      glsl: a.fragment?.glsl,
    },
  };
}

export class RenderCache {
  constructor(private device: Device) {}

  private bindingsCache = new HashMap<BindingsDescriptor, Bindings>(
    bindingsDescriptorEquals,
    bindingsDescriptorHash,
  );

  private renderPipelinesCache = new HashMap<RenderPipelineDescriptor, RenderPipeline>(
    renderPipelineDescriptorEquals,
    renderPipelineDescriptorHash,
  );

  private inputLayoutsCache = new HashMap<InputLayoutDescriptor, InputLayout>(
    inputLayoutDescriptorEquals,
    nullHashFunc,
  );

  private programCache = new HashMap<ProgramDescriptor, Program>(
    programDescriptorEquals,
    nullHashFunc,
  );

  createBindings(descriptor: BindingsDescriptor): Bindings {
    let bindings = this.bindingsCache.get(descriptor);
    if (bindings === null) {
      const descriptorCopy = bindingsDescriptorCopy(descriptor);

      descriptorCopy.uniformBufferBindings = descriptorCopy.uniformBufferBindings?.filter(
        ({ size }) => size && size > 0,
      );

      bindings = this.device.createBindings(descriptorCopy);
      this.bindingsCache.add(descriptorCopy, bindings);
    }
    return bindings;
  }

  createRenderPipeline(descriptor: RenderPipelineDescriptor): RenderPipeline {
    let renderPipeline = this.renderPipelinesCache.get(descriptor);
    if (renderPipeline === null) {
      const descriptorCopy = renderPipelineDescriptorCopy(descriptor);
      descriptorCopy.colorAttachmentFormats = descriptorCopy.colorAttachmentFormats.filter(
        (f) => f,
      );
      renderPipeline = this.device.createRenderPipeline(descriptorCopy);
      this.renderPipelinesCache.add(descriptorCopy, renderPipeline);
    }
    return renderPipeline;
  }

  createInputLayout(descriptor: InputLayoutDescriptor): InputLayout {
    // remove hollows
    descriptor.vertexBufferDescriptors = descriptor.vertexBufferDescriptors.filter((d) => !!d);
    let inputLayout = this.inputLayoutsCache.get(descriptor);
    if (inputLayout === null) {
      const descriptorCopy = inputLayoutDescriptorCopy(descriptor);
      inputLayout = this.device.createInputLayout(descriptorCopy);
      this.inputLayoutsCache.add(descriptorCopy, inputLayout);
    }
    return inputLayout;
  }

  createProgram(descriptor: ProgramDescriptor): Program {
    let program = this.programCache.get(descriptor);
    if (program === null) {
      const descriptorCopy = programDescriptorCopy(descriptor);
      program = this.device.createProgram(descriptor);
      this.programCache.add(descriptorCopy, program);
    }
    return program;
  }

  destroy(): void {
    for (const bindings of this.bindingsCache.values()) bindings.destroy();
    for (const renderPipeline of this.renderPipelinesCache.values()) renderPipeline.destroy();
    for (const inputLayout of this.inputLayoutsCache.values()) inputLayout.destroy();
    for (const program of this.programCache.values()) program.destroy();
    // for (const sampler of this.samplerCache.values()) sampler.destroy();
    this.bindingsCache.clear();
    this.renderPipelinesCache.clear();
    this.inputLayoutsCache.clear();
    this.programCache.clear();
    // this.samplerCache.clear();
  }
}
