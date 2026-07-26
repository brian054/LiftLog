import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { platform } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as sleep } from "node:timers/promises";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCKER_WAIT_MS = 90_000;
const DOCKER_POLL_MS = 2_000;

function run(command) {
  execSync(command, { cwd: root, stdio: "inherit" });
}

function isDockerRunning() {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

async function ensureDocker() {
  // Already open / daemon ready — nothing to do.
  if (isDockerRunning()) {
    return;
  }

  if (platform() !== "darwin") {
    console.error("Docker is not running. Start Docker Desktop, then rerun.");
    process.exit(1);
  }

  console.log("Docker is not running. Starting Docker Desktop…");
  try {
    execSync('open -a Docker', { stdio: "ignore" });
  } catch {
    try {
      execSync('open -a "Docker Desktop"', { stdio: "ignore" });
    } catch {
      console.error(
        "Could not open Docker Desktop. Start it manually, then rerun."
      );
      process.exit(1);
    }
  }

  const deadline = Date.now() + DOCKER_WAIT_MS;
  process.stdout.write("Waiting for Docker");
  while (Date.now() < deadline) {
    await sleep(DOCKER_POLL_MS);
    process.stdout.write(".");
    if (isDockerRunning()) {
      process.stdout.write(" ready.\n");
      return;
    }
  }

  process.stdout.write("\n");
  console.error(
    "Docker Desktop did not become ready in time. Open it, wait until it is running, then rerun."
  );
  process.exit(1);
}

await ensureDocker();

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
