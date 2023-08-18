// static variable management------------------------
var isRequestEmail = false; //인증보냈는지 여부
var isResponseEmail = false; //인증받았는지 여부
var isCheckRadio = false; // 라디오박스 체크 여부
var regEmail =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

// get function management ---------------------------
function getIsRequestEmail() {
  return isRequestEmail;
}

function getIsResponseEmail() {
  return isResponseEmail;
}

function getIsCheckRadio() {
  return isCheckRadio;
}

// set function management ---------------------------
function setIsRequestEmail(bool) {
  return (isRequestEmail = bool);
}

function setIsResponseEmail(bool) {
  return (isResponseEmail = bool);
}

function setTureIsCheckRadio() {
  return (isCheckRadio = true);
}

// email 관련 function
function check_email() {
  var email = $("#signup_input_email");
  var email_err_msg = $("#signup_input_err_msg_email");
  if (!email.val().trim()) {
    email.focus();
    return false;
  } else if (regEmail.test(email.val().trim())) {
    email_err_msg.hide();
    email.css("margin-bottom", "0.81rem");
    return true;
  } else {
    email_err_msg.show();
    email.css("margin-bottom", "0");
    email.focus();
    return false;
  }
}

// 인증번호 전송 button click event
$(".signup_email_certification_button").click(function () {
  setIsResponseEmail(false);
  if (check_email()) {
    certificationHandler();
  } else {
    setIsRequestEmail(false);
    $("#signup_input_email_num").attr("disabled", true);
    return false;
  }
});

function certificationHandler() {
  const emailInput = $("#signup_input_email");
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
      sessionStorage.setItem("email", JSON.stringify(emailInput.val().trim()));
      alert("입력한 이메일 주소로 인증코드를 전송했습니다");
      setIsRequestEmail(true);
      $("#signup_input_email_num").attr("disabled", false);
      $("#signup_input_email_num").focus();
      return true;
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

// 인증번호 확인 event function
$(".signup_email_num_button").click(function () {
  if (!getIsRequestEmail()) {
    $("#signup_input_email").focus();
  } else if (!$("#signup_input_email_num").val().trim()) {
    $("#signup_input_email_num").focus();
  } else {
    check_email_num();
  }
});

function check_email_num() {
  var postData = {
    email: JSON.parse(sessionStorage.getItem("email")),
    code: $("#signup_input_email_num").val().trim(),
  };
  // console.log(postData);
  $.ajax({
    url: "http://43.202.152.189/auth/validation/check",
    type: "POST",
    data: JSON.stringify(postData),
    contentType: "application/json",
    success: function (data) {
      alert("인증 성공");
      sessionStorage.setItem("code", JSON.stringify(postData.code));
      $("#signup_input_email_num").attr("disabled", true);
      $("#signup_input_name").focus();
      setIsResponseEmail(true);
      return true;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("형식이 일치하지 않습니다.");
      } else if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("인증번호가 일치하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버가안대나?");
      }
      $("#signup_input_email_num").focus();
      setIsResponseEmail(false);
      return false;
    },
  });
}

function check_name() {
  return $("#signup_input_name").val().trim() ? true : false;
}

function check_handle() {
  return $("#signup_input_handle").val().trim() ? true : false;
}

function check_password() {
  return $("#signup_input_password").val().trim() ? true : false;
}

function check_re_password() {
  return $("#signup_input_re_password").val().trim() ? true : false;
}

//password 일치하는지 검사
function password_matching() {
  var pwd = $("#signup_input_password").val();
  var re_pwd = $("#signup_input_re_password").val();
  if (pwd === re_pwd) {
    $("#signup_input_err_msg_re_password").hide();
    $("#signup_input_re_password").css("margin-bottom", "0.81rem");
    return true;
  } else {
    $("#signup_input_err_msg_re_password").show();
    $("#signup_input_re_password").css("margin-bottom", "0");
    return false;
  }
}

//실시간 email input change event
$("#signup_input_email").on(
  "propertychange change keyup paste input",
  function () {
    check_email();
  }
);

//re-password 실시간 change event
$("#signup_input_re_password").on(
  "propertychange change keyup paste input",
  function () {
    password_matching();
  }
);

//re-password 실시간 change event
$("#signup_input_password").on(
  "propertychange change keyup paste input",
  function () {
    password_matching();
  }
);

//radio button click event
$("input:radio[name=radiobutton1]").click(function () {
  if ($("input:radio[name=radiobutton1]:checked").val() === "business") {
    $("#radiobutton1_label2").css("background-color", "#6970f2");
    $("#radiobutton1_label2").css("color", "white");
    $("#radiobutton1_label1").css(
      "background-color",
      " rgba(217, 217, 217, 0.7)"
    );
    $("#radiobutton1_label1").css("color", "black");
  } else {
    $("#radiobutton1_label1").css("background-color", "#6970f2");
    $("#radiobutton1_label1").css("color", "white");
    $("#radiobutton1_label2").css(
      "background-color",
      " rgba(217, 217, 217, 0.7)"
    );
    $("#radiobutton1_label2").css("color", "black");
  }
  setTureIsCheckRadio();
});

// ok button click event
$(".signup_signup_btn").click(function () {
  if (!check_email()) {
  } else if (!getIsRequestEmail() || !getIsResponseEmail()) {
    $("#signup_input_email_num").focus();
  } else if (!check_name()) {
    $("#signup_input_name").focus();
  } else if (!check_handle()) {
    $("#signup_input_handle").focus();
  } else if (!check_password()) {
    $("#signup_input_password").focus();
  } else if (!check_re_password()) {
    $("#signup_input_re_password").focus();
  } else if (!password_matching()) {
    $("#signup_input_re_password").focus();
  } else if (!getIsCheckRadio()) {
    alert("사용자 유형을 선택해주세요");
  } else {
    var postData = {
      email: JSON.parse(sessionStorage.getItem("email")),
      code: JSON.parse(sessionStorage.getItem("code")),
      name: $("#signup_input_name").val().trim(),
      password: $("#signup_input_password").val().trim(),
      handle: $("#signup_input_handle").val().trim(),
      account_type:
        $("input[name=radiobutton1]:checked").val() == "personal" ? 1 : 2,
      // email: "test2@test.com",
      // code: "123455",
      // name: "2연출",
      // username: "2연출",
      // password: "1234",
      // handle: "test2",
      // account_type: 2,
    };
    // console.log(postData);
    $.ajax({
      url: "http://43.202.152.189/user",
      type: "POST",
      data: JSON.stringify(postData),
      contentType: "application/json",
      success: function (data) {
        // console.log(data);
        alert("회원가입 성공");
        window.location.href = "./login.html";
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 400) {
          console.error("Bad Request:", jqXHR.responseText);
          alert("형식이 일치하지 않습니다.");
        } else if (jqXHR.status === 401) {
          console.error("Unauthorized:", jqXHR.responseText);
          alert("인증번호가 일치하지 않습니다.");
        } else if (jqXHR.status === 409) {
          console.error("Conflict:", jqXHR.responseText);
          alert("동일한 이메일, 핸들로 가입한 사용자가 존재합니다.");
        } else {
          console.error("Error:", jqXHR.status, errorThrown);
          alert("서버가안대나?");
        }
        $("#signup_input_email_num").focus();
        return false;
      },
    });
  }
});

$(".signup_header_logo").click(function () {
  window.location.href = "./login.html";
});

$(".signup_header_goback_btn").click(function () {
  window.history.back();
});
