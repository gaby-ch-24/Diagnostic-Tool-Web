"use client";
import * as React from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import useSWR from "swr";
import { API, fetcher } from "../lib/fetcher";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ProtectedRoute } from "../components/ProtectedRoute";

function Dashboard() {
  const { data } = useSWR(`${API}/scans?limit=100`, fetcher, {
    refreshInterval: 5000,
  });
  const scans = data?.data ?? [];

  const total = scans.length;
  const completed = scans.filter((s: any) => s.status === "COMPLETED").length;
  const failed = scans.filter((s: any) => s.status === "FAILED").length;
  const running = scans.filter((s: any) => s.status === "RUNNING").length;
  const queued = scans.filter((s: any) => s.status === "QUEUED").length;

  const trend = scans
    .slice(0, 20)
    .reverse()
    .map((s: any, i: number) => ({
      i,
      totalLinks: s.totalLinks ?? 0,
      broken: s.brokenCount ?? 0,
      ok: s.okCount ?? 0,
    }));
  const statusData = [
    { name: "Completed", value: completed },
    { name: "Running", value: running },
    { name: "Queued", value: queued },
    { name: "Failed", value: failed },
  ];
  const brokenBar = scans
    .slice(0, 12)
    .reverse()
    .map((s: any, i: number) => ({
      name: `#${scans.length - i}`,
      broken: s.brokenCount ?? 0,
      ok: s.okCount ?? 0,
    }));

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #a5b4fc 0%, #f5f7fa 100%)",
              boxShadow: "0 4px 24px rgba(90,90,200,0.12)",
              borderRadius: 4,
              backdropFilter: "blur(8px)",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" fontWeight={600}>
                Total Scans
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #6ee7b7 0%, #f5f7fa 100%)",
              boxShadow: "0 4px 24px rgba(90,200,150,0.12)",
              borderRadius: 4,
              backdropFilter: "blur(8px)",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" fontWeight={600}>
                Completed
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {completed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #fbbf24 0%, #f5f7fa 100%)",
              boxShadow: "0 4px 24px rgba(200,180,90,0.12)",
              borderRadius: 4,
              backdropFilter: "blur(8px)",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" fontWeight={600}>
                Running
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {running}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #f87171 0%, #f5f7fa 100%)",
              boxShadow: "0 4px 24px rgba(200,90,90,0.12)",
              borderRadius: 4,
              backdropFilter: "blur(8px)",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" fontWeight={600}>
                Failed
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {failed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 24px rgba(90,90,200,0.08)",
              backdropFilter: "blur(6px)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Links Trend (last 20 scans)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="i" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="totalLinks"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="broken"
                      stroke="#f87171"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="ok"
                      stroke="#34d399"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 24px rgba(90,90,200,0.08)",
              backdropFilter: "blur(6px)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Status Distribution
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={statusData}
                      outerRadius={100}
                      label
                    >
                      {statusData.map((_e, idx) => (
                        <Cell
                          key={idx}
                          fill={
                            ["#34d399", "#6366f1", "#fbbf24", "#f87171"][idx] ||
                            "#ddd"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 4px 24px rgba(90,90,200,0.08)",
              backdropFilter: "blur(6px)",
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Broken vs OK (last 12 scans)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brokenBar}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="broken" stackId="a" fill="#f87171" />
                    <Bar dataKey="ok" stackId="a" fill="#34d399" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
