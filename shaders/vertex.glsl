#version 300 es

in vec2 vUV;
out vec2 fUV;

in vec4 vPos;
in vec3 vNormal;

out vec3 fNormal;
out vec3 fPos;
  
uniform mat3 normalMatrix;         
uniform mat4 M, V, P;


void main() {
    vec4 worldPos = M * vPos;
    fPos = worldPos.xyz;
 
    fNormal = normalize(normalMatrix * vNormal);

    fUV = vUV;

    gl_Position = P * V * worldPos;
}