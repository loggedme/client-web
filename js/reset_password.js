// varaible management-------------------------------
var isCertification = false; //인증 여부

// set function
function setIsCertification(state) {
  return (isCertification = state);
}

function setCode(code) {
  return sessionStorage.setItem("code", JSON.stringify(code));
}

// get function
function getIsCertification() {
  return isCertification;
}

function getEmailValue() {
  return JSON.parse(sessionStorage.getItem("email"));
}

function getCertificationDOM() {
  return $("#reset_password_main_certification_num");
}

function getCertificationDOMValue() {
  return $("#reset_password_main_certification_num").val().trim();
}

function getNewPwdDOM() {
  return $("#reset_password_main_new_password");
}

function getNewPwdDOMValue() {
  return $("#reset_password_main_new_password").val().trim();
}

function getNewREPwdDOM() {
  return $("#reset_password_main_re_password");
}

function getNewREPwdDOMValue() {
  return $("#reset_password_main_re_password").val().trim();
}

function getCode() {
  return JSON.parse(sessionStorage.getItem("code"));
}

// window location functoin
$(".reset_password_header_logo").click(function () {
  window.location.href = "./login.html";
});
$(".reset_password_header_goback_btn").click(function () {
  window.history.back();
});

//re-password 실시간 change event
$("#reset_password_main_re_password").on(
  "propertychange change keyup paste input",
  function () {
    password_matching();
  }
);

//password 실시간 change event
$("#reset_password_main_new_password").on(
  "propertychange change keyup paste input",
  function () {
    password_matching();
  }
);

// 인증번호 확인 버튼 click event
$(".certification_check_btn").click(function () {
  if (!getCertificationDOMValue()) {
    getCertificationDOM().focus();
  } else if (getEmailValue() == null) {
    alert("올바른 접근이 아닙니다.");
    // window.location.href = "./login.html";
  } else {
    var $certificationBtn = $(this);
    var postData = {
      email: getEmailValue(),
      code: getCertificationDOMValue(),
    };
    // console.log(postData);
    $.ajax({
      url: "http://43.202.152.189/auth/validation/check",
      type: "POST",
      data: postData,
      // contentType: "application/json",
      success: function (data) {
        alert("인증 성공");
        setIsCertification(true);
        setCode(postData.code);
        getCertificationDOM().prop("disabled", true);
        $certificationBtn.prop("disabled", true); // 버튼 비활성화
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
      },
    });
  }
});

//password 일치하는지 검사
function password_matching() {
  if (getNewPwdDOMValue() === getNewREPwdDOMValue()) {
    $("#reset_password_input_err_msg_re_password").css("visibility", "hidden");
    return true;
  } else {
    $("#reset_password_input_err_msg_re_password").css("visibility", "visible");
    return false;
  }
}
// 비밀번호 변경하기 버튼 click event
$(".reset_password_main_btn").click(function () {
  if (!getNewPwdDOMValue()) {
    getNewPwdDOM().focus();
  } else if (!getNewREPwdDOMValue()) {
    getNewREPwdDOM().focus();
  } else if (!password_matching()) {
  } else if (!getIsCertification()) {
    alert("인증을 해주세요");
    getCertificationDOM().focus();
  } else {
    var postData = {
      email: getEmailValue(),
      code: getCode(),
      password: getNewPwdDOMValue(),
    };
    // console.log(postData);
    $.ajax({
      url: "http://43.202.152.189/auth/reset-password",
      type: "POST",
      data: postData,
      success: function (data) {
        alert("변경에 성공했습니다.");
        // console.log(data);
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("code");
        window.location.href = "./login.html";
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
      },
    });
  }
});
