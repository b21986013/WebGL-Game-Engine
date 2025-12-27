import { vec3, vec4, normalize } from '../mvNew.js';

export function createSphere(radius = 1.0, latBands = 24, lonBands = 24) {

    const positions = [];
    const normals   = [];
    const indices   = [];

    // ===== Vertex generation =====
    for (let lat = 0; lat <= latBands; lat++) {
        const theta = lat * Math.PI / latBands;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);

        for (let lon = 0; lon <= lonBands; lon++) {
            const phi = lon * 2 * Math.PI / lonBands;
            const sinP = Math.sin(phi);
            const cosP = Math.cos(phi);

            const x = cosP * sinT;
            const y = cosT;
            const z = sinP * sinT;

            const normal = normalize(vec3(x, y, z));

            positions.push(vec4(
                radius * x,
                radius * y,
                radius * z,
                1.0
            ));

            normals.push(normal);
        }
    }

    // ===== Index generation =====
    for (let lat = 0; lat < latBands; lat++) {
        for (let lon = 0; lon < lonBands; lon++) {
            const first  = lat * (lonBands + 1) + lon;
            const second = first + lonBands + 1;

            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return {
        positions,
        normals,
        indices
    };
}
