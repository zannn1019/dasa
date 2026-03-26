export type FormStatus = "idle" | "sending" | "sent" | "error";

export function useContactForm() {
  const form = reactive({ name: "", email: "", message: "" });
  const formStatus = ref<FormStatus>("idle");

  async function handleSubmit() {
    formStatus.value = "sending";
    try {
      const response = await $fetch('/api/contact', {
        method: 'POST',
        body: {
          name: form.name,
          email: form.email,
          message: form.message,
          toEmail: 'info@dasa.com'
        }
      });

      if (response) {
        formStatus.value = "sent";
        form.name = "";
        form.email = "";
        form.message = "";
        
        setTimeout(() => {
          formStatus.value = "idle";
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      formStatus.value = "error";
      
      setTimeout(() => {
        formStatus.value = "idle";
      }, 3000);
    }
  }

  return { form, formStatus, handleSubmit };
}
