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

// ML Training Card Animation
function setupMLTrainingCard() {
  const container = document.getElementById('mlShaderContainer');
  const epochEl = document.getElementById('mlEpoch');
  const accuracyEl = document.getElementById('mlAccuracy');
  const lossEl = document.getElementById('mlLoss');
  const processingEl = document.getElementById('mlProcessing');
  const inputEl = document.getElementById('mlInput');

  if (!container) return;

  // Initialize RGBA shader
  if (typeof RGBA !== 'undefined') {
    try {
      RGBA(`
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        vec4 fade(vec4 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

        float cnoise(vec4 P){
          vec4 Pi0 = floor(P);
          vec4 Pi1 = Pi0 + 1.0;
          Pi0 = mod(Pi0, 289.0);
          Pi1 = mod(Pi1, 289.0);
          vec4 Pf0 = fract(P);
          vec4 Pf1 = Pf0 - 1.0;
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = vec4(Pi0.zzzz);
          vec4 iz1 = vec4(Pi1.zzzz);
          vec4 iw0 = vec4(Pi0.wwww);
          vec4 iw1 = vec4(Pi1.wwww);
          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);
          vec4 ixy00 = permute(ixy0 + iw0);
          vec4 ixy01 = permute(ixy0 + iw1);
          vec4 ixy10 = permute(ixy1 + iw0);
          vec4 ixy11 = permute(ixy1 + iw1);
          vec4 gx00 = ixy00 / 7.0;
          vec4 gy00 = floor(gx00) / 7.0;
          vec4 gz00 = floor(gy00) / 6.0;
          gx00 = fract(gx00) - 0.5;
          gy00 = fract(gy00) - 0.5;
          gz00 = fract(gz00) - 0.5;
          vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
          vec4 sw00 = step(gw00, vec4(0.0));
          gx00 -= sw00 * (step(0.0, gx00) - 0.5);
          gy00 -= sw00 * (step(0.0, gy00) - 0.5);
          vec4 gx01 = ixy01 / 7.0;
          vec4 gy01 = floor(gx01) / 7.0;
          vec4 gz01 = floor(gy01) / 6.0;
          gx01 = fract(gx01) - 0.5;
          gy01 = fract(gy01) - 0.5;
          gz01 = fract(gz01) - 0.5;
          vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
          vec4 sw01 = step(gw01, vec4(0.0));
          gx01 -= sw01 * (step(0.0, gx01) - 0.5);
          gy01 -= sw01 * (step(0.0, gy01) - 0.5);
          vec4 gx10 = ixy10 / 7.0;
          vec4 gy10 = floor(gx10) / 7.0;
          vec4 gz10 = floor(gy10) / 6.0;
          gx10 = fract(gx10) - 0.5;
          gy10 = fract(gy10) - 0.5;
          gz10 = fract(gz10) - 0.5;
          vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
          vec4 sw10 = step(gw10, vec4(0.0));
          gx10 -= sw10 * (step(0.0, gx10) - 0.5);
          gy10 -= sw10 * (step(0.0, gy10) - 0.5);
          vec4 gx11 = ixy11 / 7.0;
          vec4 gy11 = floor(gx11) / 7.0;
          vec4 gz11 = floor(gy11) / 6.0;
          gx11 = fract(gx11) - 0.5;
          gy11 = fract(gy11) - 0.5;
          gz11 = fract(gz11) - 0.5;
          vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
          vec4 sw11 = step(gw11, vec4(0.0));
          gx11 -= sw11 * (step(0.0, gx11) - 0.5);
          gy11 -= sw11 * (step(0.0, gy11) - 0.5);
          vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
          vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
          vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
          vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
          vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
          vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
          vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
          vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
          vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
          vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
          vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
          vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
          vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
          vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
          vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
          vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);
          vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
          g0000 *= norm00.x; g0100 *= norm00.y; g1000 *= norm00.z; g1100 *= norm00.w;
          vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
          g0001 *= norm01.x; g0101 *= norm01.y; g1001 *= norm01.z; g1101 *= norm01.w;
          vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
          g0010 *= norm10.x; g0110 *= norm10.y; g1010 *= norm10.z; g1110 *= norm10.w;
          vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
          g0011 *= norm11.x; g0111 *= norm11.y; g1011 *= norm11.z; g1111 *= norm11.w;
          float n0000 = dot(g0000, Pf0);
          float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
          float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
          float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
          float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
          float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
          float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
          float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
          float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
          float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
          float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
          float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
          float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
          float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
          float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
          float n1111 = dot(g1111, Pf1);
          vec4 fade_xyzw = fade(Pf0);
          vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
          vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
          vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
          vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
          float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
          return 2.2 * n_xyzw;
        }

        vec2 grid(vec2 uv) { return floor(uv * 25.) * 0.04; }
        float dots(vec2 uv) {
          float mx = mod(uv.x, 0.04);
          float my = mod(uv.y, 0.04);
          return step(0.027, max(mx, my));
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / resolution.xy*2.-1.;
          uv.y *= resolution.y/resolution.x;
          uv.x += time * 0.5;
          float n = cnoise(vec4(10.0 * grid(uv), 10.0 * grid(uv).x, time)) * 0.5 + 0.5;
          float n2 = cnoise(vec4(grid(uv), 10.0 * grid(uv).x, time)) * 0.5 + 0.5;
          float t = (sin(uv.x) * 0.5 + 0.5);
          vec3 fgColor = mix(vec3(0.08, 0.11, 0.14), vec3(0.27, 1.0, 0.53), pow((n + (1. - n2)) * 0.5, mix(0.1, 5., t)));
          vec3 bgColor = vec3(0.02, 0.03, 0.04);
          vec3 color = bgColor;
          if (distance(0.0, uv.y) < 0.12) { color = mix(vec3(0.08, 0.11, 0.14), bgColor, dots(uv)); }
          if (distance(0.0, uv.y) < (floor(t * n * 7.) * 0.04)) { color = mix(fgColor, bgColor, dots(uv)); }
          if (distance((1. - n2) - 0.5, uv.y) < 0.1) { color = mix(fgColor, bgColor, dots(uv)); }
          gl_FragColor = vec4(color, 1.);
        }
      `, container);
    } catch (e) {
      console.log('RGBA shader initialization skipped');
    }
  }

  // ML Training data simulation
  const dataInputs = [
    'SOL/USDC PRICE DATA',
    'LENDING RATES KAMINO',
    'LP POSITIONS ORCA',
    'DRIFT PERP FUNDING',
    'MARGINFI UTILIZATION',
    'JUPITER ROUTES',
    'METEORA POOLS',
    'RAYDIUM VOLUME'
  ];

  let epoch = 0;
  let accuracy = 75.0;
  let loss = 0.15;

  function updateMLMetrics() {
    epoch++;
    accuracy = Math.min(99.9, accuracy + (Math.random() * 0.5 - 0.1));
    loss = Math.max(0.001, loss - (Math.random() * 0.005));

    if (epochEl) epochEl.textContent = epoch;
    if (accuracyEl) accuracyEl.textContent = accuracy.toFixed(1) + '%';
    if (lossEl) lossEl.textContent = loss.toFixed(4);
    if (inputEl) inputEl.textContent = dataInputs[epoch % dataInputs.length];

    // Update processing bar
    if (processingEl) {
      const progress = Math.floor(Math.random() * 5) + 5;
      const bar = '█'.repeat(progress) + '░'.repeat(10 - progress);
      processingEl.textContent = bar;
    }
  }

  setInterval(updateMLMetrics, 800);
}

// Initialize new effects
document.addEventListener('DOMContentLoaded', () => {
  setupGeminiEffect();
  setupEncryptedText();
  setupMLTrainingCard();
});
