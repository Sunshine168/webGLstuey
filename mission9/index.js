$(function() {

	var scene, camera, renderer;
	var controls, guiControls, datGUI;
	var stats;
	var dae, spotLight;
	var SCREEN_WIDTH, SCREEN_HEIGHT;
	var spotLightShadowHelper;

	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load('https://cdn.rawgit.com/wpdildine/wpdildine.github.com/master/models/monkey.dae', function(collada) {
		dae = collada.scene;
		dae.scale.x = dae.scale.y = dae.scale.z = 3;
		dae.traverse(function(child) {
			if (child.colladaId == "Suzanne") {
				child.traverse(function(e) {
					e.castShadow = true;
					e.receiveShadow = true;
					if (e.material instanceof THREE.MeshPhongMaterial) {
						e.material.needsUpdate = true;
					}

				});
			} else if (child.colladaId == "Plane") {
				child.traverse(function(e) {
					e.castShadow = true;
					e.receiveShadow = true;
				});
			}
		});
		dae.updateMatrix();
		init();
		animate();
		console.log(scene);
	});

	function init() {
		/*creates empty scene object and renderer*/
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 500);
		renderer = new THREE.WebGLRenderer({
			antialias: true
		});

		renderer.setClearColor(0x000000);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.soft = true;

		/*add controls*/
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.addEventListener('change', render);

		camera.position.x = 5;
		camera.position.y = 9;
		camera.position.z = 42;
		camera.lookAt(scene.position);

		scene.add(dae);
		/*datGUI controls object*/
		guiControls = new function() {
				this.rotationX = 0.0;
				this.rotationY = 0.0;
				this.rotationZ = 0.0;

				this.lightX = 19;
				this.lightY = 47;
				this.lightZ = 19;
				this.intensity = 2.5;
				this.distance = 373;
				this.angle = 1.6;
				this.exponent = 38;
				this.shadowCameraNear = 34;
				this.shadowCameraFar = 2635;
				this.shadowCameraFov = 68;
				this.shadowCameraVisible = false;
				this.shadowMapWidth = 512;
				this.shadowMapHeight = 512;
				this.shadowBias = 0.00;
				this.shadowDarkness = 0.11;

			}
			/*adds spot light with starting parameters*/
		spotLight = new THREE.SpotLight(0xffffff);
		spotLight.castShadow = true;
		spotLight.position.set(20, 35, 40);
		spotLight.intensity = guiControls.intensity;
		spotLight.distance = guiControls.distance;
		spotLight.angle = guiControls.angle;
		spotLight.exponent = guiControls.exponent;
		spotLight.shadow.camera.near = guiControls.shadowCameraNear;
		spotLight.shadow.camera.far = guiControls.shadowCameraFar;
		spotLight.shadow.camera.fov = guiControls.shadowCameraFov;
		spotLight.shadow.camera.visible = guiControls.shadowCameraVisible;
		spotLight.shadow.bias = guiControls.shadowBias;
		scene.add(spotLight);

		/*adds controls to scene*/
		datGUI = new dat.GUI();

		datGUI.add(guiControls, 'lightX', -60, 180);
		datGUI.add(guiControls, 'lightY', 0, 180);
		datGUI.add(guiControls, 'lightZ', -60, 180);

		datGUI.add(guiControls, 'intensity', 0.01, 5).onChange(function(value) {
			spotLight.intensity = value;
		});
		datGUI.add(guiControls, 'distance', 0, 1000).onChange(function(value) {
			spotLight.distance = value;
		});
		datGUI.add(guiControls, 'angle', 0.001, 1.570).onChange(function(value) {
			spotLight.angle = value;
		});
		datGUI.add(guiControls, 'exponent', 0, 50).onChange(function(value) {
			spotLight.exponent = value;
		});
		datGUI.add(guiControls, 'shadowCameraNear', 0, 100).name("Near").onChange(function(value) {
			spotLight.shadow.camera.near = value;
			spotLight.shadow.camera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowCameraFar', 0, 5000).name("Far").onChange(function(value) {
			spotLight.shadow.camera.far = value;
			spotLight.shadow.camera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowCameraFov', 1, 180).name("Fov").onChange(function(value) {
			spotLight.shadow.camera.fov = value;
			spotLight.shadow.camera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowCameraVisible').onChange(function(value) {
			if (value == true) {
				if (!spotLightShadowHelper) {
					spotLightShadowHelper = new THREE.CameraHelper(spotLight.shadow.camera);
				}
				scene.add(spotLightShadowHelper)
			} else {
				scene.remove(spotLightShadowHelper)
			}
		});
		datGUI.add(guiControls, 'shadowBias', 0, 1).onChange(function(value) {
			spotLight.shadow.bias = value;
			spotLight.shadow.camera.updateProjectionMatrix();
		});
		datGUI.close();
		$("#webGL").append(renderer.domElement);
		/*stats*/
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		$("#webGL").append(stats.domElement);
	}


	function render() {
		dae.traverse(function(child) {
			if (child.colladaId == "Suzanne") {
				child.rotation.y += .01;
			} else if (child.colladaId == "Plane") {
				child.rotation.y -= .01;
			}
		});

		spotLight.position.x = guiControls.lightX;
		spotLight.position.y = guiControls.lightY;
		spotLight.position.z = guiControls.lightZ;

	}

	function animate() {
		requestAnimationFrame(animate);
		render();
		stats.update();
		renderer.render(scene, camera);
	}
});


$(window).resize(function() {


	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

});