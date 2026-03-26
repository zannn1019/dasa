<script setup lang="ts">
  import footerData from "~/assets/data/footer.json";
  import contactData from "~/assets/data/contact.json";
  import navigationData from "~/assets/data/navigation.json";

  const { t } = useLanguage();
  const { getPageData } = useCms();
  const { data: data } = await getPageData("site-setting", {
    contact: true,
  });
  const { data: servicesResponse } = await getPageData("services");

  const props = defineProps({
    footerConnector: {
      type: Boolean,
      default: true,
    },
  });

  const siteData = computed(() => data?.value);
  const cta = computed(() => ({
    subtitle: t(footerData.ctaSection.subtitle),
    title: t(footerData.ctaSection.title),
    buttonText: t(footerData.ctaSection.buttonText),
    buttonLink: footerData.ctaSection.buttonLink,
  }));

  const site = computed(() => siteData?.value?.data);
  const cmsContact = computed(() => {
    const siteObj = Array.isArray(site.value) ? site.value[0] : site.value;
    const attrs = (siteObj as any)?.attributes ?? siteObj ?? {};
    if (attrs?.contact) return attrs.contact;
    return {
      phone: contactData.phone.display,
      email: contactData.email.display,
      address: `${contactData.address.street}\n${contactData.address.area}\n${contactData.address.city}`,
      officeHours: t(contactData.officeHours),
    };
  });
  const nav = navigationData;

  const cmsServices = computed(() => {
    const raw = (servicesResponse.value as any)?.data ?? [];
    if (!Array.isArray(raw)) return [];

    return [...raw]
      .sort(
        (a: any, b: any) =>
          (a.order ?? a.attributes?.order ?? 0) - (b.order ?? b.attributes?.order ?? 0),
      )
      .map((item: any) => {
        const attrs = item.attributes ?? item;
        return {
          title: attrs.title,
          link: `/services/${attrs.slug || attrs.title.toLowerCase().replace(/ /g, "-")}`,
        };
      });
  });
</script>

<template>
  <footer class="footer" :class="{ 'no-connector': !footerConnector }">
    <div v-if="footerConnector" class="footer-connector">
      <div class="wrapper">
        <div class="inverted">
          <span class="sub-title" data-lang>{{ cta.subtitle }}</span>
          <p class="cta-title" data-lang>{{ cta.title }}</p>
        </div>
        <BaseButton size="lg" as="button" class="footer-button" :to="cta.buttonLink" data-lang>
          {{ cta.buttonText }}
        </BaseButton>
      </div>
    </div>

    <div class="container">
      <div class="footer-main">
        <div class="footer-brand">
          <NuxtImg
            src="/images/Logo.webp"
            :alt="site?.name"
            class="footer-logo"
            width="160"
            height="40"
            loading="lazy"
          />
          <p class="address">
            Head Office:
            <span style="white-space: pre-line">{{ cmsContact.address }}</span>
            <br />
            <br />
            <strong>Office Hour:</strong>
            <span data-lang>{{ cmsContact.officeHours }}</span>
          </p>
          <div class="contact-info">
            <p>
              <strong>Phone Number</strong>
              <template
                v-for="(phone, index) in cmsContact.phone?.split('\\n')"
                :key="'phone-' + index"
              >
                <br v-if="Number(index) > 0" />
                <a :href="`tel:${phone.trim().replace(/[^0-9+]/g, '')}`">
                  {{ phone.trim() }}
                </a>
              </template>
            </p>
            <p>
              <strong>Email</strong>
              <template
                v-for="(email, index) in cmsContact.email?.split('\\n')"
                :key="'email-' + index"
              >
                <br v-if="Number(index) > 0" />
                <a :href="`mailto:${email.trim()}`">{{ email.trim() }}</a>
              </template>
            </p>
          </div>
        </div>

        <div class="footer-links">
          <div class="link-group">
            <h3>Quick Links</h3>
            <ul>
              <li v-for="link in nav.footerQuickLinks" :key="link.path">
                <NuxtLink :to="link.path" data-lang>{{ t(link.name) }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="link-group">
            <h3>Services</h3>
            <ul>
              <li v-for="service in cmsServices" :key="service.link">
                <NuxtLink :to="service.link" data-lang>{{ service.title }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>Copyright © {{ new Date().getFullYear() }} Dasa. All rights reserved.</p>
      </div>
    </div>

    <div class="footer-bg-text">{{ footerData.backgroundText }}</div>
  </footer>
</template>

<style scoped>
  .footer {
    background-color: #000;
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
    background-image: url("/images/Vector_1.webp");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #ffffff;
    width: min(96vw, 1600px);
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
    position: absolute !important;
    bottom: 0 !important;
    right: 0 !important;
    z-index: 100 !important;
    background: var(--dt-white) !important;
    color: var(--dt-black) !important;
    width: clamp(200px, 30vw, 480px) !important;
    height: clamp(60px, 7vh, 80px) !important;
    font-weight: var(--font-weight-regular) !important;
    font-size: var(--font-size-xl) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    cursor: pointer !important;
    pointer-events: auto !important;
    text-decoration: none !important;
  }

  .footer-button:hover {
    background: var(--dt-black) !important;
    color: var(--dt-white) !important;
    box-shadow: none !important;
    border: 2px solid white;
  }

  .inverted .sub-title {
    font-size: clamp(var(--font-size-base), 1rem + 0.5vw, var(--font-size-2xl));
    font-weight: var(--font-weight-thin);
    color: var(--dt-gray);
  }

  .inverted .cta-title {
    color: var(--dt-black);
    font-size: clamp(2rem, 4vw + 1rem, var(--font-size-8xl));
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

  @media (max-width: 1024px) {
    /* On tablet, shrink the connector shape slightly */
    .inverted {
      width: min(96vw, 1600px);
    }

    .footer {
      padding-top: calc(var(--spacing-lg) * 2);
    }

    .footer-button {
      width: clamp(200px, 35vw, 550px) !important;
      font-size: clamp(var(--font-size-base), 1rem + 0.5vw, var(--font-size-xl)) !important;
    }

    .inverted .cta-title {
      width: 60%;
    }

    .footer-main {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }

    .footer-links {
      justify-content: flex-start;
      flex-wrap: wrap;
      gap: var(--spacing-lg);
    }

    .footer-bottom {
      margin-top: 3rem;
    }
  }

  @media (max-width: 768px) {
    .footer {
      border-radius: 24px 24px 0 0;
      margin-top: 0;
      /* connector is now in-flow, so no top padding needed */
      padding-top: 0;
    }

    /* Drop the SVG mask – show as a plain card instead */
    .footer-connector {
      position: relative;
      top: 0;
      height: auto;
      padding: var(--spacing-md) var(--spacing-md) 0;
    }

    .wrapper {
      width: 100%;
    }

    .inverted {
      -webkit-mask: none;
      mask: none;
      width: 100%;
      aspect-ratio: auto;
      min-height: 220px;
      border-radius: var(--radius-2xl);
      padding: clamp(20px, 5vw, 40px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-2);
    }

    .inverted .cta-title {
      width: 100%;
      font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
    }

    /* Button sits below the card, full width */
    .footer-button {
      position: relative !important;
      bottom: auto !important;
      right: auto !important;
      width: 100% !important;
      height: clamp(56px, 14vw, 80px) !important;
      font-size: var(--font-size-lg) !important;
      border-radius: 0 0 var(--radius-2xl) var(--radius-2xl) !important;
      margin-top: 0 !important;
      margin-bottom: var(--spacing-lg);
    }

    /* Stack phone + email vertically */
    .contact-info {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .footer-bg-text {
      font-size: 28vw;
      bottom: 2%;
    }

    .footer-bottom {
      margin-top: 2.5rem;
    }
  }

  @media (max-width: 480px) {
    .footer {
      margin-top: 0 !important;
      padding-top: 0;
    }

    .footer-connector {
      padding: var(--spacing-sm) var(--spacing-sm) 0;
    }

    .inverted .sub-title {
      font-size: var(--font-size-sm);
    }

    .inverted .cta-title {
      font-size: clamp(1.5rem, 6vw, 2.2rem);
    }

    .footer-logo {
      height: 32px;
    }

    .address,
    .contact-info p {
      font-size: var(--font-size-sm);
    }

    .link-group h3 {
      font-size: var(--font-size-sm);
    }

    .link-group ul li {
      margin-bottom: 8px;
      font-size: var(--font-size-sm);
    }

    .footer-bg-text {
      font-size: 35vw;
    }

    .footer-bottom {
      margin-top: 2rem;
      font-size: 12px;
    }
  }
</style>
