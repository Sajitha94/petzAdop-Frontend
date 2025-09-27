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
const pages = ["Find Pets", "Shelters", "Foster", "Adopt", "About"];
const settings = ["Profile", "Account", "Logout"];

export default function Header() {
  const { user, setUser } = useAuth(); // ✅ only use context
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

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
        console.log(data, "kl");

        if (data.status === "success") setUser(data.data);
        console.log(user, "user123");
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUser();
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: 1 }}>
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
            <Typography
              variant="h6"
              component="a"
              sx={{
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <img src={PetzAdop} alt="logo" className="w-32 h-12" />
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: 2,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                sx={{
                  textTransform: "none",
                  fontSize: "16px",
                  color: "black",
                  "&:hover": { color: "#00bcd4" },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
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
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Profile Avatar or Login */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title={user.name}>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.name}
                      src={
                        user?.profilePictures && user.profilePictures.length > 0
                          ? `${API_BASE_URL}/uploads/${user.profilePictures[0]}`
                          : "/static/images/avatar/1.jpg"
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
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
