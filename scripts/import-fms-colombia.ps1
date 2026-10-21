[CmdletBinding()]
param(
  [Parameter()]
  [ValidateNotNullOrEmpty()]
  [string]$Path = "supabase/imports/001_fms_colombia_2026_27.sql",

  [Parameter()]
  [ValidateNotNullOrEmpty()]
  [string]$Container = "supabase_db_freestylett"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
  throw "No se encontro el archivo SQL: $Path"
}

$resolvedPath = (Resolve-Path -LiteralPath $Path).Path
$containerPath = "/tmp/$([System.IO.Path]::GetFileName($resolvedPath))"

& docker inspect $Container *> $null

if ($LASTEXITCODE -ne 0) {
  throw "El contenedor '$Container' no existe o no esta iniciado."
}

Write-Host "Copiando el SQL sin transformar su codificacion..."
& docker cp $resolvedPath "$($Container):$containerPath"

if ($LASTEXITCODE -ne 0) {
  throw "Docker no pudo copiar el archivo SQL."
}

try {
  Write-Host "Ejecutando la importacion transaccional..."
  & docker exec -i $Container psql `
    -U postgres `
    -d postgres `
    -v ON_ERROR_STOP=1 `
    -f $containerPath

  if ($LASTEXITCODE -ne 0) {
    throw "La importacion fallo y PostgreSQL revirtio la transaccion."
  }

  Write-Host "Importacion completada correctamente."
}
finally {
  & docker exec $Container rm -f $containerPath *> $null
}
