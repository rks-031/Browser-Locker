document.addEventListener("DOMContentLoaded", function () {
    const setTimeBtn = document.getElementById("setTimeBtn");
    const passwordInput = document.getElementById("passwordInput");
    const statusMessage = document.getElementById("statusMessage");
  
    setTimeBtn.addEventListener("click", function () {
      setTime();
    });
  
    function setTime() {
      const time = prompt("Enter the time in minutes (1, 5, 10, ..., 90):");
      
      if (time) {
        chrome.storage.sync.set({ time: parseInt(time) }, function () {
          console.log(time);
          statusMessage.textContent = "Time set successfully!";
          statusMessage.style.color = "black";
          statusMessage.style.display = "block"; // Make the status message visible

          

        });
        BrowserLock.start(time);document.addEventListener("DOMContentLoaded", function () {
    const setTimeBtn = document.getElementById("setTimeBtn");
    const passwordInput = document.getElementById("passwordInput");
    const statusMessage = document.getElementById("statusMessage");
  
    setTimeBtn.addEventListener("click", function () {
      setTime();
    });
  
    function setTime() {
      const time = prompt("Enter the time in minutes (1, 5, 10, ..., 90):");
      
      if (time) {
        chrome.storage.sync.set({ time: parseInt(time) }, function () {
          console.log(time);
          statusMessage.textContent = "Time set successfully!";
          statusMessage.style.color = "black";
          statusMessage.style.display = "block"; // Make the status message visible

          

        });
        BrowserLock.start(time);

      }
    }
  });

      }
    }
  });
