"use client";

import React from "react";
import {
  UserCheck,
  FileCheck2,
  ShoppingCart,
  Building2,
  Award,
  Trophy,
  Gavel,
  Zap,
  Globe,
  AlertTriangle,
  SearchCode,
  ShieldAlert,
  SlidersHorizontal,
  LucideProps,
} from "lucide-react";

interface MethodIconProps extends LucideProps {
  name: string;
}

export function MethodIcon({ name, ...props }: MethodIconProps) {
  switch (name) {
    case "UserCheck":
      return <UserCheck {...props} />;
    case "FileCheck2":
      return <FileCheck2 {...props} />;
    case "ShoppingCart":
      return <ShoppingCart {...props} />;
    case "Building2":
      return <Building2 {...props} />;
    case "Award":
      return <Award {...props} />;
    case "Trophy":
      return <Trophy {...props} />;
    case "Gavel":
      return <Gavel {...props} />;
    case "Zap":
      return <Zap {...props} />;
    case "Globe":
      return <Globe {...props} />;
    case "AlertTriangle":
      return <AlertTriangle {...props} />;
    case "SearchCode":
      return <SearchCode {...props} />;
    case "ShieldAlert":
      return <ShieldAlert {...props} />;
    default:
      return <SlidersHorizontal {...props} />;
  }
}

