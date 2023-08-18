// state 값에 따라 화면 분기

// session에 대한 get function
function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

function getCurrentUserIdFromSessionStorage() {
  return sessionStorage.getItem("currentUserId");
}

function getURLParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  if (param == "userHandle") {
    return urlParams.get("userHandle");
  } else if (param == "userId") {
    return urlParams.get("userId");
  } else if (param == "isFollowing") {
    return urlParams.get("isFollowing");
  }
}

// ajax function
function getDataforPageInit(param) {
  var jwtToken = getTokenFromSessionStorage();
  var currentUserId = getCurrentUserIdFromSessionStorage();
  var userId = getURLParam("userId");
  $.ajax({
    url: `http://43.202.152.189/user/${userId}/${param}`,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      // console.log("sueccess: " + JSON.stringify(data.items));
      $.each(data.items, function (index, item) {
        var itemElement = $("<a>").prop({
          class: "item_element",
          id: "wrap" + item.id + item.account_type,
        });

        var imgElement = $("<img>").attr({
          src: item.thumbnail,
          alt: item.name,
          class: "item_image",
        });

        var userNameElement = $("<div>").prop({
          class: "item_userName",
          textContent: item.handle,
        });

        var followElement = $("<button>").prop({
          class: "item_following_btn",
          textContent: item.is_following ? "Following" : "follow",
          id: "btn" + item.id,
        });

        followElement.css({
          backgroundColor: item.is_following
            ? "#6970f2"
            : "rgba(217, 217, 217, 0.5)",
          color: item.is_following ? "white" : "#000",
        });

        itemElement.append(imgElement);
        itemElement.append(userNameElement);
        itemElement.append(followElement);

        $(`.${param}_list_main_section`).append(itemElement);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("사용자가 존재하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

$(function () {
  initUserHandle();
  getDataforPageInit("follower");
  getDataforPageInit("following");
  if (getURLParam("isFollowing")) {
    slideFollowing();
  }
});

// init user handle
function initUserHandle() {
  $(".follow_list_main_header_title").text(getURLParam("userHandle"));
}

// button click event----------------------------------------------
// profile click event
$(document).on("click", ".item_element", function () {
  let userId = $(this).attr("id").slice(4, -1);
  let userAccountType = $(this).attr("id").slice(-1);
  profileClickHandler(userId, userAccountType);
});
// following button click event
$(document).on("click", ".item_following_btn", function (e) {
  e.stopPropagation();
  if ($(this).text() == "follow") {
    followHandler($(this).attr("id").slice(3));
    $(this).css({
      "background-color": "#6970f2",
      color: "white",
    });
    $(this).text("Following");
  } else {
    unfollowHandler($(this).attr("id").slice(3));
    $(this).css({
      "background-color": "rgba(217, 217, 217, 0.5)",
      color: "#000",
    });
    $(this).text("follow");
  }
});

$("#Follower_list").click(function () {
  slideFollwer();
});

$("#Following_list").click(function () {
  slideFollowing();
});

//디바운스 구현------------------------------------------------------------------------
var timer;
$(".follow_list_main_search_input").on("input", function () {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(function () {
    const query = $(".follow_list_main_search_input").val();
    // console.log(query);
    $(".item_userName").each(function () {
      var personName = $(this).text().toLowerCase();
      // console.log(personName);
      if (personName.includes(query)) {
        $(this).parent().show();
      } else {
        $(this).parent().hide();
      }
    });
  }, 300);
});

// slide event 처리 function------------------------------------------------------------
let startPoint = 0;
let endPoint = 0;

$(".follow_list_main_section").on("mousedown touchstart", (e) => {
  startPoint = e.type === "mousedown" ? e.pageX : e.touches[0].pageX;
});

var state = "left";
$(".follow_list_main_section").on("mouseup touchend", (e) => {
  endPoint = e.type === "mouseup" ? e.pageX : e.changedTouches[0].pageX;
  if (startPoint < endPoint && state == "right") {
    slideFollwer();
    state = "left";
  } else if (startPoint > endPoint && state == "left") {
    slideFollowing();
    state = "right";
  }
});

// toggle page ---------------------------------------------------------------------------
function slideFollowing() {
  $(".follow_list_main_section").css({
    transform: "translateX(-50%)",
    transition: "transform 0.5s ease-in-out",
  });
  $(".toggle_wrap").removeClass("follwers");
  $(".toggle_wrap").addClass("following");
  $(".follow_list_main_search_input").val("");
  $(".follow_list_main_search_input").trigger("input");
}

function slideFollwer() {
  $(".follow_list_main_section").css({
    transform: "translateX(0%)",
    transition: "transform 0.5s ease-in-out",
  });
  $(".toggle_wrap").removeClass("following");
  $(".toggle_wrap").addClass("follwers");
  $(".follow_list_main_search_input").val("");
  $(".follow_list_main_search_input").trigger("input");
}

//프로필 클릭 시 함수
function profileClickHandler(userId, userAccountType) {
  if (userAccountType == 1) {
    window.location.href = `./profile_per.html?userId=${userId}`;
  } else {
    window.location.href = `./profile_ent.html?userId=${userId}`;
  }
}

// ajax for 팔로우 취소
function unfollowHandler(userId) {
  var jwtToken = getTokenFromSessionStorage();
  var currentUserId = getCurrentUserIdFromSessionStorage();
  $.ajax({
    url: `http://43.202.152.189/user/${currentUserId}/following/${userId}`,
    type: "DELETE",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      // console.log("팔로우 취소: " + JSON.stringify(data));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("사용자가 존재하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

// ajax for 팔로우 요청
function followHandler(userId) {
  var jwtToken = getTokenFromSessionStorage();
  var currentUserId = getCurrentUserIdFromSessionStorage();
  $.ajax({
    url: `http://43.202.152.189/user/${currentUserId}/following/${userId}`,
    type: "POST",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      // console.log("팔로우 성공: " + JSON.stringify(data));
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else if (jqXHR.status === 404) {
        console.error("Not found:", jqXHR.responseText);
        alert("사용자가 존재하지 않습니다.");
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}
