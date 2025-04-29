# Implementation Prompts for AR Chroma Key Video Project

## Prompt 1: Project Setup

```
Create the initial project structure for an AR Chroma Key video application using Three.js. 
Please generate:
1. An index.html file with proper HTML5 structure, meta tags for mobile compatibility, and Three.js included via CDN
2. A style.css file with basic styling for a full-screen application
3. A script.js file with basic initialization code to verify Three.js is loaded correctly

The application should display a simple "AR Chroma Key Video" heading to confirm everything is working.
```

## Prompt 2: Video Input Handling

```
Building on our AR Chroma Key project, implement the video input handling:
1. Add a styled file input button to allow users to select video files
2. Create a hidden video element to hold the selected video
3. Implement the File API to load the selected video
4. Display the selected filename to the user
5. Add basic error handling for unsupported file types
6. Make sure the video element is properly configured but hidden from view

The result should allow users to select video files which will be loaded into a video element.
```

## Prompt 3: Basic Three.js Scene

```
Let's set up the Three.js scene for our AR Chroma Key project:
1. Initialize a Three.js scene, camera, and renderer
2. Configure the renderer for transparency
3. Add the canvas to the DOM and style it to fill the viewport
4. Create an animation loop with requestAnimationFrame
5. Implement a window resize handler to keep the scene responsive
6. Add basic lighting to the scene
7. Create a simple plane that will later hold our video
8. Add a temporary colored material to the plane to verify it's visible

Ensure the scene renders properly with the plane visible in the center of the viewport.
```

## Prompt 4: Video Integration with Three.js

```
Now let's integrate our video with the Three.js scene:
1. Create a video texture from the loaded video element
2. Apply this texture to the 3D plane we created earlier
3. Update the texture in the animation loop
4. Handle video playback events (play, pause, ended)
5. Adjust the plane dimensions to match the video's aspect ratio
6. Position the plane appropriately in 3D space
7. Add controls to play/pause the video

The video should now appear on the plane in the Three.js scene when a file is selected.
```

## Prompt 5: Basic Shader Implementation

```
Let's implement the basic shader structure for our chroma key effect:
1. Create a ShaderMaterial to replace the basic material on our video plane
2. Implement a simple vertex shader that passes UV coordinates
3. Create a fragment shader that initially just displays the video texture
4. Pass the video texture to the shader as a uniform
5. Set up additional uniform variables that we'll need later for chroma keying
6. Make sure the video still displays correctly with the shader applied

At this stage, the video should display the same as before, but now using a custom shader.
```

## Prompt 6: Chroma Key Shader Implementation

```
Now let's implement the chroma key functionality in our shader:
1. Enhance the fragment shader to perform RGB to HSV conversion
2. Add logic to detect green screen colors
3. Implement transparency based on the color matching
4. Add uniform variables for key color, similarity, smoothness, and spill
5. Initialize these uniforms with default values in JavaScript
6. Test the shader with different green screen videos

The result should show the video with the green background removed, making it transparent.
```

## Prompt 7: User Controls for Chroma Key Parameters

```
Let's add user interface controls to adjust the chroma key parameters:
1. Create sliders for key color (hue), similarity, smoothness, and spill reduction
2. Style these controls to fit with our application design
3. Connect the sliders to update the shader uniforms in real-time
4. Add labels and value displays for each parameter
5. Include a reset button to restore default values
6. Organize the controls in a panel that can be collapsed
7. Ensure the controls update the shader immediately when adjusted

Users should now be able to fine-tune the chroma key effect for different videos.
```

## Prompt 8: Device Camera Integration

```
Let's implement the AR functionality by integrating the device camera:
1. Add code to request camera permissions
2. Access the device camera using getUserMedia()
3. Create a video element for the camera feed
4. Position this video behind the Three.js canvas
5. Handle camera access errors gracefully with user-friendly messages
6. Add a button to enable/disable the camera
7. Ensure the camera feed works on mobile devices

The result should show the camera feed as background with the chroma-keyed video floating on top.
```

## Prompt 9: AR Positioning Controls

```
Let's enhance our AR functionality with positioning controls:
1. Add UI controls for adjusting the video plane's position in 3D space
2. Implement rotation controls for the plane
3. Add scaling functionality to resize the video
4. Create an intuitive interface for these controls
5. Add a grid or reference points to help with positioning
6. Implement optional touch/drag controls for mobile positioning
7. Ensure all position changes update in real-time

Users should now be able to position, rotate, and scale the video in the AR space.
```

## Prompt 10: UI Polish and Responsiveness

```
Let's polish the user interface and make it responsive:
1. Improve the overall layout and visual design
2. Create collapsible panels for all control groups
3. Implement responsive design for different screen sizes
4. Add touch-friendly controls for mobile devices
5. Create loading indicators for video processing
6. Add a simple help overlay or instructions
7. Ensure all UI elements scale appropriately on different devices

The application should now have a polished, user-friendly interface that works well on both desktop and mobile.
```

## Prompt 11: Performance Optimization

```
Let's optimize the performance of our AR Chroma Key application:
1. Refine the render loop to be more efficient
2. Add options for adjusting resolution/quality for performance
3. Optimize the shader code for better performance
4. Implement conditional rendering based on device capabilities
5. Add simple performance monitoring (FPS counter)
6. Create fallbacks for unsupported features
7. Test and optimize for mobile devices

The application should now run smoothly on a wider range of devices.
```

## Prompt 12: Final Integration and Deployment

```
Let's finalize our AR Chroma Key application for deployment:
1. Review and clean up all code
2. Add comprehensive comments
3. Implement any missing error handling
4. Create a README.md with usage instructions and features
5. Prepare the project for GitHub Pages deployment
6. Ensure all features work together seamlessly
7. Add final polish to the UI and interactions

The application should now be complete, well-documented, and ready for deployment to GitHub Pages.
```


