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

  // Generic handler for forms marked data-form="demo" (petition, volunteer, contact).
  // NOTE: This site has no backend yet. Swap the form "action" attribute for a
  // real endpoint (e.g. Formspree, Netlify Forms, Google Form) before launch —
  // see the comment in each form for instructions.
  var forms = document.querySelectorAll('form[data-form]');
  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      var action = form.getAttribute("action");
      var isPlaceholder = !action || action.indexOf("REPLACE_WITH") !== -1;
      if (isPlaceholder) {
        event.preventDefault();
        var status = form.querySelector(".form-status");
        if (status) {
          status.textContent =
            "This form is not yet connected to a submission service. " +
            "(Site owner: add a form backend such as Formspree or Netlify Forms — " +
            "see js/main.js and the HTML comment above this form.)";
          status.classList.remove("success");
          status.classList.add("error", "show");
        }
      }
    });
  });
});
