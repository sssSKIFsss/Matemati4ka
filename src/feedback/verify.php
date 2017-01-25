<?php
  // открываем сессию
  session_start();

  // переменная в которую будем сохранять результат работы
  $data['result']='error';

  // функция для проверки длины строки
  function validStringLength($string,$min,$max) {
    $length = mb_strlen($string,'UTF-8');
    if (($length<$min) || ($length>$max)) {
      return false;
    }
    else {
      return true;
    }
  }

  // если данные были отправлены методом POST, то...
  if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $data['result']='success';

    //получить имя, которое ввёл пользователь
    if (isset($_POST['name'])) {
      $name = $_POST['name'];
      if (!validStringLength($name,2,30)) {
        $data['name']='Поля имя содержит недопустимое количество символов.';   
        $data['result']='error';
      }
    } else {
      $data['result']='error';
    }
    //получить email, которое ввёл пользователь
    if (isset($_POST['email'])) {
      $email = $_POST['email'];
      if (!filter_var($email,FILTER_VALIDATE_EMAIL)) {
        $data['email']='Поле email введено неправильно';
        $data['result']='error';
      }
    } else {
      $data['result']='error';
    }
    //получить phone, который ввёл пользователь
    if(isset($_POST['phone'])) {
      $phone = $_POST['phone'];
      if(!validStringLength($phone,7,16)) {
        $data['phone']='Поля phone содержит недопустимое количество символов.';
        $data['result']='error';
      }
    } else {
      $data['result']='error';
    }
    //получить сообщение, которое ввёл пользователь
    if (isset($_POST['message'])) {
      $message = $_POST['message'];
      if (!validStringLength($message,20,500)) {
        $data['message']='Поле сообщение содержит недопустимое количество символов.';
        $data['result']='error';
      }
    } else {
      $data['result']='error';
    }
  } else {
    // данные не были отправлены методом POST
    $data['result']='error';
  }

  // дальнейшие действия (ошибок не обнаружено)
  if ($data['result']=='success') {
    //1. Сохрание формы в файл
    $output = "---------------------------------" . "\n";
    $output .= date("d-m-Y H:i:s") . "\n";
    $output .= "Имя пользователя: " . $name . "\n";
    $output .= "Адрес email: " . $email . "\n";
    $output .= "Телефон: " . $phone . "\n";
    $output .= "Сообщение: " . $message . "\n";
    if (file_put_contents(dirname(__FILE__).'/message.txt', $output, FILE_APPEND | LOCK_EX)) {
      $data['result']='success';
    } else {
      $data['result']='error';
    } 
    //2. Отправляем на почту

    // включить файл PHPMailerAutoload.php
    require_once dirname(__FILE__) . '/phpmailer/PHPMailerAutoload.php';

    //формируем тело письма
    $output = "Дата: " . date("d-m-Y H:i") . "\n";
    $output .= "Имя пользователя: " . $name . "\n";
    $output .= "Адрес email: " . $email . "\n";
    $output .= "Телефон пользователя: " . $phone . "\n";
    $output .= "Сообщение: " . "\n" . $message . "\n";

    // если не используем прикрепление файлов
    // отправляем файлы в качестве ссылок в теме письма
    /*if (isset($files)) {
      $output .= "Файлы: " . "\n";
      foreach ($files as $value) {
        $href = substr($value,strpos($value, '/feedback/'));
        $output .= '<p><a href="'.$href.'">'.$href.'</a></p>' . "\n";
      }
    }*/

    // создаём экземпляр класса PHPMailer
    $mail = new PHPMailer;

    $mail->CharSet = 'UTF-8';
    $mail->From      = 'email@matemati4ka.comuf.com';
    $mail->FromName  = 'Matemati4ka';
    $mail->Subject   = 'Сообщение с формы обратной связи сайта Matemati4ka';
    $mail->Body      = $output;
    $mail->AddAddress( 'ksa.if.reg@mail.ru' );

    echo 'ОТПРАВКА ПИСЬМА='.$mail->From;
    // отправляем письмо
    if ($mail->Send()) {
      $data['result']='success';
    } else {
      $data['result']='error';
    }
  }

  echo json_encode($data);

?>