document.getElementById("signup-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(this);

  fetch("/api/signup", {
      method: "POST",
      body: formData
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      return response.json();
  })
  .then(data => {
      // Handle success response
      console.log(data);
  })
  .catch(error => {
      // Handle error
      console.error("There was a problem with the form submission:", error);
  });
});
