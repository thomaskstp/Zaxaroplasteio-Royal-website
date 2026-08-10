// Contact page — form submit handler.
// Submits to Formspree (see the form's action="" in contact.html) over
// fetch so the page never navigates away; on success we reveal the
// "thank you" message, on failure we point people at the email address
// directly instead of leaving them guessing.

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    const errorMessage = document.getElementById('form-error');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        errorMessage.hidden = true;

        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { Accept: 'application/json' }
        })
            .then((response) => {
                if (response.ok) {
                    successMessage.hidden = false;
                    form.reset();
                } else {
                    errorMessage.hidden = false;
                }
            })
            .catch(() => {
                errorMessage.hidden = false;
            });
    });
});
