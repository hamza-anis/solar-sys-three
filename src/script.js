import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

var model

const clock = new THREE.Clock()
const scene = new THREE.Scene()
// Canvas
const canvas = document.querySelector("canvas.webgl")

// scene.background = new THREE.Color(0x000111)

//Model
const textureLoader = new THREE.TextureLoader()


const loader = new GLTFLoader()
loader.load(
  "models/Sys.gltf",
  function (gltf) {
    model = gltf.scene
    model.traverse((child, i) => {
      let material = new THREE.MeshStandardMaterial()
      let color = "0x" + Math.floor(Math.random() * 16777215).toString(16)
      material.roughness = 0.2
      material.color = new THREE.Color(parseInt(color))
      if (child.isMesh) {
        child.material = material
      }
    })
    model.scale.set(0.1, 0.1, 0.1)
    scene.add(model)
  },
  undefined,
  function (error) {
    console.error(error)
  }
)

const bgTexture = textureLoader.load("textures/env1/py.jpg")
scene.background = bgTexture

var directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(-12, 10, -8)
scene.add(directionalLight)
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const camera = new THREE.PerspectiveCamera(
  8000,
  sizes.width / sizes.height,
  2,
  2000
)
camera.position.x = -1
camera.position.y = 1
camera.position.z = 10
scene.add(camera)
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const controls = new OrbitControls(camera, renderer.domElement)

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  controls.update()
})

const tick = () => {
  if (model) {
    model.rotation.y += 0.003
    // model.rotation.z = 0.02 * elpse
  }
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
