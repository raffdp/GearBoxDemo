
import { Color, Vec3, EnvMap, Scene, GLRenderer, PassType } from "https://unpkg.com/@zeainc/zea-engine/dist/index.esm.js"
import { GLCADPass, CADAsset } from "https://unpkg.com/@zeainc/zea-cad/dist/index.rawimport.js"

import loadModel from "./1-loadModel.js"
import setupMaterials from "./2-setupMaterials.js"
import setupCutaway from "./3-setupCutaway.js"
import setupGears from "./4-setupGears.js"
import setupExplode from "./5-setupExplode.js"
import setupStates from "./6-setupStates.js"

const domElement = document.getElementById("renderer");

const scene = new Scene();
// scene.setupGrid(1.0, 10);

const renderer = new GLRenderer( domElement, {
  webglOptions: {
    antialias: true, 
    canvasPosition: 'relative',
  },
});

renderer.getViewport().getCamera().setPositionAndTarget(new Vec3({"x":0.56971,"y":-0.83733,"z":0.34243}), new Vec3({"x":0.03095,"y":-0.05395,"z":0}))

scene.getSettings().getParameter('BackgroundColor').setValue(new Color('#D9EAFA'))

const cadPass = new GLCADPass(true)
cadPass.setShaderPreprocessorValue('#define ENABLE_CUTAWAYS');
cadPass.setShaderPreprocessorValue('#define ENABLE_PBR');
renderer.addPass(cadPass, PassType.OPAQUE)

renderer.setScene(scene);
renderer.resumeDrawing();

renderer.getViewport().on('mouseDownOnGeom', (event)=>{
  const intersectionData = event.intersectionData;
  const geomItem = intersectionData.geomItem
  console.log(geomItem.getPath());
});

////////////////////////////////////
// Load the Model
// Page 1 - load and setup the cad Model.
const asset = loadModel();
asset.once('loaded', ()=>{
  renderer.frameAll()
})

window.setRenderingMode = setupMaterials(asset, scene)
setupCutaway(asset);
setupGears(asset);
setupExplode(asset);
const stateMachine = setupStates(asset, renderer);

scene.getRoot().addChild(asset)

// // https://grabcad.com/library/two-speed-gear-box-1

////////////////////////////////////
// Setup the Left side Tree view.
import { SelectionManager, UndoRedoManager } from "https://unpkg.com/@zeainc/zea-ux/dist/index.rawimport.js"

const appData = {
  scene,
  renderer
}


// This UndoRedoManager is here to facilitate collboration changes in the scene.
// Changes are recorded to the UndoRedoManager, which is then synchronized using
// SessionSync below.
appData.undoRedoManager  = new UndoRedoManager();
renderer.setUndoRedoManager(appData.undoRedoManager)

appData.selectionManager  = new SelectionManager(appData);


// // Note: the alpha value determines  the fill of the highlight.
// const selectionColor = new Color("#111111");
// selectionColor.a = 0.1
// const subtreeColor = selectionColor.lerp(new Color(1, 1, 1, 0), 0.5);
// appData.selectionManager.selectionGroup.getParameter('HighlightColor').setValue(selectionColor)
// appData.selectionManager.selectionGroup.getParameter('SubtreeHighlightColor').setValue(subtreeColor)

const sceneTreeView = document.getElementById(
  "zea-tree-view"
);
sceneTreeView.appData = appData
sceneTreeView.rootItem  = scene.getRoot()

document.addEventListener("keydown", event => {
  if(event.key==="f"){
    renderer.frameAll()
  }
  else if(event.key==="w"){
    cadPass.displayWireframes = !cadPass.displayWireframes
  }
});

// const camera = renderer.getViewport().getCamera();
// renderer.viewChanged.connect(() =>{
//   const xfoParam =  camera.getParameter('GlobalXfo')
//   console.log(xfoParam.getValue().tr.toString(), camera.getTargetPostion().toString())
// })


// ////////////////////////////////////
// // Setup Collaboration
import { Session, SessionSync } from "https://unpkg.com/@zeainc/zea-collab/dist/index.rawimport.js"

const socketUrl = 'https://websocket-staging.zea.live';

const urlParams = new URLSearchParams(window.location.search);


// let userId = urlParams.get('user-id');
// if (!userId) {
//   userId = localStorage.getItem('userId');
//   if(!userId) {
//     userId = Math.random().toString(36).slice(2, 12);
//     localStorage.setItem('userId', userId);
//   }
// } else {
//   localStorage.setItem('userId', userId);
// }


const color = Color.random();
const firstNames = ["Phil", "Froilan", "Alvaro", "Dan", "Mike", "Rob", "Steve"]
const lastNames = ["Taylor", "Smith", "Haines", "Moore", "Elías Pájaro Torreglosa", "Moreno"]
const userData = {
  given_name: firstNames[Math.randomInt(0, firstNames.length)],
  family_name: lastNames[Math.randomInt(0, lastNames.length)],
  id: Math.random().toString(36).slice(2, 12),
  color: color.toHex()
}

const session = new Session(userData, socketUrl);

let roomId = urlParams.get('room-id');
session.joinRoom(document.location.href+roomId);

const sessionSync = new SessionSync(session, appData, userData, {});
sessionSync.syncStateMachines(stateMachine)

const userChipSet = document.getElementById(
  "zea-user-chip-set"
);
userChipSet.session = session
userChipSet.showImages = true;//boolean('Show Images', true)

document.addEventListener(
  'zeaUserClicked',
  () => {
    console.log('user clicked')
  },
  false
)

const userChip = document.getElementById(
  "zea-user-chip"
);
userChip.userData = userData

////////////////////////////////////
// Display the Fps
const fpsDisplay = document.createElement("zea-fps-display")
fpsDisplay.renderer  = renderer
domElement.appendChild(fpsDisplay)
