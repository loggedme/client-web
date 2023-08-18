//이미지 업로드 버튼 눌렀을 때 호출되는 함수
$(".making_badge_attach_image_label").on("change", function (event) {
  // variable management---------------------------
  const file = event.target.files[0];
  const preview = $("#making_badge_attach_image");

  const reader = new FileReader();
  reader.onload = function (event) {
    preview.attr("src", event.target.result);
    preview.css({ width: "100%", height: "100%" });
  };
  reader.readAsDataURL(file);
  // console.log(file);
  // console.log($("#making_badge_attach_image_input")[0].files[0]);
});

$(".done_button").click(function () {
  const img = $("#making_badge_attach_image");
  const document = $(".making_badge_attach_document").val().trim();
  const fileInput = $("#making_badge_attach_image_input")[0].files[0];

  if (img.attr("src") == "../image/upload.png") {
    alert("뱃지 이미지를 등록해주세요.");
  } else if (!document) {
    alert("뱃지 설명을 등록해주세요.");
  } else {
    const jwtToken = getTokenFromSessionStorage();
    var badgeData = new FormData();
    badgeData.append("image", fileInput);
    badgeData.append("description", document);

    $.ajax({
      url: `http://43.202.152.189/badge`,
      type: "POST",
      data: badgeData,
      processData: false, // FormData 처리 방지
      contentType: false, // 컨텐츠 타입 설정 방지
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      success: function (data) {
        // console.log("뱃지 등록 성공: " + JSON.stringify(data));
        window.location.href = `./badge_grant.html?badgeId=${data.id}`;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 400) {
          console.error("Bad Request:", jqXHR.responseText);
          alert("입력 형식이 올바르지 않습니다.");
        } else if (jqXHR.status === 401) {
          console.error("Unauthorized:", jqXHR.responseText);
          alert("접근이 올바르지 않습니다.");
        } else if (jqXHR.status === 403) {
          console.error("Forbidden:", jqXHR.responseText);
          alert("기업 사용자가 아닙니다.");
        } else {
          console.error("Error:", jqXHR.status, errorThrown);
          alert("서버 에러");
        }
      },
    });
  }
});

function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}
