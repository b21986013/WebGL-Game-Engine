#version 300 es

in  vec4 vPos;
in  vec4 vCol;
out vec4 fCol;

uniform mat4 V;
uniform mat4 P;
uniform mat4 M;

void main()
{
    gl_Position = P*V*M*vPos;
    fCol = vCol;
}