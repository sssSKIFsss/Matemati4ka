//после загрузки веб-страницы
$(function () {

  // при отправке формы messageForm на сервер (id="messageForm")
  $('#messageForm').submit(function (event) {
    // отменим стандартное действие браузера
    event.preventDefault();
    // заведём переменную, которая будет говорить о том валидная форма или нет
    var formValid = true;

    // перебирём все элементы управления формы (input и textarea) 
    $('#messageForm input,#messageForm textarea').each(function () {

      //найти предков, имеющих класс .form-group (для установления success/error)
      var formGroup = $(this).parents('.form-group');
      //найти glyphicon (иконка успеха или ошибки)
      var glyphicon = formGroup.find('.form-control-feedback');
      //валидация данных с помощью HTML5 функции checkValidity
      if (this.checkValidity()) {
        //добавить к formGroup класс .has-success и удалить .has-error
        formGroup.addClass('has-success').removeClass('has-error');
        //добавить к glyphicon класс .glyphicon-ok и удалить .glyphicon-remove
        glyphicon.addClass('glyphicon-ok').removeClass('glyphicon-remove');
      } else {
        //добавить к formGroup класс .has-error и удалить .has-success
        formGroup.addClass('has-error').removeClass('has-success');
        //добавить к glyphicon класс glyphicon-remove и удалить glyphicon-ok
        glyphicon.addClass('glyphicon-remove').removeClass('glyphicon-ok');
        //если элемент не прошёл проверку, то отметить форму как не валидную 
        formValid = false;
      }
    });

    // если форма валидна, то отправляем форму на сервер (AJAX)
    if (formValid) {

      // получаем имя, которое ввёл пользователь	
      var name = $("#name").val();
      // получаем email, который ввёл пользователь
      var email = $("#email").val();
	    // получаем номер телефона, который ввёл пользователь
	    var phone = $("#phone").val();
      // получаем сообщение, которое ввёл пользователь
      var message = $("#message").val();

      // объект, посредством которого будем кодировать форму перед отправкой её на сервер
      var formData = new FormData();
      // добавить в formData значение 'name'=значение_поля_name
      formData.append('name', name);
      // добавить в formData значение 'email'=значение_поля_email
      formData.append('email', email);
	    // добавить в formData значение 'phone'=значение_поля_phone
	    formData.append('phone', phone);
      // добавить в formData значение 'message'=значение_поля_message
      formData.append('message', message);

      // отправляем данные на сервер, используя технологию AJAX
      $.ajax({
        //метод передачи запроса - POST
        type: "POST",
        //URL-адрес запроса 
        url: "/feedback/verify.php",
        //передаваемые данные - formData
        data: formData,
        // не устанавливать тип контента, т.к. используется FormData
        contentType: false,
        // не обрабатывать данные formData
        processData: false,
        // отключить кэширование результатов в браузере
        cache: false,
        //при успешном выполнении запроса
        success: function (data) {
          // разбираем строку JSON, полученную от сервера
          var $data = JSON.parse(data);
          // устанавливаем элементу, содержащему текст ошибки, пустую строку
          $('#error').text('');

          // если сервер вернул ответ success, то значит данные отправлены
          if ($data.result == "success") {
            // скрываем форму обратной связи
            $('#messageForm').hide();
            // удаляем у элемента, имеющего id=msgSubmit, класс hidden
            $('#msgSubmit').removeClass('hidden');
          } else {
            // Если сервер вернул ответ error, то делаем следующее...
            $('#error').text('Произошла ошибка при отправке формы на сервер.');
          }
        },
        error: function (request) {
          $('#error').text('Произошла ошибка ' + request.responseText + ' при отправке данных.');
        }
      });
    }
  });
});
