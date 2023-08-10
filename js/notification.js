// $.getJSON("../mock/notificationData.json", function (data) {
//   $.each(data, function (index, item) {
// var itemElement = $("<a>").prop({
//   class: "item_element",
//   href: "#",
// });
// var imgElement = $("<img>").attr({
//   src: item.imageSrc,
//   alt: item.name,
//   class: "item_image",
// });
//     var elementWrap = $("<div>").prop({
//       class: "content_wrap",
//     });
//     var contentElement = $("<span>").prop({
//       class: "item_content",
//       textContent: item.docuement,
//     });

//     var createdElement = $("<span>").prop({
//       class: "item_created_at",
//       textContent: " " + item.created_at,
//     });

//     contentElement.append(createdElement);
//     elementWrap.append(contentElement);
//     itemElement.append(imgElement);
//     itemElement.append(elementWrap);
// $(".notification_main_section").append(itemElement);
//   });
// });

$(function () {
  var jwtToken = getTokenFromSessionStorage();
  initNotification(jwtToken);
});

function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

function initNotification(jwtToken) {
  $.ajax({
    url: "http://ec2-52-79-233-240.ap-northeast-2.compute.amazonaws.com/notification",
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
          href: "#",
        });
        var elementWrap = $("<div>").prop({
          class: "content_wrap",
        });
        if (item.type === "like") {
          var imgElement = $("<img>").attr({
            src: item.feed.image_urls[0],
            alt: item.feed.id,
            class: "item_image",
          });
          var contentElement = $("<span>").prop({
            class: "item_content",
            textContent: `${item.user.handle}이 게시물에 좋아요를 남겼습니다.`,
          });
        } else if (item.type === "follow") {
          var imgElement = $("<img>").attr({
            src: item.user.thumbnail,
            alt: item.user.name,
            class: "item_image",
          });
          var contentElement = $("<span>").prop({
            class: "item_content",
            textContent: `${item.user.handle}이 당신을 팔로우합니다.`,
          });
        } else if (item.type === "badge") {
          var imgElement = $("<img>").attr({
            src: item.user.thumbnail,
            alt: item.user.name,
            class: "item_image",
          });
          var contentElement = $("<span>").prop({
            class: "item_content",
            textContent: `${item.user.handle}이 당신에게 뱃지를 부여했습니다.`,
          });
        } else if (item.type === "tag") {
          var imgElement = $("<img>").attr({
            src: item.feed.image_urls[0],
            alt: item.feed.id,
            class: "item_image",
          });
          var contentElement = $("<span>").prop({
            class: "item_content",
            textContent: `${item.user.handle}이 게시물에 당신을 테그했습니다.`,
          });
        } else if (item.type === "comment") {
          var imgElement = $("<img>").attr({
            src: item.feed.image_urls[0],
            alt: item.feed.id,
            class: "item_image",
          });
          var contentElement = $("<span>").prop({
            class: "item_content",
            textContent: `${item.user.handle}이 게시물에 댓글을 남겼습니다.`,
          });
        } else {
          console.log("error");
        }
        var createdElement = $("<span>").prop({
          class: "item_created_at",
          textContent: " " + getTimeAgo(item.created_at),
        });
        contentElement.append(createdElement);
        elementWrap.append(contentElement);
        itemElement.append(imgElement);
        itemElement.append(elementWrap);
        $(".notification_main_section").append(itemElement);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status === 401) {
        console.error("Unauthorized:", jqXHR.responseText);
        alert("접근 권한이 없습니다.");
        window.location.href = "./login.html";
      } else {
        console.error("Error:", jqXHR.status, errorThrown);
        alert("서버 에러");
      }
    },
  });
}

function getTimeAgo(date) {
  var currentDate = new Date();
  var formattedDate = date.replace("T", " ").replace(/\.\d+$/, ""); // ISO 형식의 날짜를 "T"를 공백으로, 밀리초를 삭제하여 변환합니다.
  var dataDate = new Date(formattedDate); // 변환된 문자열을 날짜 객체로 변환합니다.

  // 날짜를 원하는 형식으로 포맷팅하여 문자열로 반환합니다.
  var options = { year: "numeric", month: "long", day: "numeric" };
  var formattedDateStr = dataDate.toLocaleDateString("ko-KR", options);

  // 현재 시간과 데이터 시간의 차이를 계산합니다.
  var timeDiff = currentDate - dataDate;
  var minutesDiff = Math.floor(timeDiff / (1000 * 60));

  // 시간 차이에 따라 다른 메시지를 반환합니다.
  if (minutesDiff < 60) {
    if (minutesDiff < 1) {
      return "방금 전";
    } else {
      return minutesDiff + "분 전";
    }
  } else if (minutesDiff < 1440) {
    // 24시간
    var hours = Math.ceil(minutesDiff / 60);
    return hours + "시간 전";
  } else if (isSameDate(currentDate, dataDate)) {
    return "오늘";
  } else if (isSameWeek(currentDate, dataDate)) {
    var daysDiff = Math.floor(minutesDiff / 1440);
    return daysDiff + "일 전";
  } else {
    return formattedDateStr; // 1주일 이상 차이나는 경우에는 변환된 형식으로 반환합니다.
  }
}

// 두 날짜가 같은 날짜인지 확인하는 함수
function isSameDate(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// 두 날짜가 같은 주에 속하는지 확인하는 함수
function isSameWeek(date1, date2) {
  var diff = Math.abs(date1 - date2);
  var daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  return daysDiff < 7 && date1.getDay() >= date2.getDay();
}
