var regEmail =
  /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

$(".login_login_btn").click(function () {
  var idInput = $("#login_input_id");
  var pwdInput = $("#login_input_password");
  if (!idInput.val().trim()) {
    idInput.focus();
  } else if (!pwdInput.val().trim()) {
    pwdInput.focus();
  } else if (!regEmail.test(idInput.val().trim())) {
    alert("이메일 형식이 아닙니다");
    idInput.focus();
  } else {
    var postData = {
      email: $("#login_input_id").val().trim(),
      password: $("#login_input_password").val().trim(),
    };
    // console.log(postData);
    $.ajax({
      url: "http://43.202.152.189/auth/token",
      type: "POST",
      data: JSON.stringify(postData),
      contentType: "application/json",
      success: function (data) {
        setTokenFromSessionStorage(data.token);
        setCurrentUserIdFromSessionStorage(data.user.id);
        setHandleFromSessionStorage(data.user.handle);
        setCurrentUserAccountTypeFromSessionStorage(data.user.account_type);
        setThumbnailFromSessionStorage(data.user.thumbnail);
        window.location.replace("./corporation_feed.html");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 400) {
          console.error("Bad Request:", jqXHR.responseText);
          alert("형식이 일치하지 않습니다.");
        } else if (jqXHR.status === 401) {
          console.error("Unauthorized:", jqXHR.responseText);
          alert("인증에 실패했습니다.");
        } else {
          console.error("Error:", jqXHR.status, errorThrown);
          alert("서버 에러");
        }
        idInput.val("");
        pwdInput.val("");
      },
    });
  }
});

function setTokenFromSessionStorage(jwtToken) {
  return sessionStorage.setItem("jwtToken", jwtToken);
}

function setCurrentUserIdFromSessionStorage(currentUserId) {
  return sessionStorage.setItem("currentUserId", currentUserId);
}

function setHandleFromSessionStorage(handle) {
  return sessionStorage.setItem("handle", handle);
}

function setCurrentUserAccountTypeFromSessionStorage(currentUserAccountType) {
  return sessionStorage.setItem(
    "currentUserAccountType",
    currentUserAccountType
  );
}

function setThumbnailFromSessionStorage(thumbnail) {
  return sessionStorage.setItem("thumbnail", thumbnail);
}
