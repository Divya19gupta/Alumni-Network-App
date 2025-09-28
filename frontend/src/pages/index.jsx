import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Box, Button, Container } from "@mui/material";
import { AvatarHome } from "../animation/HomeAvatr";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";
import LoginComponent from "./login";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  return (
    <UserLayout>
      <Container
        maxWidth="lg"
        sx={{
          height: "100vh",
          display: "flex",
        }}
      >
        {/* Left Animation Box */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <AvatarHome />
            <Button
              variant="outlined"
              size="large"
              sx={{
                mt: 2,
                backgroundColor: "#6a760c",
                borderRadius: "18px",
                color: "white",
                "&:hover": {
                  color: "#6a760c",
                  backgroundColor: "white",
                  borderColor: "#6a760c",
                },
                padding: "8px 20px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              onClick={() => router.push('/login')}
            >
              Get Started
            </Button>
        </Box>
      </Container>
    </UserLayout>
  );
}
