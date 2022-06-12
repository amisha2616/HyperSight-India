<?php
include('PHPMailer/PHPMailerAutoload.php');

$name = $_POST['name'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$from_email = $_POST['email'];
$msg = "<br/>Name : ".$name."<br/>Email ID : ".$from_email."<br/>Message : ".$message;
echo smtp_mailer('pnstests1234@gmail.com',$from_email,$subject,$msg);
function smtp_mailer($to,$from_email,$subj,$msg){
	$mail=new PHPMailer();
	$mail->IsSMTP();
	$mail->SMTPAuth = true;
	$mail->SMTPSecure = 'tls';
	$mail->Host = "smtp.gmail.com";
	$mail->Port = 587;
	$mail->IsHTML(true);
	$mail->CharSet = 'UTF-8';
	$mail->Username = "pnstests1234@gmail.com";
	$mail->Password = "tests_pns1234";
	$mail->setFrom($from_email,'Query');
	$mail->Subject = $subj;
	$mail->Body = $msg;
	$mail->AddAddress($to);
	$mail->SMTPOptions = array('ssl' => array(
		'verify_peer'=>false,
		'verify_peer_name'=>false,
		'allow_self_assigned'=>false
	));
	if(!$mail->Send()){
		echo $mail->ErrorInfo;
	}
	else{
		echo '<script>alert("Message Sent Successfully!");</script>';
		header( 'location: ../contact2.html');
	}
}
?>