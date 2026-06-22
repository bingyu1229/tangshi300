param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $Command
)

$cleanPath = [Environment]::GetEnvironmentVariable("Path", "Process")

if (-not $cleanPath) {
  $machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  $cleanPath = @($machinePath, $userPath) -join ";"
}

[Environment]::SetEnvironmentVariable("PATH", $null, "Process")
[Environment]::SetEnvironmentVariable("Path", $null, "Process")
[Environment]::SetEnvironmentVariable("Path", $cleanPath, "Process")

if ($Command.Count -eq 0) {
  cmd /c set path
  exit $LASTEXITCODE
}

$program = $Command[0]
$arguments = if ($Command.Count -gt 1) { $Command[1..($Command.Count - 1)] } else { @() }

& $program @arguments
exit $LASTEXITCODE
