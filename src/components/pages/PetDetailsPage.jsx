import {
  Box,
  Card,
  CardMedia,
  Typography,
  Chip,
  Grid,
  Stack,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";

import catImg from "../../assets/cat1.png"; // Replace with your image path

function PetDetailsPage() {
  return (
    <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
      <Box sx={{ maxWidth: 900, width: "100%" }}>
        {/* Top Section with Image & Basic Info */}
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardMedia
            component="img"
            height="400"
            image={catImg}
            alt="Pet"
            sx={{ borderRadius: "12px 12px 0 0" }}
          />
          <CardContent>
            <Typography variant="h4" fontWeight="bold">
              Luna
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Domestic Shorthair
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              <Chip
                label="Female"
                color="primary"
                size="small"
                sx={{ margin: "5px !important" }}
              />
              <Chip
                label="Small"
                color="secondary"
                size="small"
                sx={{ margin: "5px !important" }}
              />
              <Chip
                label="1 year"
                size="small"
                sx={{ margin: "5px !important" }}
              />
              <Chip
                label="Gray and White"
                size="small"
                sx={{ margin: "5px !important" }}
              />
            </Stack>

            <Typography
              variant="body2"
              sx={{ mt: 2, display: "flex", alignItems: "center" }}
            >
              <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Berkeley, CA
            </Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>
              Luna is a sweet and playful kitten who loves to chase toys and
              curl up in sunny spots. She’s looking for a loving home where she
              can grow and thrive!
            </Typography>
          </CardContent>
        </Card>

        {/* Personality & Compatibility Section (Original Code) */}
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Personality & Compatibility
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Chip label="Sweet" sx={{ margin: "5px !important" }} />
              <Chip label="Playful" sx={{ margin: "5px !important" }} />
              <Chip label="Curious" sx={{ margin: "5px !important" }} />
              <Chip label="Affectionate" sx={{ margin: "5px !important" }} />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Good With:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label="Children" sx={{ margin: "5px !important" }} />
              <Chip label="Other Cats" sx={{ margin: "5px !important" }} />
            </Stack>
          </CardContent>
        </Card>

        {/* Health & Care Information Section (Original Code) */}
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Health & Care Information
            </Typography>
            <Grid container spacing={2}>
              {[
                "Vaccinated",
                "Spayed/Neutered",
                "House Trained",
                "Microchipped",
              ].map((item) => (
                <Grid item xs={6} sm={3} key={item}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon color="success" fontSize="small" />
                    <Typography variant="body2">{item}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* --- */}
        {/* Adoption Information Section */}
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Adoption Information
            </Typography>
            <Box sx={{ textAlign: "center", my: 2 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                $150
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adoption Fee
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Requirements
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">• Indoor home only</Typography>
              <Typography variant="body2">
                • Patient family for kitten energy
              </Typography>
            </Stack>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Apply to Adopt Luna
            </Button>
            <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
              Schedule a Meet & Greet
            </Button>
          </CardContent>
        </Card>

        {/* --- */}
        {/* Shelter Information Section */}
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Shelter Information
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              Berkeley Cat Sanctuary
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              456 Whisker Lane, Berkeley, CA 94704
            </Typography>
            <Box
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                border: 1,
                borderColor: "grey.300",
                p: 1,
                borderRadius: 1,
              }}
            >
              <PhoneIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Typography variant="body2">(510) 555-0456</Typography>
            </Box>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                border: 1,
                borderColor: "grey.300",
                p: 1,
                borderRadius: 1,
              }}
            >
              <EmailIcon sx={{ mr: 1, color: "text.secondary" }} />
              <Typography variant="body2">hello@berkeleycats.org</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StarIcon color="warning" sx={{ mr: 0.5 }} />
              <Typography variant="body2">4.9 Shelter Rating</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default PetDetailsPage;
