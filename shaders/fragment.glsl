#version 300 es
precision highp float;

in vec4 fCol;
in vec3 fNormal;
in vec3 fPos;

out vec4 fragColor;

uniform vec3 lightPos;
uniform vec3 viewPos;

// specular parametreler
uniform float shininess;
uniform float specularStrength;

void main() {

    // normalize everything
    vec3 N = normalize(fNormal);
    vec3 L = normalize(lightPos - fPos);
    vec3 V = normalize(viewPos - fPos);

    // ===== Ambient =====
    vec3 ambient = 0.2 * fCol.rgb;

    // ===== Diffuse =====
    float diff = max(dot(N, L), 0.0);
    vec3 diffuse = diff * fCol.rgb;

    // ===== Specular (Blinn–Phong) =====
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), shininess);
    vec3 specular = specularStrength * spec * vec3(1.0);

    // ===== Final color =====
    vec3 result = ambient + diffuse + specular;
    fragColor = vec4(result, 1.0);
}
