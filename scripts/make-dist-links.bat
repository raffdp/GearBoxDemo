mkdir "../dist"

mkdir "../dist/zea-engine"
mklink /J "../dist/zea-engine/dist" "../node_modules/@zeainc/zea-engine/dist"
mklink /J "../dist/zea-engine/public-resources" "../node_modules/@zeainc/zea-engine/public-resources"

mkdir "../dist/zea-components"
mklink /J "../dist/zea-web-components/dist" "../node_modules/@zeainc/zea-web-components/dist"

mkdir "../dist/zea-cad"
mklink /J "../dist/zea-cad/dist" "../node_modules/@zeainc/zea-cad/dist"

mkdir "../dist/zea-ux"
mklink /J "../dist/zea-ux/dist" "../node_modules/@zeainc/zea-ux/dist"

mkdir "../dist/zea-collab"
mklink /J "../dist/zea-collab/dist" "../node_modules/@zeainc/zea-collab/dist"