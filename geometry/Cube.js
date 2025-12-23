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

    function quad(a, b, c, d, color) {
        positions.push(vertices[a]); colors.push(color);
        positions.push(vertices[b]); colors.push(color);
        positions.push(vertices[c]); colors.push(color);

        positions.push(vertices[a]); colors.push(color);
        positions.push(vertices[c]); colors.push(color);
        positions.push(vertices[d]); colors.push(color);
    }

    quad(1, 0, 3, 2, faceColors[0]); // front
    quad(2, 3, 7, 6, faceColors[1]); // right
    quad(3, 0, 4, 7, faceColors[2]); // back
    quad(6, 5, 1, 2, faceColors[3]); // left
    quad(4, 5, 6, 7, faceColors[4]); // top
    quad(5, 4, 0, 1, faceColors[5]); // bottom

    return { positions, colors };
}
