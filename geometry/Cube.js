import { vec4, vec3 } from "../mvNew.js";

export function createCube(size = 1.0) {

    const h = size / 2;

    const positions = [];
    const normals   = [];
    const indices   = [];

    let indexOffset = 0;

    const faces = [
        // +Z (front)
        {
            n: [0, 0, 1],
            v: [
                [-h, -h,  h],
                [ h, -h,  h],
                [ h,  h,  h],
                [-h,  h,  h],
            ]
        },
        // -Z (back)
        {
            n: [0, 0, -1],
            v: [
                [ h, -h, -h],
                [-h, -h, -h],
                [-h,  h, -h],
                [ h,  h, -h],
            ]
        },
        // +X (right)
        {
            n: [1, 0, 0],
            v: [
                [ h, -h,  h],
                [ h, -h, -h],
                [ h,  h, -h],
                [ h,  h,  h],
            ]
        },
        // -X (left)
        {
            n: [-1, 0, 0],
            v: [
                [-h, -h, -h],
                [-h, -h,  h],
                [-h,  h,  h],
                [-h,  h, -h],
            ]
        },
        // +Y (top)
        {
            n: [0, 1, 0],
            v: [
                [-h,  h,  h],
                [ h,  h,  h],
                [ h,  h, -h],
                [-h,  h, -h],
            ]
        },
        // -Y (bottom)
        {
            n: [0, -1, 0],
            v: [
                [-h, -h, -h],
                [ h, -h, -h],
                [ h, -h,  h],
                [-h, -h,  h],
            ]
        }
    ];

    for (const face of faces) {

        // 4 vertex
        for (const v of face.v) {
            positions.push(vec4(v[0], v[1], v[2], 1.0));
            normals.push(vec3(face.n[0], face.n[1], face.n[2]));
        }

        // 2 triangle (CCW)
        indices.push(
            indexOffset + 0,
            indexOffset + 1,
            indexOffset + 2,
            indexOffset + 0,
            indexOffset + 2,
            indexOffset + 3
        );

        indexOffset += 4;
    }

    return {
        positions,
        normals,
        indices
    };
}
