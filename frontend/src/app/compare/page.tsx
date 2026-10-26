import type { Metadata } from "next";
import { ComparisonWorkspace } from "@/features/comparisons/comparison-workspace";

export const metadata: Metadata = { title: "Compare specifications" };
export default function ComparePage(){return <ComparisonWorkspace/>}
