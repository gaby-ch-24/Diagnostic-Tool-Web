"use client";
import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar,
  Button,
} from "@mui/material";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function UserPage() {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState("John Doe");
  const [email, setEmail] = React.useState("john.doe@example.com");
  const [avatar, setAvatar] = React.useState(
    "https://randomuser.me/api/portraits/men/32.jpg"
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f5f7fa 100%)",
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: "100%",
          borderRadius: 6,
          boxShadow: "0 8px 32px rgba(90,90,200,0.18)",
          backdropFilter: "blur(12px)",
          p: 2,
          position: "relative",
          overflow: "visible",
          animation: "fadeIn 1s",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 3,
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "relative",
                mr: 2,
                "&:hover .avatar-glow": { opacity: 1, transform: "scale(1.1)" },
              }}
            >
              <Box
                className="avatar-glow"
                sx={{
                  position: "absolute",
                  top: -8,
                  left: -8,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, #6366f1 0%, #e0e7ff 80%)",
                  filter: "blur(12px)",
                  opacity: 0.7,
                  zIndex: 0,
                  transition: "all 0.3s",
                  pointerEvents: "none",
                }}
              />
              <Avatar
                src={avatar}
                sx={{
                  width: 64,
                  height: 64,
                  zIndex: 1,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "scale(1.08)" },
                }}
              />
            </Box>
            <Box>
              {!editing ? (
                <>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ letterSpacing: 1 }}
                  >
                    {name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                    {email}
                  </Typography>
                </>
              ) : (
                <>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      padding: 4,
                      borderRadius: 4,
                      border: "1px solid #e0e7ff",
                      marginBottom: 4,
                      width: "100%",
                    }}
                  />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      padding: 4,
                      borderRadius: 4,
                      border: "1px solid #e0e7ff",
                      width: "100%",
                    }}
                  />
                </>
              )}
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="body1"
            sx={{ mb: 2, fontWeight: 600, color: "#6366f1" }}
          >
            Role: User
          </Typography>
          {!editing ? (
            <Button
              variant="contained"
              color="primary"
              sx={{
                fontWeight: 700,
                px: 4,
                py: 1,
                boxShadow: "0 2px 8px rgba(99,102,241,0.18)",
                background: "linear-gradient(90deg, #6366f1 0%, #34d399 100%)",
                letterSpacing: 1,
              }}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              sx={{
                fontWeight: 700,
                px: 4,
                py: 1,
                boxShadow: "0 2px 8px rgba(52,211,153,0.18)",
                background: "linear-gradient(90deg, #34d399 0%, #6366f1 100%)",
                letterSpacing: 1,
              }}
              onClick={() => setEditing(false)}
            >
              Save
            </Button>
          )}
        </CardContent>
      </Card>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}

export default function UserPageWrapper() {
  return (
    <ProtectedRoute>
      <UserPage />
    </ProtectedRoute>
  );
}
