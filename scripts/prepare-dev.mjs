import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(command) {
  execSync(command, { cwd: root, stdio: "inherit" });
}

try {
  execSync("docker info", { stdio: "ignore" });
} catch {
  console.error("Docker is not running. Start Docker Desktop, then rerun.");
  process.exit(1);
}

try {
  execSync("docker container inspect liftlog-postgres", { stdio: "ignore" });
  run("docker start liftlog-postgres");
} catch {
  run("docker compose up -d");
}

const devSettings = join(root, "api/appsettings.Development.json");
if (!existsSync(devSettings)) {
  console.error("Missing api/appsettings.Development.json");
  console.error("Copy the example file:");
  console.error(
    "  cp api/appsettings.Development.example.json api/appsettings.Development.json"
  );
  process.exit(1);
}

console.log("Postgres is running (liftlog-postgres on localhost:5433).");
console.log("API:      http://localhost:5198");
console.log("Frontend: http://localhost:5173");
console.log("");
