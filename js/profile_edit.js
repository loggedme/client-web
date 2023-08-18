var isChangeImage = false;
// session에 대한 get function
function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

function getCurrentUserIdFromSessionStorage() {
  return sessionStorage.getItem("currentUserId");
}

function setThumbnailFromSessionStorage(thumbnail) {
  return sessionStorage.setItem("thumbnail", thumbnail);
}

function setHandleFromSessionStorage(handle) {
  return sessionStorage.setItem("handle", handle);
}

$(function () {
  getUserData();
});

function getUserData() {
  var jwtToken = getTokenFromSessionStorage();
  var userId = getCurrentUserIdFromSessionStorage();
  $.ajax({
    url: `http://43.202.152.189/user/${userId}`,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      // console.log(data.user);
      $("#handle").attr("value", data.user.handle);
      $("#name").attr("value", data.user.name);
      $("#preview").attr("src", data.user.thumbnail);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("로그인 되지 않은 사용자입니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 404) {
        console.error("Not Found:", jqXHR.responseText);
        alert("존재하지 않는 사용자입니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
      }
    },
  });
}

$("#image_input").on("change", function (event) {
  isChangeImage = true;
  // variable management---------------------------
  const file = event.target.files[0];
  const preview = $("#preview");

  const reader = new FileReader();
  reader.onload = function (event) {
    preview.attr("src", event.target.result);
  };
  reader.readAsDataURL(file);
  // console.log(file);
  // console.log($("#making_badge_attach_image_input")[0].files[0]);
});

$(".logout").click(function () {
  sessionStorage.removeItem("jwtToken");
  sessionStorage.removeItem("currentUserAccountType");
  sessionStorage.removeItem("handle");
  sessionStorage.removeItem("currentUserId");
  sessionStorage.removeItem("thumbnail");
  window.location.href = "./login.html";
});

$(".signout").click(function () {
  var jwtToken = getTokenFromSessionStorage();
  var userId = getCurrentUserIdFromSessionStorage();
  $.ajax({
    url: `http://43.202.152.189/user/${userId}`,
    type: "DELETE",
    // dataType: "json",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      alert("회원탈퇴에 성공했습니다");
      window.location.href = "./login.html";
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없는 사용자입니다.");
        window.location.href = "./login.html";
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
      }
    },
  });
});

$(".edit_button").click(function () {
  setUserData();
});
function setUserData() {
  const jwtToken = getTokenFromSessionStorage();
  const userId = getCurrentUserIdFromSessionStorage();
  const handle = $("#handle").val().trim();
  const name = $("#name").val().trim();
  const fileInput = $("#image_input")[0].files[0];
  var profileData = new FormData();

  profileData.append("handle", $("#handle").val());
  profileData.append("name", name);
  if (isChangeImage) {
    profileData.append("profile_image", fileInput);
  }

  $.ajax({
    url: `http://43.202.152.189/user/${userId}`,
    // type: "PATCH",
    type: "PUT",
    dataType: "json",
    data: profileData,
    processData: false, // FormData 처리 방지
    contentType: false, // 컨텐츠 타입 설정 방지
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      setHandleFromSessionStorage(data.handle);
      setThumbnailFromSessionStorage(data.thumbnail);
      window.history.back();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("로그인 되지 않은 사용자입니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 404) {
        console.error("Not Found:", jqXHR.responseText);
        alert("존재하지 않는 사용자입니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
      }
    },
  });
}
