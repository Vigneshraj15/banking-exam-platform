' ParikshaBank Silent Desktop Launcher
' Runs the background services without popping up any black command prompt window.

Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")

strPath = FSO.GetParentFolderName(WScript.ScriptFullName)
batPath = Chr(34) & strPath & "\Launch-ParikshaBank.bat" & Chr(34)

' 0 = Hide console window, False = Return immediately without blocking
WshShell.Run batPath, 0, False
