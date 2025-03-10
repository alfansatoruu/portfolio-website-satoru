import {OrbitControls,Html} from "@react-three/drei"
import {useLoader} from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useRef } from "react"

export default function Object(){
    const fullscene=useLoader(GLTFLoader,'./scene.gltf')
    const group = useRef()
 
    return<>
        <OrbitControls
        minDistance={6}
        maxDistance={15}
        minAzimuthAngle={-Math.PI / 4}  
        maxAzimuthAngle={Math.PI / 4} 
        minPolarAngle={0}  
        maxPolarAngle={Math.PI/2} 
      />
       <group>
       <primitive object={fullscene.scene} ref={group} position={[0,-2,-0.16]} rotation={[0,-Math.PI/4.09,0]}/>
       <Html wrapperClass="gltf" position={[0,1.14,0]} transform distanceFactor={2.51} rotation={[0.0,0.8,0]} >
         <iframe title="embed" src="./mac/index.html"/>
       </Html>
       </group>
    </>
}

