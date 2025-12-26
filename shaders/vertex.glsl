#version 300 es

in vec4 vPos;
in vec4 vCol;
in vec3 vNormal;

out vec4 fCol;
out vec3 fNormal;
out vec3 fPos;
  
uniform mat3 normalMatrix;         
uniform mat4 M;
uniform mat4 V;
uniform mat4 P;

void main() {
    vec4 worldPos = M * vPos;
    fPos = worldPos.xyz;
 
    fNormal = normalize(normalMatrix * vNormal);
    // fNormal = mat3(M) * vNormal;

    fCol = vCol;

    gl_Position = P * V * worldPos;
}