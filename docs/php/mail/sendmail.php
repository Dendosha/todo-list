<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once('../vendor/autoload.php');
$mailSettings = require_once __DIR__ . '/mailSettings.php';

function sendMail(array $mailSettings, array $replyTo, string $subject, string $body, string $altBody = '', array $attachments = [])
{
	$mail = new PHPMailer(true);

	try {
		//Server settings
		$mail->SMTPDebug = SMTP::DEBUG_OFF;
		$mail->isSMTP();
		$mail->Host = $mailSettings['host'];
		$mail->SMTPAuth = $mailSettings['auth'];
		$mail->Username = $mailSettings['username'];
		$mail->Password = $mailSettings['password'];
		$mail->SMTPSecure = $mailSettings['secure'];
		$mail->Port = $mailSettings['port'];
		$mail->CharSet = $mailSettings['charset'];

		//Recipients
		$mail->setFrom($mailSettings['fromEmail'], $mailSettings['fromName']);
		foreach ($replyTo as $email) {
			$mail->addAddress($email);
		}

		//Attachments
		if ($attachments) {
			foreach ($attachments as $attachment) {
				$mail->addAttachment($attachment);
			}
		}

		//Content
		$mail->isHTML($mailSettings['isHtml']);
		$mail->Subject = $subject;
		$mail->Body = $body;
		if ($altBody) {
			$mail->AltBody = $altBody;
		}

		$mail->send();
		echo json_encode('Message has been sent');
	} catch (Exception $e) {
		echo json_encode("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
	}
}

$body = "
<h1>Форма обратной связи</h1>\n
<p><strong>Имя: </strong> {$_POST['userName']}</p>
<p><strong>Телефон: </strong> {$_POST['userPhoneNumber']}</p>
<p><strong>Комментарий: </strong> {$_POST['userComment']}</p>
";

sendMail($mailSettings['mailSettingsProd'], $mailSettings['replyTo'], 'Форма обратной связи', $body);
