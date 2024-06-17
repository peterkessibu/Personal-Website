const form = document.getElementById("form");
const result = document.getElementById("result");
const email = document.getElementById("email");
const name = document.getElementById("name");
const subject = document.getElementById("subject");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Validate inputs

  let isValid = validateInputs();

  if (!isValid) {
    return;
  }

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  result.innerHTML = "Please wait...";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML = json.message;
        result.classList.remove("text-gray-500");
        result.classList.add("text-green-500");
      } else {
        console.log(response);
        result.innerHTML = json.message;
        result.classList.remove("text-gray-500");
        result.classList.add("text-red-500");
      }
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = "Something went wrong!";
    })
    .then(function () {
      form.reset();
      setTimeout(() => {
        result.style.display = "none";
      }, 3000);
    });
});

function validateInputs() {
  let isValid = true; // Validate email

  const emailValue = email.value.trim();
  if (!validateEmail(emailValue)) {
    result.innerHTML = "Please enter a valid email address.";
    result.classList.remove("text-gray-500");
    result.classList.add("text-red-500");
    email.focus();
    isValid = false;
  } // Validate name

  const nameValue = name.value.trim();
  if (nameValue === "") {
    result.innerHTML = "Please enter your name.";
    result.classList.remove("text-gray-500");
    result.classList.add("text-red-500");
    name.focus();
    isValid = false;
  } // Validate subject

  const subjectValue = subject.value.trim();
  if (subjectValue === "") {
    result.innerHTML = "Please enter a subject.";
    result.classList.remove("text-gray-500");
    result.classList.add("text-red-500");
    subject.focus();
    isValid = false;
  }

  return isValid;
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}
