// City of Acres Homes — 3D Explorer demo (Three.js)
// A small GTA-style night city block: walk a character down the strip with
// WASD/arrows, jump with space, and drag the mouse to orbit the camera.

(function () {
  var canvas = document.getElementById("game-canvas");
  var loadingEl = document.getElementById("game-loading");
  if (!canvas || typeof THREE === "undefined") return;

  var wrap = document.getElementById("game-wrap");

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x14173a);
  scene.fog = new THREE.FogExp2(0x1c1840, 0.011);

  var camera = new THREE.PerspectiveCamera(62, wrap.clientWidth / wrap.clientHeight, 0.1, 300);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  renderer.shadowMap.enabled = true;
  if ("outputColorSpace" in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;

  // Dusk/neon lighting
  scene.add(new THREE.HemisphereLight(0x6a5ff5, 0x241a3d, 0.9));
  scene.add(new THREE.AmbientLight(0x4a4570, 0.35));
  var moon = new THREE.DirectionalLight(0x9db0ff, 0.85);
  moon.position.set(-20, 30, -10);
  moon.castShadow = true;
  moon.shadow.mapSize.set(1024, 1024);
  moon.shadow.camera.left = -40;
  moon.shadow.camera.right = 40;
  moon.shadow.camera.top = 40;
  moon.shadow.camera.bottom = -40;
  scene.add(moon);

  // Ground — asphalt road through the block
  var road = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 140),
    new THREE.MeshStandardMaterial({ color: 0x1c1d24, roughness: 0.85 })
  );
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = true;
  scene.add(road);

  // Sidewalks flanking the road
  function makeSidewalk(x) {
    var walk = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 140),
      new THREE.MeshStandardMaterial({ color: 0x44465a, roughness: 0.9 })
    );
    walk.rotation.x = -Math.PI / 2;
    walk.position.set(x, 0.02, 0);
    walk.receiveShadow = true;
    scene.add(walk);
  }
  makeSidewalk(-16);
  makeSidewalk(16);

  // Lane markings — dashed center line
  var dashMat = new THREE.MeshStandardMaterial({ color: 0xf2c84b, emissive: 0x6b4e00, emissiveIntensity: 0.4 });
  for (var d = -65; d <= 65; d += 6) {
    var dash = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 3), dashMat);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.03, d);
    scene.add(dash);
  }
  // Curb edges
  var curbMat = new THREE.MeshStandardMaterial({ color: 0xcfcfd6 });
  [-13, 13].forEach(function (x) {
    var curb = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 140), curbMat);
    curb.position.set(x, 0.1, 0);
    curb.receiveShadow = true;
    scene.add(curb);
  });

  // Neon-windowed buildings lining the strip
  var neonColors = [0xff3d7f, 0x27e0ff, 0x7c4dff, 0xffb23d, 0x3dff9e];
  function makeBuilding(x, z, depth) {
    var width = 8 + Math.random() * 4;
    var height = 10 + Math.random() * 26;
    var group = new THREE.Group();

    var bodyColor = new THREE.Color().setHSL(0.62 + Math.random() * 0.08, 0.15, 0.14 + Math.random() * 0.06);
    var body = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.75, metalness: 0.1 })
    );
    body.position.y = height / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Window grid with randomly lit, neon-colored panes
    var cols = Math.max(2, Math.round(width / 1.3));
    var rows = Math.max(3, Math.round(height / 1.6));
    var neon = neonColors[Math.floor(Math.random() * neonColors.length)];
    var winGeo = new THREE.PlaneGeometry(0.7, 1.0);
    var faceZ = depth / 2 + 0.02;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (Math.random() > 0.55) continue;
        var lit = Math.random() > 0.3;
        var mat = new THREE.MeshStandardMaterial({
          color: lit ? neon : 0x14141c,
          emissive: lit ? neon : 0x000000,
          emissiveIntensity: lit ? 1.8 : 0,
          roughness: 0.4
        });
        var pane = new THREE.Mesh(winGeo, mat);
        pane.position.set(
          -width / 2 + 1 + c * (width / cols),
          1.2 + r * (height / rows),
          faceZ
        );
        group.add(pane);
      }
    }

    group.position.set(x, 0, z);
    return group;
  }
  var buildingDepth = 10;
  for (var bz = -60; bz <= 60; bz += 13) {
    scene.add(makeBuilding(-19 - buildingDepth / 2, bz + (Math.random() * 4 - 2), buildingDepth));
    scene.add(makeBuilding(19 + buildingDepth / 2, bz + (Math.random() * 4 - 2), buildingDepth));
  }

  // Street lamps with warm pools of light
  function makeStreetlamp(x, z) {
    var group = new THREE.Group();
    var pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 5, 8),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1f, metalness: 0.6, roughness: 0.4 })
    );
    pole.position.y = 2.5;
    pole.castShadow = true;
    var arm = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 0.08),
      pole.material
    );
    arm.position.set(x > 0 ? -0.6 : 0.6, 4.9, 0);
    var bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xfff2c2, emissive: 0xffd36b, emissiveIntensity: 1.6 })
    );
    bulb.position.set(x > 0 ? -1.1 : 1.1, 4.85, 0);
    var lamp = new THREE.PointLight(0xffc266, 6, 11, 2);
    lamp.position.copy(bulb.position);
    lamp.position.y -= 0.2;
    group.add(pole, arm, bulb, lamp);
    group.position.set(x, 0, z);
    return group;
  }
  for (var lz = -56; lz <= 56; lz += 16) {
    scene.add(makeStreetlamp(-13.6, lz));
    scene.add(makeStreetlamp(13.6, lz + 8));
  }

  // Palm trees for a Vice-City-ish skyline accent
  function makePalm(x, z) {
    var group = new THREE.Group();
    var trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.3, 4.2, 7),
      new THREE.MeshStandardMaterial({ color: 0x5c4326, roughness: 0.9 })
    );
    trunk.position.y = 2.1;
    trunk.rotation.z = (Math.random() - 0.5) * 0.15;
    trunk.castShadow = true;
    group.add(trunk);
    var frondMat = new THREE.MeshStandardMaterial({ color: 0x1f8f55, roughness: 0.7 });
    for (var i = 0; i < 6; i++) {
      var frond = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.6, 5), frondMat);
      frond.position.y = 4.1;
      frond.rotation.z = Math.PI / 2.4;
      frond.rotation.y = (i / 6) * Math.PI * 2;
      frond.position.x += Math.cos((i / 6) * Math.PI * 2) * 0.9;
      frond.position.z += Math.sin((i / 6) * Math.PI * 2) * 0.9;
      frond.castShadow = true;
      group.add(frond);
    }
    group.position.set(x, 0, z);
    return group;
  }
  for (var pz = -58; pz <= 58; pz += 11) {
    scene.add(makePalm(-19 - Math.random() * 2, pz));
    scene.add(makePalm(19 + Math.random() * 2, pz + 5));
  }

  // Parked cars along the curb
  var carColors = [0xd7263d, 0x2a9d8f, 0xf4a261, 0x264653, 0xe9c46a, 0x8a8d91];
  function makeCar(x, z, rotY) {
    var group = new THREE.Group();
    var color = carColors[Math.floor(Math.random() * carColors.length)];
    var bodyMat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.5, roughness: 0.35 });
    var base = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.55, 3.8), bodyMat);
    base.position.y = 0.5;
    base.castShadow = true;
    var cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 2.0), bodyMat);
    cabin.position.set(0, 0.95, -0.2);
    cabin.castShadow = true;
    var wheelMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.9 });
    var wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.3, 12);
    [[-0.95, 0.32, 1.25], [0.95, 0.32, 1.25], [-0.95, 0.32, -1.25], [0.95, 0.32, -1.25]].forEach(function (p) {
      var wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(p[0], p[1], p[2]);
      group.add(wheel);
    });
    var lightMat = new THREE.MeshStandardMaterial({ color: 0xfff4d6, emissive: 0xffe9a8, emissiveIntensity: 1.2 });
    var headlight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.05), lightMat);
    headlight.position.set(0, 0.55, 1.93);
    group.add(base, cabin, headlight);
    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    return group;
  }
  for (var cz = -50; cz <= 50; cz += 9) {
    if (Math.random() > 0.4) scene.add(makeCar(-12.3, cz, Math.PI / 2));
    if (Math.random() > 0.4) scene.add(makeCar(12.3, cz + 4, -Math.PI / 2));
  }

  // Character: two-tone capsule (jacket over jeans) with a head
  var character = new THREE.Group();
  var jacket = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.5, 0.55, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0xff3d7f, roughness: 0.55, metalness: 0.1 })
  );
  jacket.position.y = 1.55;
  jacket.castShadow = true;
  var jeans = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.48, 0.5, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x1b2a52, roughness: 0.7 })
  );
  jeans.position.y = 0.85;
  jeans.castShadow = true;
  var head = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xe0ac69, roughness: 0.6 })
  );
  head.position.y = 2.25;
  head.castShadow = true;
  var shades = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.12, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.6, roughness: 0.2 })
  );
  shades.position.set(0, 2.28, 0.37);
  character.add(jacket, jeans, head, shades);
  character.position.set(0, 0, 8);
  scene.add(character);

  // A rim light that follows the player for a neon-glow accent
  var rimLight = new THREE.PointLight(0x27e0ff, 1.4, 6, 2);
  rimLight.position.set(0, 2, 0);
  character.add(rimLight);

  // Camera rig — follows behind the character, with mouse-drag orbit
  var camYaw = 0;
  var camPitch = 0.3;
  var camDistance = 7.5;

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

    // Bound the character to the street block
    character.position.x = Math.max(-15, Math.min(15, character.position.x));
    character.position.z = Math.max(-62, Math.min(62, character.position.z));

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
