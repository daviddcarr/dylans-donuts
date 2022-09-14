import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { BokehPass} from 'three/examples/jsm/postprocessing/BokehPass'
import { BokehShader, BokehDepthSahder } from 'three/examples/jsm/shaders/BokehShader2'
import { Color } from 'three'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()
let camera, renderer;

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const color = 0xFFFFFF;  // white
const near = 10;
const far = 100;

scene.fog = new THREE.Fog(color, near, far)
scene.background = new THREE.Color( 0xffffff )

const postprocessing = {}

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

console.time('donuts')
const range = 100
const minDistance = 5
for( let i = 0; i < 2000; i++ )
{


    const donut = new THREE.Mesh(donutGeometry, material)

    const newPosition = calculateDonutPosition(range, donutGeometry)

    donut.position.x = newPosition.x
    donut.position.y = newPosition.y
    donut.position.z = newPosition.z

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() & Math.PI
    donut.rotation.z = Math.random() & Math.PI
    
    const scale = Math.random() + 2
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}
console.timeEnd('donuts')

function calculateDonutPosition(r, d)
{
    const center = new THREE.Vector3(0,0,0)
    let p = randomPosition(r)
    let distance = p.distanceTo(center)

    while (distance > d)
    {
        p = randomPosition(r)
        distance = p.distanceTo(center)
    }

    return p
}


function randomPosition(r)
{
    return new THREE.Vector3(
        (Math.random() - 0.5) * r,
        (Math.random() - 0.5) * r,
        (Math.random() - 0.5) * r
    )
}


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 0.7

/**
 * Renderer
 */
renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    // alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.setClearColor( 0xffffff, 0)

initPostProcessing()

function initPostProcessing() {
    const renderPass = new RenderPass( scene, camera )

    const bokehPass = new BokehPass( scene, camera, {
        focus: 1.0,
        aperture: 0.025,
        maxblur: 0.01,

        width: sizes.width,
        height: sizes.height
    })

    const composer = new EffectComposer( renderer )

    composer.addPass( renderPass )
    composer.addPass( bokehPass )

    postprocessing.composer = composer
    postprocessing.bokeh = bokehPass
}


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    postprocessing.composer.render( 0.1 )

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()