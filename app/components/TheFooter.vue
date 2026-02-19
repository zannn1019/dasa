<script setup lang="ts">
  const props = defineProps({
    footerConnector: {
      type: Boolean,
      default: true,
    },
  });
</script>

<template>
  <footer class="footer" :class="{ 'no-connector': !footerConnector }">
    <!-- Connection Curve from previous section -->
    <div v-if="footerConnector" class="footer-connector">
      <div class="wrapper">
        <div class="inverted">
          <span class="sub-title">Get In Touch</span>
          <h1 class="title">Let's connect with us</h1>
        </div>
        <BaseButton size="lg" as="button" class="footer-button">LET'S CONNECT</BaseButton>
      </div>
    </div>

    <div class="container">
      <div class="footer-main">
        <div class="footer-brand">
          <img src="~/assets/images/Logo.png" alt="Dasa" class="footer-logo" />
          <p class="address">
            Head Office: Jl. Muara No.111
            <br />
            Tanjung Barat, Jagakarsa,
            <br />
            Jakarta Selatan 12530 - Indonesia
            <br />
            <strong>Office Hour:</strong>
            Monday to Friday From 9.00 AM to 6.00 PM
          </p>
          <div class="contact-info">
            <p>
              <strong>Phone Number</strong>
              <br />
              <a href="tel:+622127872101">(+62) 21 278 72101</a>
            </p>
            <p>
              <strong>Email</strong>
              <br />
              <a href="mailto:info@dasa.com">info@dasa.com</a>
            </p>
          </div>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h3>Quick Links</h3>
            <ul>
              <li><NuxtLink to="/">Home</NuxtLink></li>
              <li><NuxtLink to="#about">About</NuxtLink></li>
              <li><NuxtLink to="#services">Services</NuxtLink></li>
              <li><NuxtLink to="#achievements">Achievements</NuxtLink></li>
            </ul>
          </div>
          <div class="link-group">
            <h3>Services</h3>
            <ul>
              <li><NuxtLink to="#">Data Analysis</NuxtLink></li>
              <li><NuxtLink to="#">IT Strategy & Consulting</NuxtLink></li>
              <li><NuxtLink to="#">DevOps</NuxtLink></li>
              <li><NuxtLink to="#">IT Optimization</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>Copyright © 2026 Dasa. All rights reserved.</p>
      </div>
    </div>

    <!-- Large DASA Text Background -->
    <div class="footer-bg-text">DASA</div>
  </footer>
</template>

<style scoped>
  .footer {
    background-color: #000; /* Pure black for footer as per design */
    color: var(--dt-white);
    padding-top: calc(var(--spacing-xl) * 2);
    padding-bottom: var(--spacing-md);
    margin-top: calc(var(--spacing-xl) * 3);
    position: relative;
    border-radius: 50px 50px 0 0;
  }

  .footer.no-connector {
    margin-top: 0;
    padding-top: var(--spacing-lg);
  }

  .wrapper {
    position: relative;
  }

  .inverted {
    -webkit-mask: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201600%20550%22%3E%3Cpath%20d%3D%22M50%2C0H1550A50%2C50%200%2C0%2C1%201600%2C50V360A70%2C70%200%2C0%2C1%201530%2C430H1070A70%2C70%200%2C0%2C0%201000%2C500V480A70%2C70%200%2C0%2C1%20930%2C550H50A50%2C50%200%2C0%2C1%200%2C500V50A50%2C50%200%2C0%2C1%2050%2C0Z%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fsvg%3E")
      no-repeat center / contain;
    mask: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%201600%20550%22%3E%3Cpath%20d%3D%22M50%2C0H1550A50%2C50%200%2C0%2C1%201600%2C50V360A70%2C70%200%2C0%2C1%201530%2C430H1070A70%2C70%200%2C0%2C0%201000%2C500V480A70%2C70%200%2C0%2C1%20930%2C550H50A50%2C50%200%2C0%2C1%200%2C500V50A50%2C50%200%2C0%2C1%2050%2C0Z%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fsvg%3E")
      no-repeat center / contain;
    background-image: url("~/assets/images/Vector_1.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #ffffff;
    width: 1600px;
    aspect-ratio: 32 / 11;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 var(--spacing-xl);
  }

  .footer-connector {
    position: absolute;
    top: -60%;
    width: 100%;
    height: 100%;
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
    position: relative;
    z-index: 2;
  }

  .footer-logo {
    height: 40px;
    margin-bottom: var(--spacing-md);
  }

  .address {
    margin-bottom: var(--spacing-md);
    color: var(--dt-gray);
    line-height: 1.6;
  }
  .office-hour {
    margin-bottom: var(--spacing-md);
    color: var(--dt-gray);
    line-height: 1.6;
    margin-top: var(--spacing-md);
  }

  .office-hour strong {
    color: var(--dt-white);
  }

  .contact-info {
    display: flex;
    gap: var(--spacing-lg);
  }

  .contact-info p strong {
    color: var(--dt-white);
    display: block;
    margin-bottom: 4px;
  }

  .contact-info p {
    color: var(--dt-gray);
  }

  .footer-links {
    display: flex;
    gap: var(--spacing-xl);
    justify-content: flex-end;
  }

  .footer-button {
    position: absolute;
    bottom: 0%;
    right: 0%;
    z-index: 100;
    background: var(--dt-white);
    color: var(--dt-black);
    width: 550px;
    height: 100px;
    font-weight: var(--font-weight-regular);
    font-size: var(--font-size-xl);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .footer-button:hover {
    background: var(--dt-black) !important;
    color: var(--dt-white) !important;
    box-shadow: none !important;
    border: 2px solid white;
  }

  .inverted .sub-title {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-thin);
    color: var(--dt-gray);
  }

  .inverted .title {
    color: var(--dt-black);
    font-size: var(--font-size-8xl);
    font-weight: var(--font-weight-light);
    width: 50%;
  }

  .link-group h3 {
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    margin-bottom: var(--spacing-md);
  }

  .link-group ul li {
    margin-bottom: 12px;
  }

  .link-group ul li a {
    color: var(--dt-gray);
  }

  .link-group ul li a:hover {
    color: var(--dt-white);
  }

  .footer-bottom {
    margin-top: 5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: var(--spacing-md);
    text-align: center;
    color: var(--dt-gray);
    font-size: 14px;
    position: relative;
    z-index: 2;
  }

  .footer-bg-text {
    position: absolute;
    bottom: 15%;
    right: 0;
    font-size: 20vw;
    font-weight: 900;
    line-height: 1;
    color: rgba(64, 64, 64, 0.255);
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 768px) {
    .footer-main {
      grid-template-columns: 1fr;
    }
    .footer-links {
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }
  }
</style>
