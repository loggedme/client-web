var personData = [];

function personDataHandler(userId, thumbnail) {
  var data = getPersonData();
  var existingIndex = -1; // 존재하는 객체의 인덱스 (존재하지 않는 경우 -1로 초기화)
  for (var i = 0; i < data.length; i++) {
    if (data[i].userId === userId) {
      existingIndex = i;
      break;
    }
  }
  if (existingIndex !== -1) {
    personData.splice(existingIndex, 1);
  } else {
    var newPerson = { userId: userId, thumbnail: thumbnail }; // 새로운 객체 생성
    personData.push(newPerson);
  }

  $(".checked_person_section").empty();
  $.each(getPersonData().reverse(), function (index, data) {
    var checkedPersonElement = $("<img>").attr({
      class: "checked_person_element",
      src: data.thumbnail,
      alt: data.userId,
    });
    $(".checked_person_section").append(checkedPersonElement);
  });
  // console.log(getPersonData());
}

function getPersonData() {
  return personData;
}

// session에 대한 get function
function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

function getURLBadge() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("badgeId");
}

function getCurrentUserIdFromSessionStorage() {
  return sessionStorage.getItem("currentUserId");
}

function getCurrentUserAccountTypeFromSessionStorage() {
  return sessionStorage.getItem("currentUserAccountType");
}

//document.ready()
$(function () {
  getSearchData("");
});

$(document).on("click", ".item_element", function (e) {
  e.preventDefault();
  personDataHandler(this.id, $(this).find(".item_image").attr("src"));
});

// function checkboxHandler(id) {
//   const checkbox = $(`#item_checkbox${id}`);
//   const label = $(`#item_checkbox_btn_label${id}`);
//   const container = $(`#${id}`);
//   if (checkbox.is(":checked")) {
//     checkbox.prop("checked", false);
//     label.css("backgroundColor", "rgba(217, 217, 217, 0.70)");
//     container.css("backgroundColor", "transparent");
//   } else {
//     checkbox.prop("checked", true);
//     label.css("backgroundColor", "#056CF2");
//     container.css("backgroundColor", "#D9D9D9");
//   }
//   personDataHandler(key);
//   console.log(getPersonData());
// }

// 가져온 데이터로 화면을 채워주는 함수
function setPersonData(data) {
  // console.log(data);
  $.each(data, function (index, item) {
    var itemElement = $("<a>").prop({
      class: "item_element",
      key: index,
      id: item.id,
      href: "#",
    });

    var imageWrap = $("<div>").prop({
      class: "item_image_wrap",
    });

    var imgElement = $("<img>").attr({
      src: item.thumbnail,
      alt: item.name,
      class: "item_image",
    });

    var userNameElement = $("<div>").prop({
      class: "item_username_wrap",
    });
    var userName = $("<div>").prop({
      class: "item_username",
      id: `item_username${item.id}`,
      textContent: item.name,
    });
    var userHandle = $("<div>").prop({
      class: "item_userhandle",
      textContent: item.handle,
    });
    userNameElement.append(userName).append(userHandle);

    imageWrap.append(imgElement);
    itemElement.append(imageWrap);
    itemElement.append(userNameElement);

    $(".main_section").append(itemElement);
  });
}

//디바운스 구현------------------------------------------------------------------------
var timer;
$(".search_input").on("input", function () {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(function () {
    const query = $(".search_input").val();
    $(".item_element").hide();
    getSearchData(query);
  }, 1000);
});

//ajax function
function getSearchData(query) {
  var jwtToken = getTokenFromSessionStorage();
  if (query.replace(/\s+/g, "") === "") {
    $.ajax({
      url: `http://43.202.152.189/user?recommend=true&type=personal`,
      method: "GET",
      dataType: "json",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      success: function (responseData) {
        // console.log(responseData);
        setPersonData(responseData);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 400) {
          console.error("Bad Request:", jqXHR.responseText);
          alert("사용자가 존재하지 않습니다.");
        } else {
          console.error("Error:", jqXHR.status, errorThrown);
          alert("서버 에러");
        }
      },
    });
  } else {
    $.ajax({
      url: `http://43.202.152.189/user?type=personal&query=${query}`,
      method: "GET",
      dataType: "json",
      success: function (responseData) {
        // console.log(responseData);
        setPersonData(responseData);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 400) {
          console.error("Bad Request:", jqXHR.responseText);
          alert("사용자가 존재하지 않습니다.");
        } else {
          console.error("Error:", jqXHR.status, errorThrown);
          alert("서버 에러");
        }
      },
    });
  }
}

//done button click event
$(".done_button").click(function () {
  if (getPersonData().length <= 0) {
    alert("부여할 계정이 없습니다.");
    return false;
  }

  var bodyData = {
    users: [],
  };
  var jwtToken = getTokenFromSessionStorage();
  $.each(getPersonData(), function (index, item) {
    bodyData.users.push(item.userId);
  });
  // console.log(JSON.stringify(bodyData));
  var badgeId = getURLBadge();
  // console.log(badgeId);
  $.ajax({
    url: `http://43.202.152.189/badge/${badgeId}/user`,
    method: "POST",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(bodyData),
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (responseData) {
      // console.log(JSON.stringify(responseData));
      alert("뱃지 부여 성공!");
      window.location.replace(
        `./profile_ent.html?userId=${getCurrentUserIdFromSessionStorage()}`
      );
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 400) {
        console.error("Bad Request:", jqXHR.responseText);
        alert("사용자가 존재하지 않습니다.");
      } else if (jqXHR.status === 404) {
        console.error("Not Found:", jqXHR.responseText);
        alert("해당 뱃지가 존재하지 않습니다.");
      } else if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("로그인되지 않았습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
});
