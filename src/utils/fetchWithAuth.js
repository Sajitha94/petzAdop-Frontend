export async function fetchWithAuth(url, options = {}, navigate, setUser) {
  const token = localStorage.getItem("token");

  // 🔒 No token? Redirect to login
  if (!token) {
    navigate("/login");
    return null;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const data = await res.json();

    // 🚨 Handle session expiration or unauthorized
    if (data.status === "error" && data.message?.includes("Unauthorized")) {
      alert("❌ Session expired. Please login again.");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
      return null;
    }

    return data;
  } catch (error) {
    console.error("fetchWithAuth error:", error);
    return null;
  }
}
