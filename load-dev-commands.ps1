# This file defines local PowerShell helper commands like:
#   init, rerun, etc.
#
# To load these commands in a PowerShell terminal:
#   . .\load-dev-commands.ps1
#
# If you want VS Code to auto-load them when opening the terminal,
# you can add a project-local or user-level terminal setting in VS Code.
#
# For example I added this to my .vscode/settings.json on Windows
# {
#   "terminal.integrated.profiles.windows": {
#     "PowerShell with Dev Commands": {
#       "source": "PowerShell",
#       "args": [
#         "-NoExit",
#         "-Command",
#         ". .\\load-dev-commands.ps1"
#       ]
#     }
#   },
#   "terminal.integrated.defaultProfile.windows": "PowerShell with Dev Commands"
# }
#
function init {
    .\scripts\init.ps1
}

function reload {
    .\scripts\reload.ps1
}

function api {
    Set-Location .\api
    dotnet run
}

function web {
    Set-Location .\web
    npm run dev
}