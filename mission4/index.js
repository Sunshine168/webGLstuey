$(function() {
    var scene, camera, renderer;
    var controls, guiControls, datGUI;
    var cubeGeomerty, torGeometry, textGeometry, planeGeometry;
    var cubeMaterial, torMaterial, textMaterial, planeMaterial;
    var cube, torusKnot, text, plane;
    var lightHelper, shadowCameraHelper;

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window / innerHeight, 1, 500);
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            color: 0xdddddd
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.ShadowMapEnabled = true;
        renderer.shawodMapSoft = true;

        /*add controls*/
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);

        /* adds heplers*/
        axis = new THREE.AxisHelper(10);
        scene.add(axis);

        grid = new THREE.GridHelper(50, 5);
        color = new THREE.Color("rgb(255,0,0)");
        grid.setColors(color, 0x000000);

        scene.add(grid);

        /*create cube*/
        cubeGeometry = new THREE.BoxGeometry(5, 5, 5);
        cubeMaterial = new THREE.MeshLambertMaterial({
            color: 0xff3300
        });
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 2.5, 0);
        scene.add(cube)
            /*create torus knot*/
        torGeometry = new THREE.TorusKnotGeometry(4, 1, 8, 8);
        torMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00
        });
        torusKnot = new THREE.Mesh(torGeometry, torMaterial);
        torusKnot.position.set(30, 5, 0)
        scene.add(torusKnot)
            /*create text*/
        var loader = new THREE.FontLoader();
        loader.load('fonts/helvetiker_regular.typeface.json', function(font) {
                console.log(font);
                textGeometry = new THREE.TextGeometry('Good Bye Word', {
                    font: font,
                    size: 2,
                    height: 2,
                });
                textMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffff,
                });
                text = new THREE.Mesh(textGeometry, textMaterial);
                text.position.set(-30, 0, 0)
                scene.add(text)
            })
            /*create plane*/
        planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
        planeMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        /*position and add object to scene */
        plane.rotation.x = -.5 * Math.PI;
        plane.receiveShadow = true;
        scene.add(plane);

        camera.position.x = 40;
        camera.position.y = 40;
        camera.position.z = 40;
        camera.lookAt(scene.position)

        guiControls = new function() {
            this.rotationX = 0.0;
            this.rotationY = 0.0;
            this.rotationZ = 0.0;
            this.lightX = 15;
            this.lightY = 40;
            this.lightZ = 35;
            this.intensity = 1;
            this.distance = 0;
            this.angle = 1.670;
            this.exponent = 0;
            this.shadowCameraNear = 10;
            this.shadowCameraFar = 100;
            this.shadowCameraFov = 50;
            this.shadowCameraVisible = true;
            this.shadowMapWidth = 1028;
            this.shadowMapHeight = 1028;
            this.shadowBias = 0.01;
            this.target = cube;
        }
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        /*adds spot light with starting parameters*/
        spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.castShadow = true;
        spotLight.position.set(15, 40, 35);
        spotLight.intensity = guiControls.intensity;
        spotLight.distance = guiControls.distance;
        spotLight.angle = guiControls.angle;
        spotLight.exponent = guiControls.exponent;
        spotLight.shadow.camera.near = guiControls.shadowCameraNear;
        spotLight.shadow.camera.far = guiControls.shadowCameraFar;
        spotLight.shadow.camera.fov = guiControls.shadowCameraFov;
        spotLight.shadow.camera.visible = guiControls.shadowCameraVisible;
        spotLight.shadow.mapSize.width = guiControls.shadowMapWidth;
        spotLight.shadow.mapSize.height = guiControls.shadowMapHeight;
        spotLight.shadow.bias = guiControls.shadowBias;
        spotLight.target = guiControls.target;
        lightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(spotLight);
        scene.add(lightHelper)
        shadowCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
        scene.add(shadowCameraHelper);


        //Create a helper for the shadow camera (optional)
        var helper = new THREE.CameraHelper(spotLight.shadow.camera);
        scene.add(helper);
        /*add controls to scene*/
        datGUI = new dat.GUI();

        datGUI.add(guiControls, 'rotationX', 0, 1);
        datGUI.add(guiControls, 'rotationY', 0, 1);
        datGUI.add(guiControls, 'rotationZ', 0, 1);


        datGUI.add(guiControls, 'lightX', -60, 180);
        datGUI.add(guiControls, 'lightY', 0, 180);
        datGUI.add(guiControls, 'lightZ', -60, 180);

        datGUI.add(guiControls, 'target', ['cube', 'torusKnot', 'text']).onChange(function() {
            if (guiControls.target == 'cube') {
                spotLight.target = cube;
            } else if (guiControls.target == 'torusKont') {
                spotLight.target = torusKont;
            } else if (guiControls.target == 'text') {
                spotLight.target = text;
            }
        });
        datGUI.add(guiControls, 'intensity', 0.01, 5).onChange(function(value) {
            spotLight.intensity = value;
        })
        datGUI.add(guiControls, 'distance', 0, 1000).onChange(function(value) {
            spotLight.distance = value;
        })
        datGUI.add(guiControls, 'angle', 0.001, 1.570).onChange(function(value) {
            spotLight.angle = value;
        })
        datGUI.add(guiControls, 'exponent', 0, 50).onChange(function(value) {
            spotLight.exponent = value;
        })
        datGUI.add(guiControls, 'shadowCameraNear', 0, 100).name("Near").onChange(function(value) {
            spotLight.shadow.camera.near = value;
            spotLight.shadow.camera.updateProjectionMatrix();
        })
        datGUI.add(guiControls, 'shadowCameraFov', 1, 100).name("Fov").onChange(function(value) {
            spotLight.shadow.camera.fov = value;
            spotLight.shadow.camera.updateProjectionMatrix();
        })
        datGUI.add(guiControls, 'shadowCameraVisible').onChange(function(value) {
            spotLight.shadow.cameraVisible = value;
            spotLight.shadow.camera.updateProjectionMatrix();
        })
        datGUI.add(guiControls, 'shadowBias', 0, 1).onChange(function(value) {
            spotLight.shadow.bias = value;
            spotLight.shadow.camera.updateProjectionMatrix();
        })

        $("#webGL").append(renderer.domElement);
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px;';
        $("#webGl").append(stats.domElement);
    }

    function render() {
        cube.rotation.x += guiControls.rotationX;
        cube.rotation.y += guiControls.rotationY;
        cube.rotation.z += guiControls.rotationZ;
        spotLight.position.x = guiControls.lightX;
        spotLight.position.y = guiControls.lightY;
        spotLight.position.z = guiControls.lightZ;
    }

    function animate() {
        requestAnimationFrame(animate);
        shadowCameraHelper.update();
        lightHelper.update();
        render();
        stats.update();
        renderer.render(scene, camera)
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