"use client";
import * as React from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";
import { API, fetcher } from "../../lib/fetcher";
import Link from "next/link";
import { ProtectedRoute } from "../../components/ProtectedRoute";

function Scans() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === "dark";
  const { data, mutate, isLoading } = useSWR(
    `${API}/scans?limit=100`,
    fetcher,
    { refreshInterval: 4000 }
  );
  const [url, setUrl] = React.useState("https://example.com");
  const [concurrency, setConcurrency] = React.useState(16);
  const [maxLinks, setMaxLinks] = React.useState(800);

  const cols: GridColDef[] = [
    { field: "id", headerName: "ID", width: 220 },
    { field: "url", headerName: "URL", width: 300 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "totalLinks", headerName: "Total", width: 90 },
    { field: "okCount", headerName: "OK", width: 90 },
    { field: "brokenCount", headerName: "Broken", width: 100 },
    { field: "durationMs", headerName: "Duration (ms)", width: 130 },
    { field: "createdAt", headerName: "Created At", width: 200 },
    {
      field: "open",
      headerName: "",
      width: 120,
      sortable: false,
      renderCell(params) {
        return (
          <Button
            component={Link}
            href={`/scans/${params.row.id}`}
            size="small"
          >
            Open
          </Button>
        );
      },
    },
  ];

  const create = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to create scans");
      return;
    }

    const res = await fetch(`${API}/scans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, concurrency, maxLinks }),
    });
    if (!res.ok) alert(await res.text());
    mutate();
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        background: darkMode ? "#18181b" : "#fff",
        p: 3,
        animation: "fadeIn 0.8s",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          sx={{
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#222",
          }}
        />
        <TextField
          label="Concurrency"
          type="number"
          value={concurrency}
          onChange={(e) => setConcurrency(parseInt(e.target.value || "16"))}
          sx={{
            width: 180,
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#222",
          }}
        />
        <TextField
          label="Max Links"
          type="number"
          value={maxLinks}
          onChange={(e) => setMaxLinks(parseInt(e.target.value || "800"))}
          sx={{
            width: 180,
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#222",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={create}
          sx={{
            fontWeight: 700,
            boxShadow: 4,
            background: darkMode ? "#6366f1" : "#2563eb",
            color: "#fff",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.08)",
              bgcolor: darkMode ? "#6366f1" : "#1d4ed8",
              color: "#fff",
            },
          }}
        >
          New Scan
        </Button>
      </Stack>
      <Box
        sx={{
          height: 630,
          background: darkMode ? "#222" : "#fff",
          p: 2,
          animation: "fadeIn 1.2s",
        }}
      >
        <DataGrid
          rows={data?.data ?? []}
          columns={cols}
          loading={isLoading}
          getRowId={(r) => r.id}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            borderRadius: 2,
            boxShadow: 2,
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#222",
            "& .MuiDataGrid-row": {
              transition: "background 0.3s, box-shadow 0.3s",
            },
            "& .MuiDataGrid-row:hover": {
              background: darkMode ? "#333" : "#f3f4f6",
            },
            "& .MuiDataGrid-cell": {
              color: darkMode ? "#fff" : "#222",
              background: "inherit",
            },
            "& .MuiDataGrid-columnHeaders": {
              background: darkMode ? "#18181b" : "#f3f4f6",
              color: darkMode ? "#fff" : "#222",
            },
            "& .MuiDataGrid-footerContainer": {
              background: darkMode ? "#18181b" : "#fff",
            },
            "& .MuiDataGrid-root": {
              background: "inherit",
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default function ScansPage() {
  return (
    <ProtectedRoute>
      <Scans />
    </ProtectedRoute>
  );
}
