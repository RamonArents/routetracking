import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Routetracker" },
    { name: "description", content: "Welcome to the Routetracker app" },
  ];
}

export default function Home() {
  return <Welcome />;
}
