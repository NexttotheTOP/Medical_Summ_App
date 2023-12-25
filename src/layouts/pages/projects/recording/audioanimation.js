import { useRef, useEffect } from "react";
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';
import PropTypes from 'prop-types';

function AudioVisualizer({ audioUrl }) {
 const visualizerRef = useRef(null);

 useEffect(() => {
   // Ensure audioUrl is available
   if (!audioUrl) return;

   // Visualizer setup (adapted from your script.js)
   const noiseGenerator = createNoise3D();
   const scene = new THREE.Scene();
   // ... more setup code ...

   // Audio setup
   const audio = new Audio(audioUrl);
   const context = new AudioContext();
   const src = context.createMediaElementSource(audio);
   const analyser = context.createAnalyser();
   // ... more audio setup code ...

   // Animation loop
   const render = () => {
    analyser.getByteFrequencyData(dataArray);
  
    // Example of using noiseGenerator to modify a mesh
    mesh.geometry.vertices.forEach((vertex, i) => {
      const time = window.performance.now();
      const noiseValue = noiseGenerator(vertex.x + time * 0.0001, vertex.y + time * 0.0002, vertex.z + time * 0.0003);
      vertex.z = noiseValue * 5; // Adjust this factor as needed
    });
    mesh.geometry.verticesNeedUpdate = true;
  
    // ... other animation code ...
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

   render();

   return () => {
     // Cleanup
     audio.pause();
     context.close();
   };
 }, [audioUrl]);

 return <div ref={visualizerRef} style={{ width: '100%', height: '400px' }} />;
}

AudioVisualizer.propTypes = {
 audioUrl: PropTypes.string.isRequired,
};

export default AudioVisualizer;