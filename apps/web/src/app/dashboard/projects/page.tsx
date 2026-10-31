import type { Metadata } from "next";
import ProjectsContainer from "@/feature/dashboard/projects/ui/projects.container";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return <ProjectsContainer />;
}
