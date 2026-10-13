/*
 * "Puff print" lighting, ported from the Flashbulb scene at
 * svsdschool.github.io/competition. Art drawn into a 2D canvas is blurred into a
 * height map and lit by a lamp that follows the cursor, so it reads as raised,
 * glossy, rounded ink. Shared by the hero (PuffLayer) and the intro's A (IntroSplash).
 */

const VERT = `#version 300 es
in vec2 a;
void main(){ gl_Position = vec4(a, 0., 1.); }`

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uField, uColor;
uniform vec2 uRes, uMouse;
uniform vec4 uRect;      // bounds of everything drawn (device px, y up): x, y, w, h
uniform float uHover, uInflate, uDpr, uView;
out vec4 o;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
}
vec2 UV(vec2 p){ return vec2(p.x/uRes.x, 1. - p.y/uRes.y); }
// R: crisp coverage, G: blurred height source (dark ink stands taller than light colours)
vec4 F(vec2 p){ return texture(uField, UV(p)); }
// how high the ink stands: steep at the edge, rounded over the top
float puffH(vec2 q){ return sqrt(clamp((F(q).g - 0.4)/0.6, 0., 1.)); }

void main(){
  vec2 p = gl_FragCoord.xy;
  vec4 f = F(p);
  if (f.r < 0.002) { o = vec4(0.); return; }
  vec3 base = texture(uColor, UV(p)).rgb;
  float lum = dot(base, vec3(0.3, 0.59, 0.11));
  vec2 P = p/uDpr;
  vec2 rel = (p - uMouse)/uDpr;

  // glossy sheen right under the cursor, from the soft height field
  float e = 2.*uDpr;
  vec3 nn = normalize(vec3(-(F(p + vec2(e, 0.)).g - F(p - vec2(e, 0.)).g)*6., -(F(p + vec2(0., e)).g - F(p - vec2(0., e)).g)*6., 1.));
  vec3 L = normalize(vec3((uMouse - p)/uView*2., .55));
  float spec = pow(max(dot(reflect(-L, nn), vec3(0., 0., 1.)), 0.), 9.);

  // raised, rounded ink with a fine foamy grain, lit by a lamp at the cursor
  vec2 Lxy = mix(uRect.xy + uRect.zw*vec2(0.2, 0.95), uMouse, uHover);   // away from it, the light sits up and to the left
  float e2 = 2.5*uDpr;
  float hx = puffH(p + vec2(e2, 0.)) - puffH(p - vec2(e2, 0.));
  float hy = puffH(p + vec2(0., e2)) - puffH(p - vec2(0., e2));
  vec2 fq = P*0.45;
  float g0 = noise(fq), gx = noise(fq + vec2(0.3, 0.)), gy = noise(fq + vec2(0., 0.3));
  vec3 n = normalize(vec3((-hx*3.2 - (gx - g0)*0.3)*uInflate, (-hy*3.2 - (gy - g0)*0.3)*uInflate, 1.));
  vec3 Ld = normalize(vec3(Lxy - p, 240.*uDpr));
  float fall = 1./(1. + pow(length(Lxy - p)/(650.*uDpr), 2.));
  float dif = max(dot(n, Ld), 0.);
  float sp = pow(max(dot(n, normalize(Ld + vec3(0., 0., 1.))), 0.), 20.);
  float rim = smoothstep(0.02, 0.35, 1. - n.z);                      // satin: the sheen lives on the rounded edges
  // shade relative to a flat top, so every piece keeps its own colour wherever the cursor is
  // and only the rounded edges turn toward or away from the lamp (light colours more gently)
  float shade = 1. + (dif - Ld.z)*mix(1.1, 0.35, lum);
  vec3 ink = (vec3(0.07, 0.07, 0.075) + base*0.93)*shade + sp*(0.06 + 0.5*rim)*fall*uInflate;
  float wet = clamp(exp(-dot(rel, rel)/(2.*120.*120.))*uHover*1.4, 0., 1.);
  ink += vec3(0.62, 0.64, 0.7)*(spec*0.56 + exp(-dot(rel, rel)/(2.*170.*170.))*0.1)*wet*(1. - 0.6*lum);

  float blk = 1. - smoothstep(0.6, 0.75, lum);                         // black and grey puff and shine; light colours don't
  vec3 col = mix(base, clamp(ink, 0., 1.), uInflate*blk);              // at rest: exactly the original art
  o = vec4(col*f.r, f.r);                                               // premultiplied
}`

export function canvas2d(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

function blurred(src: HTMLCanvasElement, px: number) {
  const c = canvas2d(src.width, src.height)
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  if (typeof ctx.filter === 'string') {
    ctx.filter = `blur(${px}px)`
    ctx.drawImage(src, 0, 0)
    return ctx
  }
  // no canvas filters (older Safari): downscale and back up for a cheap blur
  const s = Math.max(2, Math.round(px / 2))
  const small = canvas2d(Math.ceil(src.width / s), Math.ceil(src.height / s))
  small.getContext('2d')!.drawImage(src, 0, 0, small.width, small.height)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(small, 0, 0, c.width, c.height)
  return ctx
}

export type PuffFrame = {
  mouse: { x: number; y: number } // device px, y down
  rect: { x: number; y: number; w: number; h: number } // the art's bounds, device px, y down
  hover: number // 0 → 1: how much the lamp follows the cursor
  inflate: number // 0 = the flat original art, 1 = fully puffed
  unit: number // device px per css px of the art
}

/** Sets up WebGL on `canvas`; returns null when it isn't available, so callers keep the plain art. */
export function createPuffRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, alpha: true })
  if (!gl) return null

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s))
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const aLoc = gl.getAttribLocation(prog, 'a')
  gl.enableVertexAttribArray(aLoc)
  gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0)
  const u = Object.fromEntries(
    ['uField', 'uColor', 'uRes', 'uMouse', 'uRect', 'uHover', 'uInflate', 'uDpr', 'uView'].map((n) => [n, gl.getUniformLocation(prog, n)]),
  )
  const makeTex = (unit: number) => {
    const t = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    return t
  }
  const fieldTex = makeTex(0)
  const colorTex = makeTex(1)
  gl.uniform1i(u.uField, 0)
  gl.uniform1i(u.uColor, 1)
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)

  return {
    /** Takes art drawn at the canvas's backing size and builds its height map. */
    upload(art: HTMLCanvasElement, blurPx: number) {
      const W = art.width, H = art.height
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W
        canvas.height = H
      }
      // height source: the black and grey stand up; the light pink and white stay flat
      const c = art.getContext('2d', { willReadFrequently: true })!.getImageData(0, 0, W, H).data
      const hsrc = new ImageData(W, H)
      const hd = hsrc.data
      for (let i = 0; i < c.length; i += 4) {
        const lum = (c[i] * 0.3 + c[i + 1] * 0.59 + c[i + 2] * 0.11) / 255
        hd[i + 3] = c[i + 3] * Math.min(1, Math.max(0, (0.75 - lum) / 0.15))
      }
      const hc = canvas2d(W, H)
      hc.getContext('2d')!.putImageData(hsrc, 0, 0)
      const b = blurred(hc, blurPx).getImageData(0, 0, W, H).data
      const field = new Uint8Array(W * H * 4)
      for (let i = 0; i < field.length; i += 4) {
        field[i] = c[i + 3]
        field[i + 1] = b[i + 3]
        field[i + 3] = 255
      }
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, fieldTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, field)
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, colorTex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(c.buffer))
      gl.viewport(0, 0, W, H)
    },
    draw(f: PuffFrame) {
      const H = canvas.height
      gl.uniform2f(u.uRes, canvas.width, H)
      gl.uniform2f(u.uMouse, f.mouse.x, H - f.mouse.y)
      gl.uniform4f(u.uRect, f.rect.x, H - f.rect.y - f.rect.h, f.rect.w, f.rect.h)
      gl.uniform1f(u.uHover, f.hover)
      gl.uniform1f(u.uInflate, f.inflate)
      gl.uniform1f(u.uDpr, f.unit)
      gl.uniform1f(u.uView, window.innerHeight * (window.devicePixelRatio || 1))
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
  }
}
