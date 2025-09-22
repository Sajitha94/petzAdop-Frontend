import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import catImg from "../assets/cat1.png";

function PetsCard() {
  return (
    <Box className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-3 p-5">
      <Card className=" flex flex-col  justify-between  p-2 gap-3">
        {/* Image Section */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            alt="Charlie"
            className="max-h-[250px] w-full rounded-lg object-contain bg-gray-100"
            image={catImg}
          />

          {/* Favorite Icon / Rating */}

          {/* Tags */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <Chip
              label="Male"
              size="small"
              sx={{ backgroundColor: "#e3dfdf" }}
            />
            <Chip
              label="Large"
              size="small"
              sx={{ backgroundColor: "#e3dfdf" }}
            />
          </Box>
        </Box>

        {/* Content */}
        <CardContent style={{ padding: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography gutterBottom variant="h6" component="div">
              Charlie
            </Typography>
            <Box
              sx={{
                top: 8,
                right: 8,
                bgcolor: "white",
                px: 1,
                py: 0.2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: 14,
              }}
            >
              <StarIcon fontSize="small" sx={{ color: "orange" }} /> 4.8
            </Box>
          </Box>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            Golden Retriever
          </Typography>

          {/* Age + Location */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              my: 1,
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon fontSize="small" /> 2 years
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon fontSize="small" /> San Francisco, CA
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary">
            Charlie is a friendly and energetic golden retriever who loves
            playing fetch and swimming. He's great with kids...
          </Typography>
        </CardContent>

        {/* Buttons */}
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
              border: "2px solid transparent",
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              color: "transparent",
              WebkitBackgroundClip: "text",
            }}
          >
            Learn More
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
            }}
          >
            Meet Charlie
          </Button>
        </CardActions>
      </Card>
      <Card className=" flex flex-col  justify-between  p-2 gap-3">
        {/* Image Section */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            alt="Charlie"
            className="max-h-[250px] w-full rounded-lg object-contain bg-gray-100"
            image={catImg}
          />

          {/* Favorite Icon / Rating */}

          {/* Tags */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <Chip
              label="Male"
              size="small"
              sx={{ backgroundColor: "#e3dfdf" }}
            />
            <Chip
              label="Large"
              size="small"
              sx={{ backgroundColor: "#e3dfdf" }}
            />
          </Box>
        </Box>

        {/* Content */}
        <CardContent style={{ padding: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography gutterBottom variant="h6" component="div">
              Charlie
            </Typography>
            <Box
              sx={{
                top: 8,
                right: 8,
                bgcolor: "white",
                px: 1,
                py: 0.2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: 14,
              }}
            >
              <StarIcon fontSize="small" sx={{ color: "orange" }} /> 4.8
            </Box>
          </Box>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            Golden Retriever
          </Typography>

          {/* Age + Location */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              my: 1,
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon fontSize="small" /> 2 years
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon fontSize="small" /> San Francisco, CA
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary">
            Charlie is a friendly and energetic golden retriever who loves
            playing fetch and swimming. He's great with kids...
          </Typography>
        </CardContent>

        {/* Buttons */}
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
              border: "2px solid transparent",
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              color: "transparent",
              WebkitBackgroundClip: "text",
            }}
          >
            Learn More
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
            }}
          >
            Meet Charlie
          </Button>
        </CardActions>
      </Card>{" "}
      <Card className=" flex flex-col  justify-between  p-2 gap-3">
        {/* Image Section */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            alt="Charlie"
            className="max-h-[250px] w-full rounded-lg object-contain bg-gray-100"
            image={catImg}
          />

          {/* Favorite Icon / Rating */}

          {/* Tags */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <Chip
              label="Male"
              size="small"
              sx={{ backgroundColor: "#e3dfdf" }}
            />
            <Chip
              label="Large"
              size="small"
              sx={{ backgroundColor: "#e3dfdf" }}
            />
          </Box>
        </Box>

        {/* Content */}
        <CardContent style={{ padding: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography gutterBottom variant="h6" component="div">
              Charlie
            </Typography>
            <Box
              sx={{
                top: 8,
                right: 8,
                bgcolor: "white",
                px: 1,
                py: 0.2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: 14,
              }}
            >
              <StarIcon fontSize="small" sx={{ color: "orange" }} /> 4.8
            </Box>
          </Box>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            Golden Retriever
          </Typography>

          {/* Age + Location */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              my: 1,
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon fontSize="small" /> 2 years
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon fontSize="small" /> San Francisco, CA
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary">
            Charlie is a friendly and energetic golden retriever who loves
            playing fetch and swimming. He's great with kids...
          </Typography>
        </CardContent>

        {/* Buttons */}
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
              border: "2px solid transparent",
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              color: "transparent",
              WebkitBackgroundClip: "text",
            }}
          >
            Learn More
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
            }}
          >
            Meet Charlie
          </Button>
        </CardActions>
      </Card>{" "}
      <Card className=" flex flex-col  justify-between  p-2 gap-3">
        {/* Image Section */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            alt="Charlie"
            className="max-h-[250px] w-full rounded-lg object-contain bg-gray-100"
            image={catImg}
          />

          {/* Favorite Icon / Rating */}

          {/* Tags */}
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <Chip
              label="Male"
              size="small"
              sx={{ backgroundColor: "#e3dfdf" }}
            />
            <Chip
              label="Large"
              size="small"
              sx={{ backgroundColor: "#e3dfdf" }}
            />
          </Box>
        </Box>

        {/* Content */}
        <CardContent style={{ padding: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography gutterBottom variant="h6" component="div">
              Charlie
            </Typography>
            <Box
              sx={{
                top: 8,
                right: 8,
                bgcolor: "white",
                px: 1,
                py: 0.2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                fontSize: 14,
              }}
            >
              <StarIcon fontSize="small" sx={{ color: "orange" }} /> 4.8
            </Box>
          </Box>
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            Golden Retriever
          </Typography>

          {/* Age + Location */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              my: 1,
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon fontSize="small" /> 2 years
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LocationOnIcon fontSize="small" /> San Francisco, CA
            </Box>
          </Box>

          {/* Description */}
          <Typography variant="body2" color="text.secondary">
            Charlie is a friendly and energetic golden retriever who loves
            playing fetch and swimming. He's great with kids...
          </Typography>
        </CardContent>

        {/* Buttons */}
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
              border: "2px solid transparent",
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              color: "transparent",
              WebkitBackgroundClip: "text",
            }}
          >
            Learn More
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              background: "linear-gradient(to right, #00bcd4, #ff7043)",
              textTransform: "none",
              fontSize: { xs: "14px", sm: "12px", lg: "14px" },
            }}
          >
            Meet Charlie
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default PetsCard;
