// geometry/Cube.js

function createColoredCube() {

    const vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4( 0.5,  0.5,  0.5, 1.0),
        vec4( 0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4( 0.5,  0.5, -0.5, 1.0),
        vec4( 0.5, -0.5, -0.5, 1.0)
    ];

    const faceColors = [
        vec4(1, 0, 0, 1), // front
        vec4(0, 1, 0, 1), // right
        vec4(0, 0, 1, 1), // back
        vec4(1, 1, 0, 1), // left
        vec4(1, 0, 1, 1), // top
        vec4(0, 1, 1, 1)  // bottom
    ];

    const positions = [];
    const colors = [];
    const normals = [];

    function quad(a, b, c, d, color, normal) {
    positions.push(vertices[a]); colors.push(color); normals.push(normal);
    positions.push(vertices[b]); colors.push(color); normals.push(normal);
    positions.push(vertices[c]); colors.push(color); normals.push(normal);

    positions.push(vertices[a]); colors.push(color); normals.push(normal);
    positions.push(vertices[c]); colors.push(color); normals.push(normal);
    positions.push(vertices[d]); colors.push(color); normals.push(normal);
}


quad(0, 1, 2, 3, faceColors[0], vec3(0, 0, 1));
quad(3, 2, 6, 7, faceColors[1], vec3(1, 0, 0));

quad(7, 6, 5, 4, faceColors[2], vec3(0, 0, -1));

quad(4, 5, 1, 0, faceColors[3], vec3(-1, 0, 0));

quad(1, 5, 6, 2, faceColors[4], vec3(0, 1, 0));

quad(4, 0, 3, 7, faceColors[5], vec3(0, -1, 0));


    return {
        positions,
        colors,
        normals
    };
}
