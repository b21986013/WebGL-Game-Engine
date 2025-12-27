import { vec3, vec4 } from "../mvNew.js";

export async function loadOBJ(url) {
    const response = await fetch(url);
    const text = await response.text();

    const lines = text.split('\n');

    const tempPositions = [];
    const tempNormals = [];

    const positions = [];
    const normals = [];
    const indices = [];

    const vertexMap = new Map(); // "v/vn" → index
    let indexCounter = 0;

    for (let line of lines) {
        line = line.trim();
        if (line === "" || line.startsWith("#")) continue;

        const parts = line.split(/\s+/);

        switch (parts[0]) {

            case "v": {
                tempPositions.push(
                    vec4(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3]),
                        1.0
                    )
                );
                break;
            }

            case "vn": {
                tempNormals.push(
                    vec3(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    )
                );
                break;
            }

            case "f": {
                // f v1 v2 v3 v4 ... vn
                const faceVerts = parts.slice(1);

                // Fan triangulation:
                // (0, i, i+1)
                for (let i = 1; i < faceVerts.length - 1; i++) {
                    const tri = [
                        faceVerts[0],
                        faceVerts[i],
                        faceVerts[i + 1]
                    ];

                    for (const key of tri) {
                        if (!vertexMap.has(key)) {
                            const [vIdx, , nIdx] = key.split('/').map(x => x ? parseInt(x) - 1 : null);

                            positions.push(tempPositions[vIdx]);
                            normals.push(tempNormals[nIdx]);

                            vertexMap.set(key, indexCounter++);
                        }

                        indices.push(vertexMap.get(key));
                    }
                }
                break;
            }
        }
    }

    return {
        positions,
        normals,
        indices
    };
}
