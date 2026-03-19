// Check if current user is blocked
export async function checkUserBlockedStatus() {
  try {
    // Get user email from localStorage or auth context
    const userEmail = localStorage.getItem('userEmail') || 
                     sessionStorage.getItem('userEmail') ||
                     JSON.parse(localStorage.getItem('user') || '{}').email;

    if (!userEmail) {
      return { isBlocked: false, status: 'unknown' };
    }

    const response = await fetch(`/api/user/status?email=${encodeURIComponent(userEmail)}`);
    const result = await response.json();

    if (result.success) {
      return {
        isBlocked: result.data.isBlocked,
        status: result.data.status,
        userData: result.data
      };
    } else {
      console.error('Failed to check user status:', result.message);
      return { isBlocked: false, status: 'unknown' };
    }
  } catch (error) {
    console.error('Error checking user status:', error);
    return { isBlocked: false, status: 'unknown' };
  }
}

// Show blocked user message
export function showBlockedUserMessage() {
  alert('Your account has been blocked by the admin. You cannot create new bookings.');
}

// Redirect to login if user is blocked
export function handleBlockedUser() {
  showBlockedUserMessage();
  // Optional: redirect to account page or logout
  window.location.href = '/account';
}
