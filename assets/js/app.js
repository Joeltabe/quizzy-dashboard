let sessionTimeout;

// Function to reset session timeout
function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    // Set session timeout to 1 hour (3600000 milliseconds)
    sessionTimeout = setTimeout(function() {
        // Session has expired due to inactivity
        // Clear session data
        localStorage.removeItem('userSession');
        // Redirect to login page or prompt user to log in again
        window.location.href = '../pages/sign-in.html'; // Example: Redirect to login page
    }, 3600000); // 1 hour in milliseconds
}

// Function to handle user activity
function handleUserActivity() {
    resetSessionTimeout();
}

// Event listeners for user activity
document.addEventListener('mousemove', handleUserActivity);
document.addEventListener('mousedown', handleUserActivity);
document.addEventListener('keypress', handleUserActivity);
document.addEventListener('scroll', handleUserActivity);

// Initial setup: Reset session timeout
resetSessionTimeout();

// Function to store user credentials and session expiry time
function storeUserSession(email, username = null, role = null) {
    const currentTime = new Date().getTime();
    const expiryTime = currentTime + 3600 * 1000; // Set expiry time to 1 hour from now
    const sessionData = {
        email: email,
        username: username,
        role: role,
        expiryTime: expiryTime
    };
    localStorage.setItem('userSession', JSON.stringify(sessionData));
}

// Function to check if the session is valid
function isSessionValid() {
    const sessionData = JSON.parse(localStorage.getItem('userSession'));
    if (!sessionData) {
        return false; // No session data found
    }
    const currentTime = new Date().getTime();
    return currentTime < sessionData.expiryTime; // Check if current time is before expiry time
}

// Function to retrieve user credentials from session
function getUserCredentials() {
    const sessionData = JSON.parse(localStorage.getItem('userSession'));
    if (!sessionData) {
        return null; // No session data found
    }
    return {
        email: sessionData.email,
    };
}
