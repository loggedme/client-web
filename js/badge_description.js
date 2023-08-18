var isChangeImage = false;
function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

function getCurrentUserIdFromSessionStorage() {
  return sessionStorage.getItem("currentUserId");
}

function getURLBadgeId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("badgeId");
}

function getURLUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("userId");
}

//edit button click event
$(".edit_button").click(function () {
  $("#making_badge_attach_image_input").prop("disabled", false);
  $(".making_badge_attach_document").prop("disabled", false);
  $(".making_badge_attach_document").focus();
  $(".edit_button").hide();
  $(".button_wrap").fadeIn();
});

$(".save_button").click(function () {
  modifyBadgeHandler();
});

$(".delete_button").click(function () {
  deleteBadgeHandler();
});

function modifyBadgeHandler() {
  var jwtToken = getTokenFromSessionStorage();
  var badgeId = getURLBadgeId();
  var fileInput = $("#making_badge_attach_image_input")[0].files[0];
  var document = $(".making_badge_attach_document").val().trim();
  var badgeData = new FormData();
  if (isChangeImage) {
    badgeData.append("image", fileInput);
  }
  badgeData.append("description", document);

  $.ajax({
    url: `http://43.202.152.189/badge/${badgeId}`,
    type: "PUT",
    data: badgeData,
    processData: false, // FormData 처리 방지
    contentType: false, // 컨텐츠 타입 설정 방지

    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      alert("뱃지 수정에 성공했습니다");
      window.location.href = `./profile_ent.html?userId=${getCurrentUserIdFromSessionStorage()}`;

      // console.log("팔로우 취소: " + JSON.stringify(data));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("형식이 올바르지 않습니다.");
      } else if (jqXHR.status === 403) {
        console.error("Forbidden:", jqXHR.responseText);
        alert("올바른 접근이 아닙니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

$(function () {
  checkUser();
});

function checkUser() {
  var jwtToken = getTokenFromSessionStorage();
  var badgeId = getURLBadgeId();
  var currentUserId = getCurrentUserIdFromSessionStorage();
  var document = $(".making_badge_attach_document");
  $.ajax({
    url: `http://43.202.152.189/badge/${badgeId}`,
    type: "GET",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      // console.log(JSON.stringify(data));
      if (currentUserId == data.publisher.id) {
        $(".edit_button").show();
      }
      $("#making_badge_attach_image").attr("src", data.thumbnail);
      $(".making_badge_attach_document").text(data.description);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("형식이 올바르지 않습니다.");
      } else if (jqXHR.status === 403) {
        console.error("Forbidden:", jqXHR.responseText);
        alert("올바른 접근이 아닙니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

//이미지 업로드 버튼 눌렀을 때 호출되는 함수
$(".making_badge_attach_image_label").on("change", function (event) {
  isChangeImage = true;
  const file = event.target.files[0];
  const preview = $("#making_badge_attach_image");

  const reader = new FileReader();
  reader.onload = function (event) {
    preview.attr("src", event.target.result);
  };
  reader.readAsDataURL(file);
});

function deleteBadgeHandler() {
  var jwtToken = getTokenFromSessionStorage();
  var badgeId = getURLBadgeId();
  $.ajax({
    url: `http://43.202.152.189/badge/${badgeId}`,
    type: "DELETE",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      window.location.href = `./profile_ent.html?userId=${getCurrentUserIdFromSessionStorage()}`;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("형식이 올바르지 않습니다.");
      } else if (jqXHR.status === 403) {
        console.error("Forbidden:", jqXHR.responseText);
        alert("올바른 접근이 아닙니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}
