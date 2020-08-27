mkdir -p "$PWD/dist"

mkdir -p "$PWD/dist/zea-engine"
ln -sf "$PWD/node_modules/@zeainc/zea-engine/dist" "$PWD/dist/zea-engine/dist"
ln -sf  "$PWD/node_modules/@zeainc/zea-engine/public-resources" "$PWD/dist/zea-engine/public-resources"

mkdir -p "$PWD/dist/zea-statemachine"
ln -sf "$PWD/node_modules/@zeainc/zea-statemachine/dist" "$PWD/dist/zea-statemachine/dist"

mkdir -p "$PWD/dist/zea-web-components"
ln -sf  "$PWD/node_modules/@zeainc/zea-web-components/dist" "$PWD/dist/zea-web-components/dist"

mkdir -p "$PWD/dist/zea-cad"
ln -sf "$PWD/node_modules/@zeainc/zea-cad/dist" "$PWD/dist/zea-cad/dist"

mkdir -p "$PWD/dist/zea-kinematics"
ln -sf "$PWD/node_modules/@zeainc/zea-kinematics/dist" "$PWD/dist/zea-kinematics/dist"

mkdir -p "$PWD/dist/zea-ux"
ln -sf "$PWD/node_modules/@zeainc/zea-ux/dist" "$PWD/dist/zea-ux/dist"

mkdir -p "$PWD/dist/zea-collab"
ln -sf "$PWD/node_modules/@zeainc/zea-collab/dist" "$PWD/dist/zea-collab/dist"
