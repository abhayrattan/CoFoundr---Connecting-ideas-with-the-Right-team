$ErrorActionPreference = "Stop"
function POST($url, $body, $token) {
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Post -Body ($body | ConvertTo-Json) -ContentType "application/json" -Headers $headers
}
function GET($url, $token) {
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Get -Headers $headers
}
function PUT($url, $body, $token) {
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    return Invoke-RestMethod -Uri $url -Method Put -Body ($body | ConvertTo-Json) -ContentType "application/json" -Headers $headers
}

$rand = Get-Random

Write-Host "Registering Student A..."
$student = POST "http://localhost:5000/api/auth/register" @{ name="Student A"; email="studenta$rand@test.com"; password="password" }
$studentToken = $student.token
PUT "http://localhost:5000/api/users/profile" @{ skills="React, Node.js" } $studentToken | Out-Null

Write-Host "Registering Leader..."
$leader = POST "http://localhost:5000/api/auth/register" @{ name="Leader 1"; email="leader$rand@test.com"; password="password"; role="leader" }
$leaderToken = $leader.token

Write-Host "Leader creates Startup..."
$startupRes = POST "http://localhost:5000/api/startups" @{ title="NextGen AI"; description="AI tool"; domain="AI"; requiredSkills="React, Node"; teamSize=2 } $leaderToken
$startupId = $startupRes.startup._id
$teamId = $startupRes.teamId

Write-Host "Student A searches for startup..."
$searchRes = GET "http://localhost:5000/api/startups?search=NextGen" $null
if ($searchRes.startups.Length -eq 0) { throw "Startup not found in search" }

Write-Host "Student A sends join request..."
$reqRes = POST "http://localhost:5000/api/join-requests" @{ startupId=$startupId; message="I know React!" } $studentToken
$reqId = $reqRes.request._id

Write-Host "Leader accepts join request..."
PUT "http://localhost:5000/api/join-requests/$reqId" @{ status="accepted" } $leaderToken | Out-Null

Write-Host "Check team members..."
$teamRes = GET "http://localhost:5000/api/startups/$startupId/team" $null
Write-Host "Team Members: $($teamRes.team.members.Length)"
if ($teamRes.team.members.Length -ne 2) { throw "Team member not added correctly" }

Write-Host "Check startup status..."
$updatedStartup = GET "http://localhost:5000/api/startups/$startupId" $null
Write-Host "Status: $($updatedStartup.startup.status)"
if ($updatedStartup.startup.status -ne 'full') { throw "Startup status did not change to full" }

Write-Host "All tests passed!"
