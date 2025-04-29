# AR Chroma Key Video Project Todo List

## Phase 1: Project Setup
- [x] Create basic file structure (index.html, style.css, script.js)
- [x] Set up HTML boilerplate with proper meta tags for mobile
- [x] Create CSS reset and basic styling
- [x] Add Three.js library via CDN
- [x] Test that Three.js is properly loaded
- [x] Create a simple "Hello World" message to verify setup

## Phase 2: Video Input Handling
- [x] Add file input element to HTML
- [x] Style the file input button for better UX
- [x] Create a hidden video element to hold the selected video
- [x] Add event listeners for file selection
- [x] Implement file reading using File API
- [x] Display selected video filename to user
- [x] Test video loading with sample videos

## Phase 3: Basic Three.js Scene
- [x] Initialize Three.js scene, camera, and renderer
- [x] Configure renderer for transparency
- [x] Add canvas to DOM and style it to fill viewport
- [x] Create simple animation loop
- [x] Implement window resize handler
- [x] Add basic lighting to scene
- [x] Create a target plane for video projection
- [x] Test scene with a simple object (cube or sphere)

## Phase 4: Video Integration with Three.js
- [x] Create a video texture from the loaded video
- [x] Apply basic texture to the 3D plane
- [x] Update texture in animation loop
- [x] Handle video playback events (play, pause, ended)
- [x] Adjust plane dimensions to match video aspect ratio
- [x] Position plane in 3D space appropriately
- [x] Test video rendering on the plane

## Phase 5: Chroma Key Shader - Basic
- [x] Create a ShaderMaterial for the video plane
- [x] Implement basic vertex shader
- [x] Create fragment shader structure
- [x] Pass video texture to shader
- [x] Test shader with video (no chroma key yet)
- [x] Add uniform variables for shader parameters

## Phase 6: Chroma Key Shader - Implementation
- [x] Implement RGB to HSV conversion in shader
- [x] Add green color detection logic
- [x] Implement transparency based on color matching
- [x] Add parameters for key color, similarity, and smoothness
- [x] Test chroma key effect with sample green screen videos
- [x] Optimize shader performance

## Phase 7: User Controls
- [x] Add UI controls for adjusting chroma key parameters
- [x] Create sliders for key color, similarity, smoothness, and spill
- [x] Style the UI controls
- [x] Connect UI controls to shader uniforms
- [x] Add play/pause button for video
- [x] Create reset button for default values
- [x] Test control responsiveness

## Phase 8: AR Implementation - Device Camera
- [x] Request camera permissions
- [x] Access device camera using getUserMedia
- [x] Create background video element for camera feed
- [x] Position camera feed behind Three.js canvas
- [x] Handle camera errors gracefully
- [x] Test camera integration on different devices

## Phase 9: AR Implementation - Positioning
- [x] Add controls for video plane positioning in 3D space
- [x] Implement rotation controls
- [x] Add scaling functionality
- [x] Create intuitive UI for position adjustments
- [x] Test positioning in AR environment
- [x] Implement optional grid or reference points

## Phase 10: UI Polish and Responsiveness
- [x] Improve overall layout
- [x] Create collapsible panels for controls
- [x] Implement responsive design for different screen sizes
- [x] Add touch controls for mobile devices
- [x] Create loading indicators
- [x] Add instructions or help overlay
- [x] Test UI on various devices and screen sizes

## Phase 11: Performance Optimization
- [x] Optimize render loop
- [x] Add resolution scaling options
- [x] Implement efficient shader code
- [x] Add performance monitoring
- [x] Test on lower-end devices
- [x] Implement fallbacks for unsupported features

## Phase 12: Deployment
- [x] Create README.md with project documentation
- [x] Add sample videos for testing
- [x] Clean up code and add comments
- [x] Create GitHub repository
- [x] Configure GitHub Pages
- [x] Test deployed application
- [x] Share project URL