import * as React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        padding: 0,
        bgcolor: "#f5f5f5",
        paddingTop: "40px",
      }}
    >
      <Container maxWidth="xl" sx={{ padding: 0 }}>
        {/* Footer Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
            gap: 4,
            textAlign: { xs: "center", sm: "left" },
            justifyItems: "center",
            alignItems: "center",
          }}
        >
          {/* About */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              About PetzAdop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              PetzAdop is a platform for connecting adopters with pets in need
              of loving homes. Browse, adopt, or foster pets from trusted
              shelters near you.
            </Typography>
          </Box>

          {/* Pet Listings */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Pet Listings
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                All Pets
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Search by Breed
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Age & Size
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Locations
              </Typography>
            </Box>
          </Box>

          {/* Applications & Fostering */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Applications & Fostering
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Submit Application
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Track Applications
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Become a Foster
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: "pointer" }}
              >
                Foster Management
              </Typography>
            </Box>
          </Box>

          {/* Contact & Support */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Contact & Support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@petzadop.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 234 567 890
            </Typography>
            <Typography variant="body2" color="text.secondary">
              San Francisco, CA
            </Typography>
          </Box>
        </Box>

        {/* Call-to-Action */}
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Button
            sx={{
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              color: "white",
              textTransform: "none",
              fontSize: { xs: "14px", sm: "16px" },
              px: 5,
              py: 1.2,
              borderRadius: 2,
            }}
            onClick={() => {
              const token = localStorage.getItem("token");
              if (!token) {
                navigate("/login");
              } else {
                navigate("/postpet");
              }
            }}
          >
            Adopt a Pet Now
          </Button>
        </Box>

        {/* Footer Bottom */}
        <Box sx={{ mt: 4, textAlign: "center", color: "text.secondary" }}>
          &copy; {new Date().getFullYear()} PetzAdop. All rights reserved.
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
