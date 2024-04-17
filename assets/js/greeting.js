// Function to greet the user based on the time of day
function greetUser() {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greeting = '';
    let icon = '';

    if (currentHour >= 5 && currentHour < 12) {
        // Morning
        greeting = '<span >Good morning</span>';
        icon = '<i class="fas fa-sun" style="color: orange;"></i>';
    } else if (currentHour >= 12 && currentHour < 18) {
        // Afternoon
        greeting = '<span ">Good afternoon</span>';
        icon = '<i class="fas fa-sun" style="color: yellow;"></i>'; // You can change this to a different afternoon icon if needed
    } else {
        // Evening
        greeting = '<span">Good evening</span>';
        icon = '<i class="fas fa-moon" style="color: #4d4dff;"></i>';
    }

    // Get user's name from session
    const user = getUserCredentials();
    const userName = user ? user.email : '';

    // Update greeting message on the page
    const greetingElement = document.getElementById('greeting');
    greetingElement.innerHTML = `${greeting}, ${userName} ${icon}`;
}

// Call the greetUser function when the page is loaded
window.addEventListener('load', greetUser);
