// City of Acres Homes — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Generic handler for forms marked data-form="petition|volunteer|contact".
  // Submits as JSON to the form's "action" (a /api/* serverless function backed
  // by Postgres — see api/ and sql/schema.sql) and shows the result inline.
  var successMessages = {
    petition: "Thank you — you're on the list.",
    volunteer: "Thanks for signing up — we'll be in touch.",
    contact: "Message sent — thanks for reaching out."
  };

  var forms = document.querySelectorAll('form[data-form]');
  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var status = form.querySelector(".form-status");
      var action = form.getAttribute("action");
      var isPlaceholder = !action || action.indexOf("REPLACE_WITH") !== -1;

      if (isPlaceholder) {
        if (status) {
          status.textContent =
            "This form is not yet connected to a submission service. " +
            "(Site owner: set the form's action to a real /api endpoint.)";
          status.classList.remove("success");
          status.classList.add("error", "show");
        }
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = value;
      });

      if (submitBtn) submitBtn.disabled = true;
      if (status) {
        status.textContent = "Submitting…";
        status.classList.remove("error", "success");
        status.classList.add("show");
      }

      fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response.json().then(function (json) {
            return { ok: response.ok, json: json };
          });
        })
        .then(function (result) {
          if (result.ok && result.json && result.json.ok) {
            form.reset();
            if (status) {
              status.textContent = successMessages[form.dataset.form] || "Thank you.";
              status.classList.remove("error");
              status.classList.add("success", "show");
            }
          } else {
            throw new Error((result.json && result.json.error) || "Submission failed.");
          }
        })
        .catch(function (err) {
          if (status) {
            status.textContent = err.message || "Something went wrong. Please try again.";
            status.classList.remove("success");
            status.classList.add("error", "show");
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });
});
