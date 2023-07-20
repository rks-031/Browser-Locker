// Set the idle time (in milliseconds) after which the extension will activate
const IDLE_TIME_THRESHOLD = 180000; // 3 minutes

let inactivityTimer;

function resetTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(activateExtension, IDLE_TIME_THRESHOLD);
}

function activateExtension() {
  // Your code to activate the extension goes here
  console.log("Extension activated after 3 minutes of inactivity.");
}

function setupActivityTracking() {
  // Add event listeners to track user activity
  document.addEventListener("mousemove", resetTimer);
  document.addEventListener("keydown", resetTimer);
  document.addEventListener("click", resetTimer);
  // Add more event listeners if needed

  // Start the initial timer
  resetTimer();
}

// Call the setup function when the extension is loaded
setupActivityTracking();
