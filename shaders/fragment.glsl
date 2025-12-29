#version 300 es
precision highp float;

in vec3 fNormal;
in vec3 fPos;
in vec2 fUV;

out vec4 fragColor;

// ===== Material =====
uniform vec3 objectColor;
uniform sampler2D albedoMap;
uniform bool useTexture;

uniform float shininess;
uniform float specularStrength;

// ===== Camera =====
uniform vec3 viewPos;

// ===== Light system =====
uniform int lightType;        // 0 = Directional, 1 = Point

// Directional light
uniform vec3 lightDir;

// Point light
uniform vec3 lightPos;
uniform float constant;
uniform float linear;
uniform float quadratic;

void main() {

    // ===== Normal & View =====
    vec3 N = normalize(fNormal);
    vec3 V = normalize(viewPos - fPos);

    // ===== Base color =====
    vec3 baseColor = useTexture
        ? texture(albedoMap, fUV).rgb
        : objectColor;

    // ===== Light direction & attenuation =====
    vec3 L;
    float attenuation = 1.0;

    if (lightType == 0) {
        // Directional light (sun)
        L = normalize(lightDir);
    }
    else {
        // Point light
        vec3 lightVec = lightPos - fPos;
        float distance = length(lightVec);
        L = normalize(lightVec);

        attenuation = 1.0 / (
            constant +
            linear * distance +
            quadratic * distance * distance
        );
    }

    // ===== Ambient =====
    vec3 ambient = 0.2 * baseColor;

    // ===== Diffuse =====
    float diff = max(dot(N, L), 0.0);
    vec3 diffuse = diff * baseColor * attenuation;

    // ===== Specular (Blinn–Phong) =====
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), shininess);
    vec3 specular = specularStrength * spec * vec3(1.0) * attenuation;

    // ===== Final color =====
    fragColor = vec4(ambient + diffuse + specular, 1.0);
}
