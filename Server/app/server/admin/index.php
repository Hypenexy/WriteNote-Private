<html>
<style>
    html{
        /* background: #090909;
        color: #fff; */
        color: #eee;
        background: #000;
    }
    el{
        display: block;
        border: 1px solid #555;
        border-radius: 4px;
        margin: 10px;
    }
    mid{
        display: block;
        font-size: 11px;
    }
</style>
<body>
    <div class="analytics">
        <p></p>
    </div>
</body>
<script>
    var logs = [];

<?php
require("../../../../app/server/db.php");

$conn = new mysqli($host, $user, $pass, 'writenote');

$result = $conn->query("SELECT * FROM `logs`");

while($row = mysqli_fetch_assoc($result)){
    echo 'logs.push({mid:'."'".$row["mid"]."'".', appdata:'.$row['appdata'].', time: "'.$row['time'].'"});';
}

?>
    for (let i = 0; i < logs.length; i++) {
        const element = logs[i];
        console.log(logs[i].appdata)
        try {
            var date = new Date(logs[i].time * 1000).toLocaleString();
            document.body.innerHTML += "<el>"+date+"</el>"
            // document.body.innerHTML += "<el><mid>" + logs[i].mid + "</mid>Version: " + logs[i].appdata.settings.version + ", Mobile: " + logs[i].appdata.mobile + ", Cores: " + logs[i].appdata.inf.co + ", GPU: " + logs[i].appdata.exc[6] + ", At least Memory: " + logs[i].appdata.exc[4] + "GB</el>"
        } catch (e) {
            console.log("unimportant: " + e)
        }
    }
</script>
</html>