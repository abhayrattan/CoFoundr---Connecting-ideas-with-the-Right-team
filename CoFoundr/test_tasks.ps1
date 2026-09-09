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

Write-Host "Registering Member..."
$member = POST "http://localhost:5000/api/auth/register" @{ name="Member B"; email="memberb$rand@test.com"; password="password" }
$memberToken = $member.token
$memberId = $member.user._id

Write-Host "Registering Leader..."
$leader = POST "http://localhost:5000/api/auth/register" @{ name="Leader B"; email="leaderb$rand@test.com"; password="password"; role="leader" }
$leaderToken = $leader.token
$leaderId = $leader.user._id

Write-Host "Leader creates Startup..."
$startupRes = POST "http://localhost:5000/api/startups" @{ title="Chat App"; description="Chat"; domain="Chat"; teamSize=2 } $leaderToken
$startupId = $startupRes.startup._id
$teamId = $startupRes.teamId

Write-Host "Member sends join request..."
$reqRes = POST "http://localhost:5000/api/join-requests" @{ startupId=$startupId; message="Invite me!" } $memberToken
$reqId = $reqRes.request._id

Write-Host "Leader accepts join request..."
PUT "http://localhost:5000/api/join-requests/$reqId" @{ status="accepted" } $leaderToken | Out-Null

Write-Host "Leader creates Task and assigns to Member..."
$taskRes = POST "http://localhost:5000/api/tasks" @{ title="Build Chat"; teamId=$teamId; startupId=$startupId; assignedTo=$memberId; priority="High" } $leaderToken
$taskId = $taskRes.task._id

Write-Host "Member updates Task..."
PUT "http://localhost:5000/api/tasks/$taskId" @{ status="In Progress" } $memberToken | Out-Null
PUT "http://localhost:5000/api/tasks/$taskId" @{ status="Completed" } $memberToken | Out-Null

Write-Host "Member checks notifications..."
$mNotifs = GET "http://localhost:5000/api/notifications" $memberToken
Write-Host "Member Notifications: $($mNotifs.notifications.Length)"
if ($mNotifs.notifications.Length -eq 0) { throw "No notifications for member" }

Write-Host "Leader checks notifications..."
$lNotifs = GET "http://localhost:5000/api/notifications" $leaderToken
Write-Host "Leader Notifications: $($lNotifs.notifications.Length)"
if ($lNotifs.notifications.Length -eq 0) { throw "No notifications for leader" }

Write-Host "All tests passed!"
