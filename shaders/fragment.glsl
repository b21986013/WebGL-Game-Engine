#version 300 es
precision highp float;

in vec4 fCol;
in vec3 fNormal;
in vec3 fPos;

out vec4 fragColor;

uniform vec3 viewPos;
uniform vec3 lightPos;

void main() {
    vec3 N = normalize(fNormal);
    vec3 L = normalize(lightPos - fPos);

    float diff = max(dot(N, L), 0.0);

    vec3 diffuse = diff * fCol.rgb;
    vec3 ambient = 0.2 * fCol.rgb;

    fragColor = vec4(ambient + diffuse, 1.0);
}
