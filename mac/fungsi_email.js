// Inisialisasi EmailJS
emailjs.init("UCKKih5IQspVduNdt");

// Fungsi untuk menangani pengiriman email
async function sendEmail(event) {
  event.preventDefault();

  const form = document.getElementById("contactForm");
  const confirmationMessage = document.getElementById("confirmationMessage");

  confirmationMessage.textContent = "";

  try {
    await emailjs.sendForm("service_2gfv57d", "template_n44fqg7", form);
    confirmationMessage.textContent = "Message sent successfully!";
    confirmationMessage.classList.add("success");

    setTimeout(() => {
     
      confirmationMessage.textContent = "";
    }, 3000);

    form.reset();
  } catch (error) {
    console.error("Error:", error);
    confirmationMessage.textContent = "Error sending message. Please try again.";
    confirmationMessage.classList.add("error");
  }
}
