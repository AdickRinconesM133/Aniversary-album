import { Object3DNode } from "@react-three/fiber";
import * as THREE from "three";

// Esto permite que TypeScript reconozca nuestro material personalizado en cualquier parte del proyecto
declare global {
    namespace JSX {
        interface IntrinsicElements {
            depthDisplacementMaterial: any;
        }
    }
}
