$(function() {

	var scene, camera, renderer;
	var controls, guiControls, datGUI;
	var axis, grid, color;
	var textSize
	var textGeometry;
	var textMaterial;
	var text;
	var spotLight;
	var stats;
	var SCREEN_WIDTH, SCREEN_HEIGHT;
	var e = 0;
	var font = undefined;

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
		renderer.shadowMapSoft = true;

		/*add controls*/
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.addEventListener('change', render);

		/*adds helpers*/
		axis = new THREE.AxisHelper(10);
		/*scene.add (axis);*/

		camera.position.x = 30;
		camera.position.y = 30;
		camera.position.z = 20;
		camera.lookAt(scene.position);


		scene.fog = new THREE.Fog(0x000000, 20, 100);


		/*datGUI controls object*/
		guiControls = new function() {
			this.rotationX = 0.01;
			this.rotationY = 0.01;
			this.rotationZ = 0.00;

			this.lightX = 20;
			this.lightY = 35;
			this.lightZ = 40;
			this.intensity = 1;
			this.distance = 0;
			this.angle = 1.570;
			this.exponent = 0;
			this.shadowCameraNear = 10;
			this.shadowCameraFar = 100;
			this.shadowCameraFov = 50;
			this.shadowCameraVisible = false;
			this.shadowMapWidth = 2056;
			this.shadowMapHeight = 2056;
			this.shadowBias = 0.00;
			this.shadowDarkness = 0.5;

			this.addText = function() {
				addText();

			};
			this.deleteText = function() {

				deleteText();

			};

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
		spotLight.shadow.Darkness = guiControls.shadowDarkness;
		scene.add(spotLight);

		/*adds controls to scene*/
		datGUI = new dat.GUI();

		datGUI.add(guiControls, 'rotationX', 0, 1);
		datGUI.add(guiControls, 'rotationY', 0, 1);
		datGUI.add(guiControls, 'rotationZ', 0, 1);

		datGUI.add(guiControls, 'addText');
		datGUI.add(guiControls, 'deleteText');

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
			spotLight.shadow.camera.visible = value;
			spotLight.shadow.camera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowBias', 0, 1).onChange(function(value) {
			spotLight.shadow.bias = value;
			spotLight.shadow.camera.updateProjectionMatrix();
		});
		datGUI.add(guiControls, 'shadowDarkness', 0, 1).onChange(function(value) {
			spotLight.shadowDarkness = value;
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
		var i = 0

		loadFont().then(function(font) {
			while (i < 100) {
				addText(font);
				i += 1;
			}
		})

	}

	function loadFont() {
		return new Promise(function(resolve, reject) {
			var loader = new THREE.FontLoader();
			loader.load('fonts/helvetiker_regular.typeface.json', function(font) {
				resolve(font)
			})
		})
	}

	function addText(font) {
		textSize = Math.floor((Math.random() * 6));
		textGeometry = new THREE.TextGeometry('Good Bye', {
			font: font,
			size: 2,
			height: 1
		});
		textMaterial = new THREE.MeshPhongMaterial({
			color: Math.random() * 0xff9000
		});
		text = new THREE.Mesh(textGeometry, textMaterial);
		text.castShadow = true;
		text.receiveShadow = true;
		text.name = "spam-" + scene.children.length;
		text.position.x = Math.floor(Math.random() * 99) - 49;
		text.position.y = Math.floor(Math.random() * 99) - 49;
		text.position.z = Math.floor(Math.random() * 99) - 49;
		scene.add(text);
		this.textCount = scene.children.length;
	}

	function deleteText() {
		var arrayText = scene.children;
		var lastTextAdded = arrayText[arrayText.length - 1];
		if (lastTextAdded instanceof THREE.Mesh) {
			scene.remove(lastTextAdded);
			addText.textCount = scene.children.length;
		}
	}

	function render() {
		scene.traverse(function(value) {
			if (value instanceof THREE.Mesh) {
				value.rotation.x += guiControls.rotationX;
				value.rotation.y += guiControls.rotationY;
				value.rotation.z += guiControls.rotationZ;
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

	$(window).resize(function() {


		SCREEN_WIDTH = window.innerWidth;
		SCREEN_HEIGHT = window.innerHeight;

		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		camera.updateProjectionMatrix();

		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);



	});
	init();
	animate();

});