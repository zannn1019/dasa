<script setup lang="ts">
  interface ContactPhone {
    link: string;
    display: string;
  }
  interface ContactEmail {
    link: string;
    display: string;
  }
  interface ContactAddress {
    street: string;
    area: string;
    city: string;
  }

  interface ContactData {
    phone: ContactPhone;
    email: ContactEmail;
    address: ContactAddress;
    officeHours: string;
  }

  defineProps<{ contact: ContactData }>();

  const { form, formStatus, handleSubmit } = useContactForm();
</script>

<template>
  <section class="ap-section ap-contact">
    <div class="container">
      <div class="ap-section__header">
        <span class="ap-label">Contact</span>
        <h2 class="ap-section__title">
          Let's connect
        </h2>
      </div>

      <div class="ap-contact__grid">
        <form class="ap-contact__form" @submit.prevent="handleSubmit">
          <div class="ap-contact__field">
            <label for="ap-name" class="ap-contact__label">
              Your name
            </label>
            <input
              id="ap-name"
              v-model="form.name"
              type="text"
              required
              class="ap-contact__input"
              placeholder="PT Acme Corp"
            />
          </div>

          <div class="ap-contact__field">
            <label for="ap-email" class="ap-contact__label">
              Email address
            </label>
            <input
              id="ap-email"
              v-model="form.email"
              type="email"
              required
              class="ap-contact__input"
              placeholder="hello@company.com"
            />
          </div>

          <div class="ap-contact__field">
            <label for="ap-message" class="ap-contact__label">
              Message
            </label>
            <textarea
              id="ap-message"
              v-model="form.message"
              rows="5"
              required
              class="ap-contact__input ap-contact__textarea"
              placeholder="Tell us about your project…"
            />
          </div>

          <button type="submit" class="ap-contact__submit" :disabled="formStatus === 'sending'">
            <span v-if="formStatus === 'idle' || formStatus === 'error'">
              Send message →
            </span>
            <span v-else-if="formStatus === 'sending'">
              Sending…
            </span>
            <span v-else-if="formStatus === 'sent'">
              ✓ Message sent!
            </span>
          </button>
        </form>

        <div class="ap-contact__info">
          <div class="ap-contact__info-item">
            <div class="ap-contact__info-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.43a16 16 0 0 0 5.66 5.66l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.19 16z"
                />
              </svg>
            </div>
            <div>
              <span class="ap-contact__info-label">Phone</span>
              <a :href="contact.phone.link" class="ap-contact__info-value">
                {{ contact.phone.display }}
              </a>
            </div>
          </div>

          <div class="ap-contact__info-item">
            <div class="ap-contact__info-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div>
              <span class="ap-contact__info-label">Email</span>
              <a :href="contact.email.link" class="ap-contact__info-value">
                {{ contact.email.display }}
              </a>
            </div>
          </div>

          <div class="ap-contact__info-item">
            <div class="ap-contact__info-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <span class="ap-contact__info-label">Address</span>
              <span class="ap-contact__info-value">
                {{ contact.address.street }},
                {{ contact.address.area }}
                {{ contact.address.city }}
              </span>
            </div>
          </div>

          <div class="ap-contact__info-item">
            <div class="ap-contact__info-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <span class="ap-contact__info-label">
                Office hours
              </span>
              <span class="ap-contact__info-value">{{ contact.officeHours }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .ap-contact {
    padding: clamp(72px, 10vw, 128px) 0;
    border-top: 1px solid var(--color-border-default);
  }

  .ap-contact__grid {
    padding: 0 clamp(24px, 3vw, 40px);
    display: grid;
    grid-template-columns: 5fr 4fr;
    gap: clamp(28px, 4vw, 64px);
    align-items: start;
  }

  .ap-contact__form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ap-contact__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ap-contact__label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-text-secondary);
  }

  .ap-contact__input {
    width: 100%;
    padding: 14px 18px;
    border: 1.5px solid #9ca3af;
    border-radius: 10px;
    font-size: var(--font-size-base);
    font-family: inherit;
    color: var(--color-text-primary);
    background: #f9fafb;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
    transition:
      border-color 0.2s,
      box-shadow 0.2s,
      background 0.2s;
    outline: none;
    resize: none;
  }

  .ap-contact__input:focus {
    border-color: var(--ap-orange);
    background: #fff;
    box-shadow:
      inset 0 1px 3px rgba(0, 0, 0, 0.04),
      0 0 0 3px rgba(238, 93, 34, 0.12);
  }

  .ap-contact__textarea {
    min-height: 140px;
  }

  .ap-contact__submit {
    align-self: flex-start;
    padding: 14px 32px;
    background: var(--ap-dark);
    color: #fff;
    border: 2px solid var(--ap-dark);
    border-radius: 10px;
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.22s,
      color 0.22s,
      border-color 0.22s;
  }

  .ap-contact__submit:hover:not(:disabled) {
    background: transparent;
    color: var(--ap-dark);
  }

  .ap-contact__submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ap-contact__info {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: clamp(24px, 3vw, 40px);
    background: #fafafa;
    border: 1px solid var(--color-border-default);
    border-radius: 20px;
  }

  .ap-contact__info-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .ap-contact__info-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(238, 93, 34, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ap-contact__info-icon svg {
    width: 18px;
    height: 18px;
    color: var(--ap-orange);
  }

  .ap-contact__info-label {
    display: block;
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--color-text-disabled);
    margin-bottom: 4px;
  }

  .ap-contact__info-value {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    line-height: 1.5;
    text-decoration: none;
  }

  a.ap-contact__info-value:hover {
    color: var(--ap-orange);
  }

  @media (max-width: 1024px) {
    .ap-contact__grid {
      grid-template-columns: 1fr;
    }
  }
</style>
