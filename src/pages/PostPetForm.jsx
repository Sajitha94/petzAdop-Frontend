import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
} from "@mui/material";

function PostPetForm() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: { xs: 2, sm: 4 },
        py: 6,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #eee",
          }}
        >
          <CardContent sx={{ px: { xs: 2, sm: 4 }, py: { xs: 3, sm: 4 } }}>
            {/* Title */}
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: "linear-gradient(to right, #00bcd4, #ff7043)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
              }}
            >
              Post a Pet for Adoption
            </Typography>

            <Grid container spacing={3.5}>
              {/* Pet Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pet Name"
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Age */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. 2 years"
                  required
                />
              </Grid>

              {/* Breed */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Breed"
                  fullWidth
                  variant="outlined"
                  required
                />
              </Grid>

              {/* Size */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Size"
                  fullWidth
                  select
                  variant="outlined"
                  defaultValue="Medium"
                >
                  <MenuItem value="Small">Small</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Large">Large</MenuItem>
                </TextField>
              </Grid>

              {/* Gender */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Gender"
                  fullWidth
                  select
                  variant="outlined"
                  defaultValue="Female"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>

              {/* Color */}
              <Grid item xs={12} sm={6}>
                <TextField label="Color" fullWidth variant="outlined" />
              </Grid>
              {/* Location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  fullWidth
                  placeholder="City, State"
                  variant="outlined"
                  required
                />
              </Grid>
              {/* Medical History */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Medical History"
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Grid>

              {/* Upload Pet Photos next to Medical History */}
              <Grid item xs={12} sm={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{
                    border: "2px dashed #ccc",
                    color: "gray",
                    textTransform: "none",
                    py: 2,
                    px: 4,
                    mx: 1,
                  }}
                >
                  Upload Pet Photos
                  <input type="file" hidden multiple accept="image/*" />
                </Button>
              </Grid>

              {/* Description */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Tell adopters about the pet’s personality, behavior, and needs"
                  variant="outlined"
                />
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Location"
                  fullWidth
                  placeholder="City, State"
                  variant="outlined"
                  required
                />
              </Grid>
              {/* Submit */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    background: "linear-gradient(to right, #00bcd4, #ff7043)",
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: 3,
                    py: 1.5,
                  }}
                >
                  Post Pet for Adoption
                </Button>
              </Grid>

              {/* Adoption Fee */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Adoption Fee"
                  fullWidth
                  variant="outlined"
                  placeholder="$100"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default PostPetForm;
