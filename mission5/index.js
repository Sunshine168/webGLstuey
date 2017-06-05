$(function() {
	var scene, cemera, renderer;
	var controls, guiControls, datGUI;
	var sphereGeometry, planeGeometry;
	var torMaterial, planeMaterial;
	var torusKnot, plane, torusLine;
	var stats;
	var sphereMaterialLineBasic, sphereMaterialDashed, meshBasicMaterial;
	var SCREEN_WIDTH, SCREEN_HEIGHT;
	var ani = 0;

	function init() {
		/*creates empty scene object and renderer*/
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
		renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setClearColor(0x000000);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.shadowMapEnabled = true;
		renderer.shadowMapSoft = true;

		/*add controls*/
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.addEventListener('change', render);

		/*create torus knot*/
		sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
		// meshBasicMaterial = new THREE.MeshBasicMaterial({
		// 	color: 0xffff00
		// });
		sphereMaterialLineBasic = new THREE.LineBasicMaterial({
			color: 0xffc3c3,
			linewidth: 2
		});
		sphereMaterialDashed = new THREE.LineDashedMaterial({
			color: 0xffc3c3,
			dashSize: 3,
			scale: 1,
			gapSize: 1,
			lineWidth: 5
		})
		torusLine = new THREE.Line(geo2line(sphereGeometry), sphereMaterialLineBasic, THREE.LinePieces);

		/*position and add objects to scene*/

		torusLine.position.x = 2.5
		torusLine.position.y = 6;
		torusLine.position.z = 2.5;
		torusLine.castShadow = false;
		scene.add(torusLine);

		var geometry = new THREE.TorusBufferGeometry(10, 3, 10, 12);
		var material = new THREE.MeshBasicMaterial({
			color: 0xffff00
		});
		var torus = new THREE.Mesh(geometry, material);
		torus.position.set(2.5, 5, 2.5)
		scene.add(torus);
		camera.position.x = 10;
		camera.position.y = 20;
		camera.position.z = 10;
		camera.lookAt(scene.position);

		/*datGUI controls object*/
		guiControls = new function() {
			this.rotationX = 0.00;
			this.rotationY = 0.01;
			this.rotationZ = 0.00;

			this.material = 'dashed';
			this.color = "#ffc3c3";
			this.scale = 1;
			this.dashSize = 0.0001;
			this.gapSize = 1;
		}

		/*adds controls to scene*/
		datGUI = new dat.GUI();
		var rotFolder = datGUI.addFolder('Rotation Options');
		var materialFolder = datGUI.addFolder('Material Options');
		materialFolder.open();


		rotFolder.add(guiControls, 'rotationX', 0, 1);
		rotFolder.add(guiControls, 'rotationY', 0, 1);
		rotFolder.add(guiControls, 'rotationZ', 0, 1);

		materialFolder.add(guiControls, 'material', ['solid', 'dashed']).onChange(function(value) {
			if (value == 'solid') {
				torusLine.material = sphereMaterialLineBasic;
			} else if (value == 'dashed') {
				torusLine.material = sphereMaterialDashed;
			}
		});

		materialFolder.addColor(guiControls, 'color').onChange(function(value) {
			torusLine.material.color.setHex(value.replace('#', '0x'));
		});
		materialFolder.add(guiControls, 'dashSize', 0, 1).listen();
		materialFolder.add(guiControls, 'gapSize', 0, 3).step(.05).onChange(function(value) {
			torusLine.material.gapSize = value;
		});
		datGUI.close();
		$('#webGL').append(renderer.domElement);
		/*stats*/
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		$("#webGL").append(stats.domElement);
	}

	function geo2line(geo) {

		var geometry = new THREE.Geometry();
		var vertices = geometry.vertices;
		for (i = 0; i < geo.faces.length; i++) {

			var face = geo.faces[i];

			if (face instanceof THREE.Face3) {

				vertices.push(geo.vertices[face.a].clone());
				vertices.push(geo.vertices[face.b].clone());
				vertices.push(geo.vertices[face.b].clone());
				vertices.push(geo.vertices[face.c].clone());
				vertices.push(geo.vertices[face.c].clone());
				vertices.push(geo.vertices[face.a].clone());

			} else if (face instanceof THREE.Face4) {

				vertices.push(geo.vertices[face.a].clone());
				vertices.push(geo.vertices[face.b].clone());
				vertices.push(geo.vertices[face.b].clone());
				vertices.push(geo.vertices[face.c].clone());
				vertices.push(geo.vertices[face.c].clone());
				vertices.push(geo.vertices[face.d].clone());
				vertices.push(geo.vertices[face.d].clone());
				vertices.push(geo.vertices[face.a].clone());

			}

		}

		geometry.computeLineDistances();

		return geometry;
	}

	function render() {

		torusLine.rotation.x += guiControls.rotationX;
		torusLine.rotation.y += guiControls.rotationY;
		torusLine.rotation.z += guiControls.rotationZ;


		if ((ani < 1) && (ani > 0)) {
			ani += .0001;
			torusLine.material.dashSize = ani;
			guiControls.dashSize = ani;
		} else if (ani > 1) {
			ani *= -1;
			ani += .0001;
			torusLine.material.dashSize = ani * -1;
			guiControls.dashSize = ani * -1;
		} else {
			ani += .0001;
			torusLine.material.dashSize = ani * -1;
			guiControls.dashSize = ani * -1;
		}
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