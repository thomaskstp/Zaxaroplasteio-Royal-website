// Contact page — form submit handler.
// This is a static site with no backend, so we just stop the normal
// page reload and reveal a "thank you" message instead. To actually
// receive these messages, wire the form up to a real backend or a
// form service (e.g. Formspree, EmailJS) and POST the FormData there.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        successMessage.hidden = false;
        form.reset();
    });
});
