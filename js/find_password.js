var regEmail =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

$(".find_password_header_logo").click(function () {
  window.location.href = "./login.html";
});

$(".find_password_header_goback_btn").click(function () {
  window.history.back();
});

$(".find_password_main_btn").click(function () {
  var emailInput = $(".find_password_main_input");
  if (!emailInput.val().trim()) {
    emailInput.focus();
  } else if (!regEmail.test(emailInput.val().trim())) {
    alert("이메일 형식이 아닙니다");
    emailInput.focus();
  } else {
    var postData = {
      email: emailInput.val().trim(),
    };
    // console.log(postData);
    $.ajax({
      url: "http://43.202.152.189/auth/validation",
      type: "POST",
      data: JSON.stringify(postData),
      contentType: "application/json",
      success: function (data) {
        sessionStorage.setItem(
          "email",
          JSON.stringify(emailInput.val().trim())
        );
        alert("입력한 이메일 주소로 인증코드를 전송했습니다");
        window.location.href = "./reset_password.html";
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 400) {
          console.error("Bad Request:", jqXHR.responseText);
          alert("형식이 일치하지 않습니다.");
        } else if (jqXHR.status === 429) {
          console.error("Too Many Requests:", jqXHR.responseText);
          alert("1분 뒤 다시 시도하십시오.");
        } else if (jqXHR.status === 503) {
          console.error("Service Unavailable:", jqXHR.responseText);
          alert("연결에 실패했습니다.");
        } else {
          console.error("Error:", jqXHR.status, errorThrown);
          alert("서버가안대나?");
        }
      },
    });
  }
});
