#version 300 es
precision highp float;

in vec3 fNormal;
in vec3 fPos;
in vec2 fUV;

uniform vec3 objectColor;
out vec4 fragColor;

uniform vec3 lightPos, viewPos;

uniform sampler2D albedoMap;
uniform bool useTexture;

uniform float shininess, specularStrength;

void main() {

    // normalize everything
    vec3 N = normalize(fNormal);
    vec3 L = normalize(lightPos - fPos);
    vec3 V = normalize(viewPos - fPos);

    // ===== Ambient and Diffuse =====
    vec3 ambient, diffuse;
    float diff = max(dot(N, L), 0.0);
    if (useTexture) 
    {
        vec3 baseColor = texture(albedoMap, fUV).rgb;
        ambient = 0.2 * baseColor;
        diffuse = diff * baseColor;
    }
    else 
    { 
        ambient = 0.2 * objectColor;
        diffuse = diff * objectColor;
    }

    // ===== Specular (Blinn–Phong) =====
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), shininess);
    vec3 specular = specularStrength * spec * vec3(1.0);
    // vec3 specular = specularStrength * spec * vec3(1.0, 0.0, 0.0); // specular debug


    // ===== Final color =====
    vec3 result = ambient + diffuse + specular;
    fragColor = vec4(result, 1.0);
}
