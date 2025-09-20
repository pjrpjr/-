param(
    [string]$NotesPath = "webpage/frontend-build/CONTEXT_NOTES.md",
    [string]$TodoPath = "webpage/frontend-build/TODO.md",
    [int]$NotesLines = 30,
    [int]$TodoLines = 50
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Output "=== Context Snapshot ($timestamp) ==="

function Show-Section {
    param(
        [string]$Title
    )
    Write-Output ""
    Write-Output $Title
    Write-Output ("-" * $Title.Length)
}

if (Test-Path $NotesPath) {
    Show-Section "Notes preview: $NotesPath"
    Get-Content -Path $NotesPath -TotalCount $NotesLines
} else {
    Show-Section "Notes preview: $NotesPath"
    Write-Output "(missing)"
}

if (Test-Path $TodoPath) {
    Show-Section "Open TODO items: $TodoPath"
    $openItems = Select-String -Path $TodoPath -Pattern ''^\s*- \[ \]'' | Select-Object -First $TodoLines
    if ($openItems) {
        $openItems.ForEach({ $_.Line })
    } else {
        Write-Output "(no unchecked items found)"
    }
} else {
    Show-Section "Open TODO items: $TodoPath"
    Write-Output "(missing)"
}

if (Test-Path ".git") {
    Show-Section "Git status"
    git status -sb
} else {
    Show-Section "Git status"
    Write-Output "(no .git directory detected)"
}

Show-Section "Top-level directories"
Get-ChildItem -Directory | Select-Object -ExpandProperty Name

Show-Section "Usage"
Write-Output "Run: powershell -ExecutionPolicy Bypass -File scripts/context_snapshot.ps1"
Write-Output "Adjust -NotesLines / -TodoLines or override paths to target other modules when needed."
