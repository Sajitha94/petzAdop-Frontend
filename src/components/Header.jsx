import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PetzAdop from "../assets/PetzAdop Logo.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useContext";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { API_BASE_URL } from "../config";
const settings = ["Profile", "Chat", "Logout"];

export default function Header() {
  const { user, setUser } = useAuth(); // ✅ only use context
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElAccount, setAnchorElAccount] = React.useState(null);
  const token = localStorage.getItem("token");
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const pages = [
    { name: "Home", path: "/" },
    { name: "Find Pets", path: "/searchpage" },
    { name: "Chat", path: "/chat" },
    { name: "Account", path: "/profile" },
  ];
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null); // clears from context
    handleCloseUserMenu();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.status === "error" && data.message.includes("Unauthorized")) {
          alert("❌ Session expired. Please login again.");
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
          return;
        }

        if (data.status === "success") {
          setUser(data.data);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    // ✅ Run on mount or whenever token changes
    fetchUser();
  }, [token]); // <-- listen for token change

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        boxShadow: 1,
        zIndex: (theme) => theme.zIndex.drawer + 1, // ✅ ensures it stays above everything
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img src={PetzAdop} alt="logo" className="w-32 h-12" />
          </Box>
          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
              gap: 2,
            }}
          >
            {pages.map((page) => {
              if (page.name === "Account") {
                // Only show Account dropdown if user exists
                if (!user) return null;

                return (
                  <React.Fragment key={page.name}>
                    <Button
                      sx={{
                        textTransform: "none",
                        fontSize: "16px",
                        color: "black",
                        "&:hover": { color: "#00bcd4" },
                      }}
                      onClick={(e) => setAnchorElAccount(e.currentTarget)}
                    >
                      {page.name}
                    </Button>
                    <Menu
                      anchorEl={anchorElAccount}
                      open={Boolean(anchorElAccount)}
                      onClose={() => setAnchorElAccount(null)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      keepMounted
                    >
                      <MenuItem
                        onClick={() => {
                          setAnchorElAccount(null);
                          navigate("/profile");
                        }}
                      >
                        <Typography>Profile</Typography>
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setAnchorElAccount(null);
                          navigate("/adopted-pets-status");
                        }}
                      >
                        <Typography>Adopted Pets Status</Typography>
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          setAnchorElAccount(null);
                          navigate("/foster-pets-status");
                        }}
                      >
                        <Typography>Foster Pets Status</Typography>
                      </MenuItem>
                    </Menu>
                  </React.Fragment>
                );
              } else {
                return (
                  <Button
                    key={page.name}
                    sx={{
                      textTransform: "none",
                      fontSize: "16px",
                      color: "black",
                      "&:hover": { color: "#00bcd4" },
                    }}
                    onClick={() => navigate(page.path)}
                  >
                    {page.name}
                  </Button>
                );
              }
            })}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              keepMounted
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(page.path);
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* Profile Avatar or Login */}
          <Box sx={{ flexGrow: 0 }}>
            {user && token ? (
              <>
                <Tooltip title={user.name}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.name}
                      src={
                        user?.profilePictures?.length > 0
                          ? `${API_BASE_URL}/uploads/${user.profilePictures[0]}`
                          : "/static/images/avatar/1.jpg"
                      }
                    />
                  </IconButton>
                </Tooltip>

                <Menu
                  sx={{ mt: 1.5 }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                >
                  {settings.map((setting) =>
                    setting === "Logout" ? (
                      <MenuItem key={setting} onClick={handleLogout}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ) : (
                      <MenuItem
                        key={setting}
                        onClick={() => {
                          handleCloseUserMenu();
                          navigate(`/${setting.toLowerCase()}`);
                        }}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    )
                  )}
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#ff7043",
                  color: "white",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#e85d30" },
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
