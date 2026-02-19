<script setup lang="ts">
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "#services" },
    { name: "Partner", path: "#partners" },
    { name: "About", path: "#about" },
  ];

  const isScrolled = ref(false);
  const isMobileMenuOpen = ref(false);
  const headerRef = ref<HTMLElement | null>(null);
  const logoRef = ref<HTMLElement | null>(null);
  const navRef = ref<HTMLElement | null>(null);
  const actionsRef = ref<HTMLElement | null>(null);
  const fullscreenMenuRef = ref<HTMLElement | null>(null);

  // Animation composable
  const { animateHeaderBackground, animateMenuOpen, animateMenuClose, initAnimations } =
    useHeaderAnimations();

  const handleScroll = () => {
    const scrollY = window.scrollY;
    isScrolled.value = scrollY > 50;
    animateHeaderBackground(headerRef, scrollY);
  };

  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;

    if (isMobileMenuOpen.value) {
      animateMenuOpen(fullscreenMenuRef);
    } else {
      animateMenuClose(fullscreenMenuRef);
    }
  };

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);

    initAnimations({
      headerRef,
      logoRef,
      navRef,
      actionsRef,
      fullscreenMenuRef,
    });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
    document.body.style.overflow = "";
  });
</script>

<template>
  <header ref="headerRef" class="header">
    <div class="container-fluid header-inner">
      <NuxtLink ref="logoRef" to="/" class="logo">
        <img src="~/assets/images/Logo.png" alt="Dasa Logo" />
      </NuxtLink>

      <nav ref="navRef" class="nav">
        <ul class="nav-list">
          <li v-for="link in navLinks" :key="link.name">
            <NuxtLink :to="link.path" class="nav-link">
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div ref="actionsRef" class="actions">
        <BaseButton variant="secondary" size="sm">EN</BaseButton>
        <BaseButton to="#contact" variant="primary" size="sm">Connect</BaseButton>
      </div>

      <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
        <span class="hamburger" :class="{ 'hamburger--active': isMobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>

    <!-- Fullscreen Menu Overlay -->
    <div ref="fullscreenMenuRef" class="fullscreen-menu">
      <div class="fullscreen-menu__container">
        <nav class="fullscreen-menu__nav">
          <ul class="fullscreen-menu__list">
            <li v-for="(link, index) in navLinks" :key="link.name">
              <NuxtLink :to="link.path" class="fullscreen-menu__link" @click="toggleMobileMenu">
                <span class="fullscreen-menu__link-number">0{{ index + 1 }}</span>
                <span class="fullscreen-menu__link-text">{{ link.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="fullscreen-menu__actions">
          <BaseButton variant="primary" size="lg" to="#contact" @click="toggleMobileMenu">
            Let's Connect
          </BaseButton>
          <BaseButton variant="secondary" size="md" @click="toggleMobileMenu">EN</BaseButton>
        </div>

        <div class="fullscreen-menu__footer">
          <p class="fullscreen-menu__copyright">© 2026 Dasa. All rights reserved.</p>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
  .header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    height: var(--header-height);
    transition: all 0.3s ease;
    background: transparent;
  }

  .header-inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-8) var(--spacing-12);
    max-width: var(--container-width);
    margin: 0 auto;
  }

  .logo {
    display: flex;
    align-items: center;
    z-index: 1000;
  }

  .logo img {
    height: 32px;
    width: auto;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    filter: brightness(1);
  }

  .logo:hover img {
    transform: scale(1.08) rotate(-2deg);
    filter: brightness(1.1) drop-shadow(0 0 8px rgba(238, 93, 34, 0.4));
  }

  .nav {
    display: flex;
    align-items: center;
  }

  .nav--hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .nav-list {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-link {
    color: var(--dt-white);
    font-size: var(--font-size-sm);
    font-weight: 500;
    opacity: 0.8;
    position: relative;
    padding: var(--spacing-2) 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
  }

  .nav-link::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--dt-orange), transparent);
    transform: translateX(-50%);
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-link::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(circle, rgba(238, 93, 34, 0.2), transparent 70%);
    transform: translate(-50%, -50%);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;
    z-index: -1;
  }

  .nav-link:hover {
    opacity: 1;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 0.5px;
  }

  .nav-link:hover::before {
    width: 100%;
  }

  .nav-link:hover::after {
    width: 120%;
    height: 120%;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-3);
    z-index: 1000;
  }

  .actions--hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  .mobile-menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 1000;
    padding: 0;
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.3s ease,
      visibility 0.3s ease;
  }

  .mobile-menu-toggle--visible {
    display: flex;
    opacity: 1;
    visibility: visible;
  }

  .hamburger {
    width: 24px;
    height: 18px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .hamburger span {
    display: block;
    width: 100%;
    height: 2px;
    background: var(--dt-white);
    transition: all 0.3s ease;
    border-radius: 2px;
  }

  .hamburger--active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger--active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger--active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  /* Fullscreen Menu */
  .fullscreen-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: var(--dt-black);
    z-index: 999;
    display: none;
    align-items: center;
    justify-content: center;
    clip-path: circle(0% at 100% 0%);
    overflow: hidden;
  }

  .fullscreen-menu::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .fullscreen-menu__container {
    width: 100%;
    max-width: 900px;
    padding: var(--spacing-12);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-16);
  }

  .fullscreen-menu__nav {
    width: 100%;
  }

  .fullscreen-menu__list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2);
    align-items: center;
  }

  .fullscreen-menu__link {
    display: flex;
    align-items: center;
    gap: var(--spacing-6);
    padding: var(--spacing-4) var(--spacing-6);
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700;
    color: var(--dt-white);
    text-decoration: none;
    position: relative;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    opacity: 1;
  }

  .fullscreen-menu__link::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 2px;
    background: var(--dt-orange);
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fullscreen-menu__link:hover {
    color: var(--dt-orange);
    transform: translateX(20px);
    letter-spacing: 2px;
  }

  .fullscreen-menu__link:hover::before {
    width: 60px;
  }

  .fullscreen-menu__link-number {
    font-size: clamp(0.875rem, 2vw, 1.25rem);
    font-weight: 400;
    opacity: 0.5;
    font-family: var(--font-mono);
  }

  .fullscreen-menu__link-text {
    position: relative;
  }

  .fullscreen-menu__actions {
    display: flex;
    gap: var(--spacing-4);
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  .fullscreen-menu__footer {
    text-align: center;
  }

  .fullscreen-menu__copyright {
    font-size: var(--font-size-sm);
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    .header-inner {
      padding: var(--spacing-6) var(--spacing-8);
    }

    .nav-list {
      gap: 1.5rem;
    }

    .nav-link {
      font-size: var(--font-size-xs);
    }

    .fullscreen-menu__container {
      padding: var(--spacing-10);
    }

    .fullscreen-menu__link {
      font-size: clamp(1.75rem, 5vw, 3rem);
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .header {
      height: 70px;
    }

    .header-inner {
      padding: var(--spacing-4) var(--spacing-6);
    }

    .logo img {
      height: 28px;
    }

    .nav {
      display: none;
    }

    .actions {
      display: none;
    }

    .mobile-menu-toggle {
      display: flex;
      opacity: 1;
      visibility: visible;
    }

    .fullscreen-menu__container {
      padding: var(--spacing-8);
      gap: var(--spacing-12);
    }

    .fullscreen-menu__link {
      font-size: clamp(1.5rem, 6vw, 2.5rem);
      gap: var(--spacing-4);
      padding: var(--spacing-3) var(--spacing-4);
    }

    .fullscreen-menu__link:hover {
      transform: translateX(10px);
    }

    .fullscreen-menu__actions {
      flex-direction: column;
      width: 100%;
    }

    .fullscreen-menu__actions :deep(.base-button) {
      width: 100%;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    .header {
      height: 60px;
    }

    .header-inner {
      padding: var(--spacing-3) var(--spacing-4);
    }

    .logo img {
      height: 24px;
    }

    .fullscreen-menu__container {
      padding: var(--spacing-6);
      gap: var(--spacing-10);
    }

    .fullscreen-menu__link {
      font-size: 1.75rem;
    }
  }
</style>
