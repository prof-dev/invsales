<?php
		header('Access-Control-Allow-Origin: *');
		header('Content-Type: application/json;charset=utf-8');
		session_start();
		  $type=$_GET["type"];
		  if ($type==="logout"){
			$_SESSION['loggedin']='false';
			$_SESSION['user']=null;
			echo '{"id":0, "message":"Lggged out successfully."}';
		}
		  if ($type==="login"){
			  if ($_SESSION['loggedin']==='true'){
				echo $_SESSION['user'];
			}else{
				$conn = new mysqli('localhost','root', '','invsales');
				if ($conn->connect_error) {
					die("Connection failed: " . $conn->connect_error);
				} else {
		
				  $username=$_GET["username"];
				  $pwd=$_GET["pwd"];
				  
				  $stmt = $conn->prepare("SELECT * from users WHERE username=? AND pwd=?");
				  $stmt->bind_param("ss",$username,$pwd);
				  $stmt->execute();
				  $result = $stmt->get_result();
				  $row = $result->fetch_assoc();
				  if ($row){
					$_SESSION['loggedin']='true';
					$_SESSION['user']=json_encode($row);
					echo $_SESSION['user'];
				  }else{
					echo  json_encode("{'id':0, 'message':'No such user.'}");
				  }
				  $conn->close();
			  }
		}
	}
?>