"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { API, fetcher } from "../../../lib/fetcher";
import {
  Box,
  Typography,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { ProtectedRoute } from "../../../components/ProtectedRoute";

function ScanDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: scan, mutate } = useSWR(`${API}/scans/${id}`, fetcher, {
    refreshInterval: 3000,
  });

  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "ok" | "broken"
  >("all");
  const { data: items } = useSWR(
    `${API}/scans/${id}/items?limit=500${
      statusFilter !== "all" ? `&status=${statusFilter}` : ""
    }`,
    fetcher,
    { refreshInterval: 5000 }
  );

  const cols: GridColDef[] = [
    { field: "url", headerName: "URL", width: 520 },
    { field: "ok", headerName: "OK", width: 80 },
    { field: "statusCode", headerName: "Code", width: 80 },
    { field: "statusText", headerName: "Status Text", width: 180 },
    { field: "redirected", headerName: "Redirected", width: 120 },
    { field: "error", headerName: "Error", width: 260 },
  ];

  const retry = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to retry scans");
      return;
    }

    const res = await fetch(`${API}/scans/${id}/retry`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) alert(await res.text());
    mutate();
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 1 }}>
          Scan {id}
        </Typography>
        <Stack direction="row" spacing={2}>
          <ToggleButtonGroup
            exclusive
            value={statusFilter}
            onChange={(_e, v) => v && setStatusFilter(v)}
            size="small"
          >
            <ToggleButton value="all" sx={{ fontWeight: 700 }}>
              All
            </ToggleButton>
            <ToggleButton value="ok" sx={{ fontWeight: 700 }}>
              OK
            </ToggleButton>
            <ToggleButton value="broken" sx={{ fontWeight: 700 }}>
              Broken
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            onClick={retry}
            variant="outlined"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #6366f1 0%, #34d399 100%)",
              color: "#fff",
              border: 0,
            }}
          >
            Retry
          </Button>
        </Stack>
      </Stack>

      <Typography
        sx={{ mb: 1, fontWeight: 500, fontSize: 18, color: "#6366f1" }}
      >
        Status: {scan?.status} • Total: {scan?.totalLinks ?? 0} • OK:{" "}
        {scan?.okCount ?? 0} • Broken: {scan?.brokenCount ?? 0} • Duration:{" "}
        {scan?.durationMs ?? "-"} ms
      </Typography>

      <Box
        sx={{
          height: 700,
          background: "rgba(255,255,255,0.7)",
          borderRadius: 4,
          boxShadow: "0 4px 24px rgba(90,90,200,0.08)",
          p: 2,
        }}
      >
        <DataGrid
          rows={items?.data ?? []}
          columns={cols}
          getRowId={(r) => r.id}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(90,90,200,0.08)",
            "& .MuiDataGrid-row:hover": {
              background: "linear-gradient(90deg, #e0e7ff 0%, #f5f7fa 100%)",
              boxShadow: "0 2px 8px rgba(90,90,200,0.12)",
            },
            "& .MuiDataGrid-columnHeader": {
              fontWeight: 700,
              background: "rgba(99,102,241,0.08)",
            },
            "& .MuiDataGrid-cell": {
              fontWeight: 500,
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default function ScanDetailPage() {
  return (
    <ProtectedRoute>
      <ScanDetail />
    </ProtectedRoute>
  );
}
