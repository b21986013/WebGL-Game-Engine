import { vec3, vec4, normalize } from "../mvNew.js";

export function createCylinder(
    radius = 1.0,
    height = 2.0,
    segments = 32
) {
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    const halfH = height / 2;

    // =========================
    // 1) SIDE SURFACE
    // =========================
    const sideStart = 0;

    for (let i = 0; i <= segments; i++) {
        const theta = i * 2 * Math.PI / segments;
        const x = Math.cos(theta);
        const z = Math.sin(theta);

        const normal = normalize(vec3(x, 0, z));
        const u = i / segments;

        // bottom
        positions.push(vec4(radius * x, -halfH, radius * z, 1.0));
        normals.push(normal);
        uvs.push([u, 0]);

        // top
        positions.push(vec4(radius * x, halfH, radius * z, 1.0));
        normals.push(normal);
        uvs.push([u, 1]);
    }

    for (let i = 0; i < segments; i++) {
        const a = sideStart + i * 2;
        const b = a + 1;
        const c = a + 2;
        const d = a + 3;

        indices.push(a, b, c);
        indices.push(b, d, c);
    }

    // =========================
    // 2) TOP CAP
    // =========================
    const topCenterIndex = positions.length;
    positions.push(vec4(0, halfH, 0, 1));
    normals.push(vec3(0, 1, 0));
    uvs.push([0.5, 0.5]);

    const topStart = positions.length;

    for (let i = 0; i <= segments; i++) {
        const theta = i * 2 * Math.PI / segments;
        const x = Math.cos(theta);
        const z = Math.sin(theta);

        positions.push(vec4(radius * x, halfH, radius * z, 1));
        normals.push(vec3(0, 1, 0));

        uvs.push([
            0.5 + 0.5 * (x),
            0.5 + 0.5 * (z)
        ]);
    }

    for (let i = 0; i < segments; i++) {
        indices.push(
            topCenterIndex,
            topStart + i,
            topStart + i + 1
        );
    }

    // =========================
    // 3) BOTTOM CAP
    // =========================
    const bottomCenterIndex = positions.length;
    positions.push(vec4(0, -halfH, 0, 1));
    normals.push(vec3(0, -1, 0));
    uvs.push([0.5, 0.5]);

    const bottomStart = positions.length;

    for (let i = 0; i <= segments; i++) {
        const theta = i * 2 * Math.PI / segments;
        const x = Math.cos(theta);
        const z = Math.sin(theta);

        positions.push(vec4(radius * x, -halfH, radius * z, 1));
        normals.push(vec3(0, -1, 0));

        uvs.push([
            0.5 + 0.5 * (x),
            0.5 + 0.5 * (z)
        ]);
    }

    for (let i = 0; i < segments; i++) {
        indices.push(
            bottomCenterIndex,
            bottomStart + i + 1,
            bottomStart + i
        );
    }

    return {
        positions,
        normals,
        uvs,
        indices
    };
}
