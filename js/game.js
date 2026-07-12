// City of Acres Homes — 3D Explorer demo (Three.js)
// A small third-person scene: walk a character around a park with WASD/arrows,
// jump with space, and drag the mouse to orbit the camera.

(function () {
  var canvas = document.getElementById("game-canvas");
  var loadingEl = document.getElementById("game-loading");
  if (!canvas || typeof THREE === "undefined") return;

  var wrap = document.getElementById("game-wrap");

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fd3ff);
  scene.fog = new THREE.Fog(0x9fd3ff, 20, 70);

  var camera = new THREE.PerspectiveCamera(60, wrap.clientWidth / wrap.clientHeight, 0.1, 200);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  renderer.shadowMap.enabled = true;

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  var sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(15, 25, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -30;
  sun.shadow.camera.right = 30;
  sun.shadow.camera.top = 30;
  sun.shadow.camera.bottom = -30;
  scene.add(sun);

  // Ground
  var ground = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 120),
    new THREE.MeshStandardMaterial({ color: 0x6fbf5a })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // A simple path
  var path = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 100),
    new THREE.MeshStandardMaterial({ color: 0xc9b48a })
  );
  path.rotation.x = -Math.PI / 2;
  path.position.y = 0.01;
  path.receiveShadow = true;
  scene.add(path);

  // Trees scattered around
  function makeTree(x, z) {
    var group = new THREE.Group();
    var trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.35, 2, 8),
      new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
    );
    trunk.position.y = 1;
    trunk.castShadow = true;
    var leaves = new THREE.Mesh(
      new THREE.ConeGeometry(1.6, 3, 10),
      new THREE.MeshStandardMaterial({ color: 0x2e7d32 })
    );
    leaves.position.y = 3;
    leaves.castShadow = true;
    group.add(trunk, leaves);
    group.position.set(x, 0, z);
    return group;
  }
  for (var i = 0; i < 24; i++) {
    var angle = Math.random() * Math.PI * 2;
    var radius = 12 + Math.random() * 35;
    var x = Math.cos(angle) * radius;
    var z = Math.sin(angle) * radius;
    if (Math.abs(x) < 4 && z > -50 && z < 50) continue; // keep path clear
    scene.add(makeTree(x, z));
  }

  // A few simple houses to nod at the neighborhood theme
  function makeHouse(x, z, color) {
    var group = new THREE.Group();
    var base = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({ color: color })
    );
    base.position.y = 1.25;
    base.castShadow = true;
    var roof = new THREE.Mesh(
      new THREE.ConeGeometry(3.2, 1.8, 4),
      new THREE.MeshStandardMaterial({ color: 0x7a4a2b })
    );
    roof.position.y = 2.5 + 0.9;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(base, roof);
    group.position.set(x, 0, z);
    return group;
  }
  scene.add(makeHouse(-14, -10, 0xf2c14e));
  scene.add(makeHouse(14, -18, 0xef8354));
  scene.add(makeHouse(-16, 20, 0x5fa8d3));

  // Character: simple capsule body + head
  var character = new THREE.Group();
  var bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a4d8f });
  var body = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.0, 4, 8), bodyMat);
  body.position.y = 1.05;
  body.castShadow = true;
  var head = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xf1c27d })
  );
  head.position.y = 2.0;
  head.castShadow = true;
  character.add(body, head);
  character.position.set(0, 0, 8);
  scene.add(character);

  // Camera rig — follows behind the character, with mouse-drag orbit
  var camYaw = 0;
  var camPitch = 0.35;
  var camDistance = 8;

  function updateCamera() {
    var offset = new THREE.Vector3(
      Math.sin(camYaw) * Math.cos(camPitch),
      Math.sin(camPitch) + 0.4,
      Math.cos(camYaw) * Math.cos(camPitch)
    ).multiplyScalar(camDistance);
    var target = character.position.clone().add(new THREE.Vector3(0, 1.4, 0));
    camera.position.copy(target).add(offset);
    camera.lookAt(target);
  }
  camYaw = Math.PI; // start looking at the character from behind
  updateCamera();

  // Input handling
  var keys = {};
  window.addEventListener("keydown", function (e) { keys[e.code] = true; });
  window.addEventListener("keyup", function (e) { keys[e.code] = false; });

  var dragging = false;
  var lastX = 0, lastY = 0;
  canvas.addEventListener("pointerdown", function (e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener("pointerup", function () { dragging = false; });
  window.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    camYaw -= dx * 0.005;
    camPitch = Math.min(0.9, Math.max(-0.2, camPitch - dy * 0.003));
  });

  var velocityY = 0;
  var grounded = true;
  var facing = Math.PI; // radians

  function isPressed() {
    return {
      forward: keys["KeyW"] || keys["ArrowUp"],
      back: keys["KeyS"] || keys["ArrowDown"],
      left: keys["KeyA"] || keys["ArrowLeft"],
      right: keys["KeyD"] || keys["ArrowRight"],
      run: keys["ShiftLeft"] || keys["ShiftRight"],
      jump: keys["Space"]
    };
  }

  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var input = isPressed();

    var moveX = 0, moveZ = 0;
    if (input.forward) moveZ -= 1;
    if (input.back) moveZ += 1;
    if (input.left) moveX -= 1;
    if (input.right) moveX += 1;

    var moving = moveX !== 0 || moveZ !== 0;
    if (moving) {
      var len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len;
      moveZ /= len;

      // Move relative to camera yaw so controls feel natural
      var sin = Math.sin(camYaw), cos = Math.cos(camYaw);
      var worldX = moveX * cos + moveZ * sin;
      var worldZ = -moveX * sin + moveZ * cos;

      var speed = (input.run ? 8 : 4.2) * dt;
      character.position.x += worldX * speed;
      character.position.z += worldZ * speed;

      facing = Math.atan2(worldX, worldZ);
      character.rotation.y = facing;
    }

    // Bound the character to the ground area
    character.position.x = Math.max(-55, Math.min(55, character.position.x));
    character.position.z = Math.max(-55, Math.min(55, character.position.z));

    // Simple jump
    if (input.jump && grounded) {
      velocityY = 5.5;
      grounded = false;
    }
    velocityY -= 15 * dt;
    character.position.y += velocityY * dt;
    if (character.position.y <= 0) {
      character.position.y = 0;
      velocityY = 0;
      grounded = true;
    }

    updateCamera();
    renderer.render(scene, camera);
  }

  loadingEl.style.display = "none";
  animate();

  window.addEventListener("resize", function () {
    camera.aspect = wrap.clientWidth / wrap.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  });
})();
