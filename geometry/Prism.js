import { vec3, vec4, subtract, cross, normalize } from "../mvNew.js";

/*
  Triangular Prism
  - height: Y ekseni boyunca
  - base: eşkenar üçgen (XZ düzleminde)
*/
export function createTriangularPrism(size = 1.0, height = 1.0) {

  const h = height / 2;
  const s = size;

  const positions = [];
  const normals   = [];

  // --- Üçgen taban noktaları (XZ düzlemi) ---
  const A = vec3(-s/2, -h, -s/2);
  const B = vec3( s/2, -h, -s/2);
  const C = vec3( 0,   -h,  s/2);

  const A2 = vec3(A[0], h, A[2]);
  const B2 = vec3(B[0], h, B[2]);
  const C2 = vec3(C[0], h, C[2]);

  // ---------- Yardımcı ----------
  function pushTriangle(p1, p2, p3) {
    const n = normalize(cross(subtract(p2, p1), subtract(p3, p1)));
    positions.push(vec4(...p1, 1), vec4(...p2, 1), vec4(...p3, 1));
    normals.push(n, n, n);
  }

  function pushQuad(p1, p2, p3, p4) {
    const n = normalize(cross(subtract(p2, p1), subtract(p3, p1)));

    positions.push(
      vec4(...p1, 1), vec4(...p2, 1), vec4(...p3, 1),
      vec4(...p3, 1), vec4(...p4, 1), vec4(...p1, 1)
    );

    normals.push(n, n, n, n, n, n);
  }

  // ---------- Alt üçgen ----------
  pushTriangle(A, C, B); // CCW dışa bakacak şekilde

  // ---------- Üst üçgen ----------
  pushTriangle(A2, B2, C2);

  // ---------- Yan yüzler ----------
  pushQuad(A, B, B2, A2); // yüz 1
  pushQuad(B, C, C2, B2); // yüz 2
  pushQuad(C, A, A2, C2); // yüz 3

  return {
    positions,
    normals
  };
}
