// Single indirection to the cross-service shared package. In both the host layout and
// the container, backend/src and shared sit as siblings under the project root, so this
// relative path resolves the same in both places.
export * from "../../shared/index.js";
