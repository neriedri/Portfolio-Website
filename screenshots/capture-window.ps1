# Launches a GUI app and captures ONLY its own window (not the rest of the
# desktop) to a PNG. Usage:
#   capture-window.ps1 -Exe <path> -AppArgs @("a","b") -WorkDir <dir> -Out <png> [-WaitSec 18]
param(
  [Parameter(Mandatory)] [string]$Exe,
  [string[]]$AppArgs = @(),
  [string]$WorkDir = $null,
  [Parameter(Mandatory)] [string]$Out,
  [int]$WaitSec = 18
)

Add-Type @"
using System;
using System.Runtime.InteropServices;
public class W {
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int n);
  [DllImport("user32.dll")] [return: MarshalAs(UnmanagedType.Bool)]
  public static extern bool GetWindowRect(IntPtr h, out RECT r);
  public struct RECT { public int Left, Top, Right, Bottom; }
}
"@
Add-Type -AssemblyName System.Drawing

$psi = @{ FilePath = $Exe; PassThru = $true }
if ($AppArgs.Count) { $psi.ArgumentList = $AppArgs }
if ($WorkDir) { $psi.WorkingDirectory = $WorkDir }
$p = Start-Process @psi

$h = [IntPtr]::Zero
for ($i = 0; $i -lt ($WaitSec * 2); $i++) {
  Start-Sleep -Milliseconds 500
  try { $p.Refresh() } catch {}
  if ($p.HasExited) { Write-Output "EXITED early (code $($p.ExitCode))"; break }
  if ($p.MainWindowHandle -ne [IntPtr]::Zero) { $h = $p.MainWindowHandle; break }
}

if ($h -eq [IntPtr]::Zero) {
  # fallback: any visible window from a child process sharing the tree
  Write-Output "NO MainWindowHandle"
}

Start-Sleep -Milliseconds 800
if ($h -ne [IntPtr]::Zero) {
  [W]::ShowWindow($h, 9) | Out-Null   # SW_RESTORE
  [W]::SetForegroundWindow($h) | Out-Null
  Start-Sleep -Milliseconds 700
  $r = New-Object W+RECT
  [W]::GetWindowRect($h, [ref]$r) | Out-Null
  $w = $r.Right - $r.Left; $hgt = $r.Bottom - $r.Top
  if ($w -gt 0 -and $hgt -gt 0) {
    $bmp = New-Object System.Drawing.Bitmap $w, $hgt
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.CopyFromScreen($r.Left, $r.Top, 0, 0, (New-Object System.Drawing.Size($w, $hgt)))
    $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    Write-Output ("OK {0}x{1} -> {2:N0} bytes" -f $w, $hgt, (Get-Item $Out).Length)
  } else { Write-Output "BAD RECT" }
}

try { if (-not $p.HasExited) { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } } catch {}
# kill stray children (python GUI may spawn)
