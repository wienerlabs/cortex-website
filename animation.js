let startClickSound,
  preloaderSound,
  scrollSound1,
  scrollSound2,
  scrollSound3,
  backgroundMusic;
let isBackgroundPlaying = true;
let currentSection = 1;
let isScrolling = false;
let circleTransitions = [];

function setupGeometricBackground() {
  const gridLinesGroup = document.getElementById("grid-lines");
  const circlesOutlineGroup = document.getElementById("circles-outline");
  const circlesFilledGroup = document.querySelector("#circles-filled > g");
  if (!gridLinesGroup || !circlesOutlineGroup || !circlesFilledGroup) return;

  const gridSpacing = 48;
  for (let i = 0; i <= 40; i++) {
    const vLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    vLine.setAttribute("class", "grid-line");
    vLine.setAttribute("x1", i * gridSpacing);
    vLine.setAttribute("y1", 0);
    vLine.setAttribute("x2", i * gridSpacing);
    vLine.setAttribute("y2", 1080);
    gridLinesGroup.appendChild(vLine);
    if (i <= 22) {
      const hLine = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      hLine.setAttribute("class", "grid-line");
      hLine.setAttribute("x1", 0);
      hLine.setAttribute("y1", i * gridSpacing);
      hLine.setAttribute("x2", 1920);
      hLine.setAttribute("y2", i * gridSpacing);
      gridLinesGroup.appendChild(hLine);
    }
  }

  const d = 80;
  const centerX = 960;
  const centerY = 540;
  circleTransitions = [
    {
      initial: { cx: centerX - 3 * d, cy: centerY, r: d * 0.8 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX + 3 * d, cy: centerY, r: d * 0.8 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX, cy: centerY - 3 * d, r: d * 0.8 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX, cy: centerY + 3 * d, r: d * 0.8 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX - 2 * d, cy: centerY - 2 * d, r: d * 0.6 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX + 2 * d, cy: centerY - 2 * d, r: d * 0.6 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX - 2 * d, cy: centerY + 2 * d, r: d * 0.6 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX + 2 * d, cy: centerY + 2 * d, r: d * 0.6 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX - 4 * d, cy: centerY, r: d * 0.4 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX + 4 * d, cy: centerY, r: d * 0.4 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX, cy: centerY - 4 * d, r: d * 0.4 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX, cy: centerY + 4 * d, r: d * 0.4 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    },
    {
      initial: { cx: centerX, cy: centerY, r: d * 0.3 },
      final: { cx: centerX, cy: centerY, r: 4 * d }
    }
  ];

  circleTransitions.forEach((transition, index) => {
    const circleOutline = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circleOutline.setAttribute("class", "circle-outline");
    circleOutline.setAttribute("cx", transition.initial.cx);
    circleOutline.setAttribute("cy", transition.initial.cy);
    circleOutline.setAttribute("r", transition.initial.r);
    circlesOutlineGroup.appendChild(circleOutline);

    const circleFilled = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circleFilled.setAttribute("class", "circle-filled");
    circleFilled.setAttribute("cx", transition.initial.cx);
    circleFilled.setAttribute("cy", transition.initial.cy);
    circleFilled.setAttribute("r", transition.initial.r);
    circlesFilledGroup.appendChild(circleFilled);

    transition.outlineCircle = circleOutline;
    transition.filledCircle = circleFilled;
  });
}

document.getElementById("enableBtn").onclick = function () {
  document.body.classList.add("loading-active");
  startClickSound = document.getElementById("startClickSound");
  preloaderSound = document.getElementById("preloaderSound");
  scrollSound1 = document.getElementById("scrollSound1");
  scrollSound2 = document.getElementById("scrollSound2");
  scrollSound3 = document.getElementById("scrollSound3");
  backgroundMusic = document.getElementById("backgroundMusic");

  if (startClickSound) startClickSound.play().catch((e) => {});
  document.querySelector(".audio-enable").style.display = "none";
  document.getElementById("preloader").style.display = "flex";
  if (preloaderSound) preloaderSound.play().catch((e) => {});

  setTimeout(() => {
    if (backgroundMusic) {
      backgroundMusic.volume = 0.5;
      backgroundMusic.play().catch((e) => {});
    }
  }, 500);

  let count = 0;
  const timer = setInterval(() => {
    count++;
    document.getElementById(
      "counter"
    ).textContent = `[${count.toString().padStart(3, "0")}]`;
    if (count >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        if (preloaderSound) {
          preloaderSound.pause();
          preloaderSound.currentTime = 0;
        }
        document.body.classList.remove("loading-active");
        setupGeometricBackground();
        startAnimations();
        setupSectionScrollSounds();
      }, 500);
    }
  }, 50);
};

function setupSectionScrollSounds() {
  let scrollTimeout;

  function getCurrentSection() {
    const scrollY = window.scrollY;
    const sectionHeight = window.innerHeight * 2;
    if (scrollY < sectionHeight) return 1;
    else if (scrollY < sectionHeight * 2) return 2;
    else return 3;
  }

  function stopAllScrollSounds() {
    [scrollSound1, scrollSound2, scrollSound3].forEach((sound) => {
      if (sound && !sound.paused) {
        sound.pause();
        sound.currentTime = 0;
      }
    });
  }

  window.addEventListener("scroll", () => {
    const newSection = getCurrentSection();
    isScrolling = true;
    if (newSection !== currentSection) {
      stopAllScrollSounds();
      currentSection = newSection;
    }
    const currentScrollSound = eval(`scrollSound${currentSection}`);
    if (currentScrollSound && currentScrollSound.paused) {
      currentScrollSound.currentTime = 0;
      currentScrollSound.play().catch((e) => {});
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      stopAllScrollSounds();
      isScrolling = false;
    }, 150);
  });
}

function startAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Enhanced Navigation
  const navLinks = document.querySelectorAll(".nav-link[data-section]");
  const sections = document.querySelectorAll("section[id]");
  const header = document.getElementById("site-header");
  const progressBar = document.getElementById("scrollProgress");

  // Smooth scroll for nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const sectionId = link.getAttribute("data-section");
      const section = document.getElementById(sectionId);
      if (section) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = section.offsetTop - headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Update active nav on scroll
  function updateActiveNav() {
    const scrollY = window.scrollY;
    const headerHeight = header ? header.offsetHeight : 0;

    // Update progress bar
    if (progressBar) {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollY / maxScroll) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    // Add scrolled class to header
    if (header) {
      if (scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Find current section
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    // Update active class
    navLinks.forEach((link) => {
      const linkSection = link.getAttribute("data-section");
      if (linkSection === currentSectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  // Hover effects for nav items
  document.querySelectorAll(".main-nav li").forEach((navItem) => {
    const square = navItem.querySelector(".nav-hover-square");
    const link = navItem.querySelector(".nav-link");
    const hoverSound = document.getElementById("hoverSound");

    navItem.addEventListener("mouseenter", () => {
      if (!link.classList.contains("active")) {
        gsap.to(square, { scaleX: 1, duration: 0.3, ease: "power2.out" });
      }
      if (hoverSound) {
        hoverSound.currentTime = 0;
        hoverSound.volume = 0.3;
        hoverSound.play().catch((e) => {});
      }
    });
    navItem.addEventListener("mouseleave", () => {
      if (!link.classList.contains("active")) {
        gsap.to(square, { scaleX: 0, duration: 0.2, ease: "power2.in" });
      }
    });
  });

  // Sound toggle
  const soundToggle = document.getElementById("soundToggle");
  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      soundToggle.classList.toggle("muted");
      const isMuted = soundToggle.classList.contains("muted");
      if (backgroundMusic) {
        backgroundMusic.muted = isMuted;
      }
      [scrollSound1, scrollSound2, scrollSound3].forEach((sound) => {
        if (sound) sound.muted = isMuted;
      });
    });
  }

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  gsap.to(".gradient-reveal", {
    y: "-500vh",
    duration: 2,
    ease: "power2.inOut",
    delay: 0.25
  });
  gsap.to(".preloader", {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.inOut",
    delay: 1.0,
    onComplete: () => {
      document.getElementById("preloader").style.display = "none";
    }
  });

  gsap.utils.toArray(".section").forEach((section) => {
    gsap.to(section, {
      backgroundPositionY: "50%",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1
      }
    });
  });

  const circle = document.getElementById("glowCircle");
  const debugLine1 = document.getElementById("debugLine1");
  const debugLine2 = document.getElementById("debugLine2");
  const debugLine3 = document.getElementById("debugLine3");
  const debugLine4 = document.getElementById("debugLine4");
  if (!circle) return;

  let animationFrame;
  function updateAnimations() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / maxScroll, 1);

    const footerStart =
      document.querySelector(".site-footer").offsetTop - window.innerHeight;
    const footerProgress = Math.max(
      0,
      (scrollY - footerStart) / (window.innerHeight * 0.5)
    );
    const textOpacity = Math.max(0, 1 - footerProgress * 2);
    document.querySelectorAll(".geometric-text").forEach((text) => {
      text.style.opacity = textOpacity;
    });

    let tvlState, agentState, apyState, statusState;
    const tvlValue = (progress * 12.5).toFixed(2);
    const apyValue = (8 + progress * 24).toFixed(1);

    if (progress <= 0.1) {
      tvlState = `TVL: $${tvlValue}M`;
      agentState = `AGENTS: INITIALIZING`;
      apyState = `APY: ${apyValue}%`;
    } else if (progress <= 0.25) {
      tvlState = `TVL: $${tvlValue}M`;
      agentState = `AGENTS: SCANNING`;
      apyState = `APY: ${apyValue}%`;
    } else if (progress <= 0.5) {
      tvlState = `TVL: $${tvlValue}M`;
      agentState = `AGENTS: ANALYZING`;
      apyState = `APY: ${apyValue}%`;
    } else if (progress <= 0.75) {
      tvlState = `TVL: $${tvlValue}M`;
      agentState = `AGENTS: EXECUTING`;
      apyState = `APY: ${apyValue}%`;
    } else if (progress <= 0.9) {
      tvlState = `TVL: $${tvlValue}M`;
      agentState = `AGENTS: OPTIMIZING`;
      apyState = `APY: ${apyValue}%`;
    } else {
      tvlState = `TVL: $${tvlValue}M`;
      agentState = `AGENTS: HARVESTING`;
      apyState = `APY: ${apyValue}%`;
    }

    const networkHealth = Math.max(0, 1 - progress);
    if (networkHealth > 0.8) {
      statusState = `STATUS: DEVNET`;
    } else if (networkHealth > 0.6) {
      statusState = `STATUS: TESTNET`;
    } else if (networkHealth > 0.4) {
      statusState = `STATUS: STAGING`;
    } else if (networkHealth > 0.2) {
      statusState = `STATUS: AUDITING`;
    } else {
      statusState = `STATUS: MAINNET`;
    }

    const scale = 1 + progress * 1.8;
    const shadowSize = progress * 150;
    const shadowSpread = progress * 35;
    const shadowOpacity = progress;
    circle.style.transform = `scale(${scale})`;
    circle.style.transformOrigin = "center center";
    circle.style.boxShadow = `0 0 ${shadowSize}px ${shadowSpread}px rgba(255, 255, 0, ${shadowOpacity})`;

    const gridOpacity = Math.max(0, 0.3 * (1 - progress * 1.5));
    document.querySelectorAll(".grid-line").forEach((line) => {
      line.setAttribute("stroke-opacity", gridOpacity);
    });

    circleTransitions.forEach((transition, index) => {
      const currentCx =
        transition.initial.cx +
        (transition.final.cx - transition.initial.cx) * progress;
      const currentCy =
        transition.initial.cy +
        (transition.final.cy - transition.initial.cy) * progress;
      const currentR =
        transition.initial.r +
        (transition.final.r - transition.initial.r) * progress;
      const rotation = progress * 360 * (index % 2 === 0 ? 1 : -1);
      const opacity = Math.max(0.1, 1 - progress * 0.7);

      if (transition.outlineCircle) {
        transition.outlineCircle.setAttribute("cx", currentCx);
        transition.outlineCircle.setAttribute("cy", currentCy);
        transition.outlineCircle.setAttribute("r", currentR);
        transition.outlineCircle.setAttribute(
          "transform",
          `rotate(${rotation} ${currentCx} ${currentCy})`
        );
        transition.outlineCircle.setAttribute("stroke-opacity", opacity);
      }
      if (transition.filledCircle) {
        transition.filledCircle.setAttribute("cx", currentCx);
        transition.filledCircle.setAttribute("cy", currentCy);
        transition.filledCircle.setAttribute("r", currentR);
        transition.filledCircle.setAttribute(
          "transform",
          `rotate(${rotation} ${currentCx} ${currentCy})`
        );
        transition.filledCircle.setAttribute("fill-opacity", opacity * 0.05);
      }
    });

    if (debugLine1) debugLine1.textContent = tvlState;
    if (debugLine2) debugLine2.textContent = agentState;
    if (debugLine3) debugLine3.textContent = apyState;
    if (debugLine4) debugLine4.textContent = statusState;
  }

  window.addEventListener("scroll", () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(updateAnimations);
  });
  updateAnimations();
}

// Gemini Effect - Scroll-based SVG path animation
function setupGeminiEffect() {
  const geminiSection = document.querySelector('.gemini-section');
  const paths = document.querySelectorAll('.gemini-path');

  if (!geminiSection || paths.length === 0) return;

  // Initial offsets for staggered animation
  const initialOffsets = [0.8, 0.85, 0.9, 0.95, 1.0];

  paths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  function updateGeminiPaths() {
    const rect = geminiSection.getBoundingClientRect();
    const sectionHeight = geminiSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Check if section is in view and toggle class
    const isInView = rect.top < viewportHeight && rect.bottom > 0;
    if (isInView) {
      geminiSection.classList.add('in-view');
    } else {
      geminiSection.classList.remove('in-view');
    }

    // Calculate progress (0 to 1) based on scroll position
    const scrolled = viewportHeight - rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / (sectionHeight - viewportHeight * 0.5)));

    paths.forEach((path, index) => {
      const length = path.getTotalLength();
      const delay = initialOffsets[index] || 1;
      const adjustedProgress = Math.max(0, (progress - (1 - delay) * 0.2) / (1 - (1 - delay) * 0.2));
      const drawLength = length * (1 - Math.max(0, Math.min(1, adjustedProgress * 1.2)));
      path.style.strokeDashoffset = drawLength;
    });
  }

  window.addEventListener('scroll', updateGeminiPaths);
  updateGeminiPaths();
}

// Encrypted Text Effect - Scramble on hover
function setupEncryptedText() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';

  // Select all paragraph texts in sections (excluding headings)
  const textElements = document.querySelectorAll('.section-desc, .feature-item p, .ai-card-desc, .tier-item p, .flow-step p');

  textElements.forEach(element => {
    const originalText = element.textContent;
    element.dataset.originalText = originalText;
    element.classList.add('encrypt-text');

    let animationId = null;
    let isAnimating = false;

    element.addEventListener('mouseenter', () => {
      if (isAnimating) return;
      isAnimating = true;

      const text = element.dataset.originalText;
      let revealCount = 0;
      const totalChars = text.length;

      // Scramble first
      let scrambled = text.split('').map(char =>
        char === ' ' ? ' ' : charset[Math.floor(Math.random() * charset.length)]
      ).join('');
      element.textContent = scrambled;

      // Reveal progressively - faster animation (10ms per char, reveal 3 chars at a time)
      const revealInterval = setInterval(() => {
        if (revealCount >= totalChars) {
          clearInterval(revealInterval);
          element.textContent = text;
          isAnimating = false;
          return;
        }

        let result = '';
        for (let i = 0; i < totalChars; i++) {
          if (text[i] === ' ') {
            result += ' ';
          } else if (i < revealCount) {
            result += text[i];
          } else {
            result += charset[Math.floor(Math.random() * charset.length)];
          }
        }
        element.textContent = result;
        revealCount += 3; // Reveal 3 characters at a time
      }, 8); // Much faster interval
    });

    element.addEventListener('mouseleave', () => {
      // Quick reset if still animating
      setTimeout(() => {
        element.textContent = originalText;
        isAnimating = false;
      }, 100);
    });
  });
}

// ML Training Card Animation - Advanced
function setupMLTrainingCard() {
  const epochEl = document.getElementById('mlEpoch');
  const accuracyEl = document.getElementById('mlAccuracy');
  const lossEl = document.getElementById('mlLoss');
  const lrEl = document.getElementById('mlLR');
  const batchEl = document.getElementById('mlBatch');
  const currentDataEl = document.getElementById('currentData');
  const consoleEl = document.getElementById('mlConsole');
  const progressEl = document.getElementById('mlProgress');
  const lossCanvas = document.getElementById('lossCanvas');
  const connectionsGroup = document.getElementById('nnConnections');

  if (!epochEl) return;

  // Connection mapping for proper flow animation
  const connectionMap = {
    inputToHidden1: [],
    hidden1ToHidden2: [],
    hidden2ToOutput: []
  };

  // Draw neural network connections with IDs
  function drawConnections() {
    if (!connectionsGroup) return;
    let svg = '';
    let connId = 0;

    // Input (6 nodes) to Hidden1 (5 nodes)
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        const x1 = 40, y1 = 30 + i * 30;
        const x2 = 110, y2 = 40 + j * 35;
        svg += `<line class="nn-connection" id="conn-0-${connId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
        connectionMap.inputToHidden1.push(`conn-0-${connId}`);
        connId++;
      }
    }

    connId = 0;
    // Hidden1 (5 nodes) to Hidden2 (4 nodes)
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 4; j++) {
        const x1 = 110, y1 = 40 + i * 35;
        const x2 = 180, y2 = 55 + j * 40;
        svg += `<line class="nn-connection" id="conn-1-${connId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
        connectionMap.hidden1ToHidden2.push(`conn-1-${connId}`);
        connId++;
      }
    }

    connId = 0;
    // Hidden2 (4 nodes) to Output (2 nodes)
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        const x1 = 180, y1 = 55 + i * 40;
        const x2 = 250, y2 = 85 + j * 50;
        svg += `<line class="nn-connection" id="conn-2-${connId}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
        connectionMap.hidden2ToOutput.push(`conn-2-${connId}`);
        connId++;
      }
    }

    connectionsGroup.innerHTML = svg;
  }

  drawConnections();

  // Proper sequential forward pass animation
  let isAnimating = false;

  function animateForwardPass() {
    if (isAnimating) return;
    isAnimating = true;

    const layers = [
      Array.from(document.querySelectorAll('.input-layer .nn-node')),
      Array.from(document.querySelectorAll('.hidden-layer-1 .nn-node')),
      Array.from(document.querySelectorAll('.hidden-layer-2 .nn-node')),
      Array.from(document.querySelectorAll('.output-layer .nn-node'))
    ];

    const connectionGroups = [
      connectionMap.inputToHidden1,
      connectionMap.hidden1ToHidden2,
      connectionMap.hidden2ToOutput
    ];

    // Step 1: Activate input layer
    setTimeout(() => {
      layers[0].forEach(n => n.classList.add('active'));
    }, 0);

    // Step 2: Signal flows to hidden1
    setTimeout(() => {
      connectionGroups[0].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
      });
    }, 150);

    // Step 3: Deactivate input, activate hidden1
    setTimeout(() => {
      layers[0].forEach(n => n.classList.remove('active'));
      connectionGroups[0].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });
      layers[1].forEach(n => n.classList.add('active'));
    }, 350);

    // Step 4: Signal flows to hidden2
    setTimeout(() => {
      connectionGroups[1].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
      });
    }, 500);

    // Step 5: Deactivate hidden1, activate hidden2
    setTimeout(() => {
      layers[1].forEach(n => n.classList.remove('active'));
      connectionGroups[1].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });
      layers[2].forEach(n => n.classList.add('active'));
    }, 700);

    // Step 6: Signal flows to output
    setTimeout(() => {
      connectionGroups[2].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('active');
      });
    }, 850);

    // Step 7: Deactivate hidden2, activate output
    setTimeout(() => {
      layers[2].forEach(n => n.classList.remove('active'));
      connectionGroups[2].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
      });
      layers[3].forEach(n => n.classList.add('active'));
    }, 1050);

    // Step 8: Flash output and reset
    setTimeout(() => {
      layers[3].forEach(n => n.classList.remove('active'));
      isAnimating = false;
    }, 1400);
  }

  // Loss graph
  const lossHistory = [];
  const maxHistory = 50;

  function drawLossGraph() {
    if (!lossCanvas) return;
    const ctx = lossCanvas.getContext('2d');
    const width = lossCanvas.width;
    const height = lossCanvas.height;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(68, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (lossHistory.length < 2) return;

    // Loss line
    ctx.strokeStyle = '#44ff88';
    ctx.lineWidth = 2;
    ctx.beginPath();

    const maxLoss = Math.max(...lossHistory, 0.5);
    lossHistory.forEach((lossVal, i) => {
      const x = (i / (maxHistory - 1)) * width;
      const y = height - (lossVal / maxLoss) * height * 0.9;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    ctx.shadowColor = '#44ff88';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // Console - sequential log messages (no duplicates)
  let logIndex = 0;
  const logSequence = [
    '[INIT] Loading CORTEX Agent v2.1...',
    '[LOAD] Initializing neural network weights',
    '[DATA] Connecting to Solana RPC endpoint',
    '[DATA] Fetching SOL/USDC price: $98.42',
    '[TRAIN] Forward pass → 6→5→4→2 nodes',
    '[TRAIN] Computing cross-entropy loss',
    '[OPTIM] Backpropagation started',
    '[OPTIM] Gradient descent (Adam β1=0.9)',
    '[DATA] Kamino lending APY: 12.4%',
    '[TRAIN] Weights updated successfully',
    '[EVAL] Validation loss: {loss}',
    '[DATA] Drift perp funding: +0.021%',
    '[TRAIN] Epoch {epoch} complete',
    '[SAVE] Model checkpoint saved',
    '[DATA] Orca SOL/USDC pool TVL: $2.4M',
    '[OPTIM] Learning rate: {lr}',
    '[DATA] Jupiter routing: 3 hops optimal',
    '[TRAIN] Batch size: {batch}',
    '[EVAL] Accuracy improved to {accuracy}%',
    '[DATA] Marginfi utilization: 78%',
    '[TRAIN] Gradient norm: 0.0042',
    '[DATA] Meteora DLMM bin: 142',
    '[INFO] GPU memory: 847MB / 4096MB',
    '[DATA] Raydium CLMM tick: 95-105',
    '[TRAIN] Loss decreased by {delta}%',
    '[SYNC] Model synced to chain'
  ];

  function addConsoleLog(state) {
    if (!consoleEl) return;

    const template = logSequence[logIndex % logSequence.length];
    logIndex++;

    const msg = template
      .replace('{accuracy}', state.accuracy.toFixed(1))
      .replace('{epoch}', state.epoch)
      .replace('{loss}', state.loss.toFixed(4))
      .replace('{lr}', state.lr.toFixed(6))
      .replace('{batch}', state.batch)
      .replace('{delta}', (Math.random() * 1.5 + 0.1).toFixed(2));

    const line = document.createElement('div');
    line.className = 'console-line';
    line.textContent = msg;
    consoleEl.appendChild(line);

    // Keep only last 3 lines for readability
    while (consoleEl.children.length > 3) {
      consoleEl.removeChild(consoleEl.firstChild);
    }
  }

  // Real DeFi data sources with realistic values
  const dataFeeds = [
    { name: 'SOL_PRICE', value: () => `$${(95 + Math.random() * 10).toFixed(2)}` },
    { name: 'KAMINO_APY', value: () => `${(8 + Math.random() * 6).toFixed(1)}%` },
    { name: 'ORCA_TVL', value: () => `$${(1.8 + Math.random() * 1.2).toFixed(1)}M` },
    { name: 'DRIFT_FUNDING', value: () => `${(Math.random() > 0.5 ? '+' : '-')}${(Math.random() * 0.05).toFixed(3)}%` },
    { name: 'MARGINFI_UTIL', value: () => `${(65 + Math.random() * 25).toFixed(0)}%` },
    { name: 'JUP_ROUTES', value: () => `${Math.floor(2 + Math.random() * 4)} hops` },
    { name: 'METEORA_BIN', value: () => `#${Math.floor(100 + Math.random() * 100)}` },
    { name: 'RAY_VOLUME', value: () => `$${(0.5 + Math.random() * 2).toFixed(1)}M` }
  ];

  // Training state
  let epoch = 0;
  let accuracy = 68.0;
  let loss = 0.42;
  let batch = 64;
  let lr = 0.001;
  const totalEpochs = 500;

  function updateTraining() {
    epoch++;

    // Reset at totalEpochs for continuous loop
    if (epoch > totalEpochs) {
      epoch = 1;
      accuracy = 68.0;
      loss = 0.42;
      lr = 0.001;
      lossHistory.length = 0;
    }

    const progress = epoch / totalEpochs;
    const noise = (Math.random() - 0.5) * 0.015;

    // Realistic exponential decay for loss
    loss = Math.max(0.008, 0.42 * Math.exp(-4 * progress) + noise);

    // Accuracy with plateau effect
    accuracy = Math.min(98.7, 68 + 30 * (1 - Math.exp(-5 * progress)) + noise * 8);

    // Learning rate decay
    lr = 0.001 * Math.pow(0.995, epoch);

    // Batch size varies
    batch = [32, 64, 64, 128][epoch % 4];

    // Update UI
    epochEl.textContent = epoch;
    if (accuracyEl) accuracyEl.textContent = accuracy.toFixed(1) + '%';
    if (lossEl) lossEl.textContent = loss.toFixed(4);
    if (lrEl) lrEl.textContent = lr.toFixed(6);
    if (batchEl) batchEl.textContent = batch;

    // Update current data feed
    if (currentDataEl) {
      const feed = dataFeeds[epoch % dataFeeds.length];
      currentDataEl.textContent = `${feed.name}: ${feed.value()}`;
    }

    // Progress bar (resets every 50 epochs)
    if (progressEl) {
      progressEl.style.width = ((epoch % 50) / 50 * 100) + '%';
    }

    // Update loss graph
    lossHistory.push(loss);
    if (lossHistory.length > maxHistory) lossHistory.shift();
    drawLossGraph();

    // Animate neural network every 3 epochs
    if (epoch % 3 === 0) animateForwardPass();

    // Add console log every 2 epochs
    if (epoch % 2 === 0) {
      addConsoleLog({ epoch, accuracy, loss, lr, batch });
    }
  }

  // Initial setup
  consoleEl.innerHTML = '';
  addConsoleLog({ epoch: 0, accuracy, loss, lr, batch });

  // Start training loop (slower for readability)
  setInterval(updateTraining, 800);
}

// Real-time Data Stream
function setupDataStream() {
  const dataStreamEl = document.getElementById('dataStream');
  if (!dataStreamEl) return;

  // Cached real data (updated periodically)
  let realData = {
    solPrice: 98.50,
    solChange: 2.3,
    solVolume: 2.4,
    lastUpdate: 0
  };

  // Fetch real SOL price from CoinGecko (free, no API key needed)
  async function fetchRealData() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true',
        { cache: 'no-store' }
      );
      const data = await response.json();
      if (data.solana) {
        realData.solPrice = data.solana.usd;
        realData.solChange = data.solana.usd_24h_change || 0;
        realData.solVolume = (data.solana.usd_24h_vol / 1000000000).toFixed(1);
        realData.lastUpdate = Date.now();
      }
    } catch (e) {
      // Fallback to simulated data on error
    }
  }

  // Data line templates using real + simulated DeFi data
  function generateDataLines() {
    const price = realData.solPrice.toFixed(2);
    const change = realData.solChange >= 0 ? `+${realData.solChange.toFixed(1)}` : realData.solChange.toFixed(1);
    const vol = realData.solVolume;

    return [
      `SOL/USDC $${price} ▸ VOL 24h: $${vol}B ▸ CHG: ${change}%`,
      `KAMINO kSOL APY: ${(10 + Math.random() * 5).toFixed(1)}% ▸ TVL: $${(800 + Math.random() * 200).toFixed(0)}M ▸ UTIL: ${(75 + Math.random() * 15).toFixed(0)}%`,
      `DRIFT SOL-PERP FUNDING: ${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 0.03).toFixed(3)}% ▸ OI: $${(10 + Math.random() * 8).toFixed(1)}M`,
      `MARGINFI LEND: ${(8 + Math.random() * 4).toFixed(1)}% ▸ BORROW: ${(12 + Math.random() * 6).toFixed(1)}% ▸ POOL: $${(400 + Math.random() * 200).toFixed(0)}M`,
      `JUPITER ROUTE: ${Math.floor(2 + Math.random() * 3)} HOPS ▸ SLIPPAGE: ${(Math.random() * 0.3).toFixed(2)}% ▸ FEE: $${(Math.random() * 0.5).toFixed(3)}`
    ];
  }

  function updateDataStream() {
    const lines = dataStreamEl.querySelectorAll('.data-line');
    const dataLines = generateDataLines();

    lines.forEach((line, i) => {
      if (dataLines[i]) {
        line.textContent = dataLines[i];
      }
    });
  }

  // Initial fetch and setup
  fetchRealData();
  updateDataStream();

  // Update data every 2 seconds
  setInterval(updateDataStream, 2000);

  // Fetch fresh real data every 30 seconds (CoinGecko rate limit friendly)
  setInterval(fetchRealData, 30000);
}

// Initialize new effects
document.addEventListener('DOMContentLoaded', () => {
  setupGeminiEffect();
  setupEncryptedText();
  setupMLTrainingCard();
  setupDataStream();
});
