# This file defines local PowerShell helper commands like:
#   init, reload, api, web
#
# To load these commands in a PowerShell terminal:
#   . .\load-dev-commands.ps1
#
# If you want VS Code to auto-load them when opening the terminal,
# you can add a project-local or user-level terminal setting in VS Code.
#
# For example I added this to my .vscode/settings.json on Windows
# {
#   "terminal.integrated.enablePersistentSessions": false,
#
#   "terminal.integrated.profiles.windows": {
#     "PowerShell with Dev Commands": {
#       "source": "PowerShell",
#       "args": [
#         "-NoExit",
#         "-ExecutionPolicy",
#         "Bypass",
#         "-Command",
#         ". 'WholePath:\\LiftLog\\load-dev-commands.ps1'"
#       ]
#     }
#   },
#   "terminal.integrated.defaultProfile.windows": "PowerShell with Dev Commands"
# }
#
function init {
    & (Join-Path $PSScriptRoot 'scripts/init.ps1')
}

function reload {
    & (Join-Path $PSScriptRoot 'scripts/reload.ps1')
}

function api {
    Set-Location (Join-Path $PSScriptRoot 'api')
    dotnet watch run
}

function web {
    Set-Location (Join-Path $PSScriptRoot 'web')
    npm run dev
}
