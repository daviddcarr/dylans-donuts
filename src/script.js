import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const color = 0xFFFFFF;  // white
const near = 10;
const far = 100;
scene.fog = new THREE.Fog(color, near, far);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/9.png')

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

console.time('donuts')
const range = 100
for( let i = 0; i < 1000; i++ )
{


    const donut = new THREE.Mesh(donutGeometry, material)

    donut.position.x = (Math.random() - 0.5) * range
    donut.position.y = (Math.random() - 0.5) * range
    donut.position.z = (Math.random() - 0.5) * range

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() & Math.PI
    donut.rotation.z = Math.random() & Math.PI
    
    const scale = Math.random() + 1
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}
console.timeEnd('donuts')


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 1.0

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor( 0xffffff, 0)

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
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()