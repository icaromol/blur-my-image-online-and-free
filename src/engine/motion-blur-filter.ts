import { defaultFilterVert, GlProgram } from "pixi.js";
import { MotionBlurFilter, type MotionBlurFilterOptions } from "pixi-filters";

// pixi-filters' motion blur shader with one change: samples are clamped to the input frame
// (uInputClamp), so streaks repeat the edge pixels instead of fading to transparent.
const fragment = `precision highp float;
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform vec2 uVelocity;
uniform int uKernelSize;
uniform float uOffset;
uniform vec4 uInputSize;
uniform vec4 uInputClamp;

const int MAX_KERNEL_SIZE = 2048;

vec4 sampleClamped(vec2 coord) {
  return texture(uTexture, clamp(coord, uInputClamp.xy, uInputClamp.zw));
}

void main(void)
{
  vec4 color = sampleClamped(vTextureCoord);
  if (uKernelSize == 0) {
    finalColor = color;
    return;
  }
  vec2 velocity = uVelocity / uInputSize.xy;
  float offset = -uOffset / length(uVelocity) - 0.5;
  int k = uKernelSize - 1;
  for (int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {
    if (i == k) break;
    vec2 bias = velocity * (float(i) / float(k) + offset);
    color += sampleClamped(vTextureCoord + bias);
  }
  finalColor = color / float(uKernelSize);
}
`;

let glProgram: GlProgram | undefined;

export class EdgeClampedMotionBlurFilter extends MotionBlurFilter {
  constructor(options: MotionBlurFilterOptions) {
    super(options);
    glProgram ??= GlProgram.from({
      vertex: defaultFilterVert,
      fragment,
      name: "edge-clamped-motion-blur",
    });
    this.glProgram = glProgram;
    this.padding = 0;
  }
}
