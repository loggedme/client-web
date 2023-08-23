//페이지 로딩 시 각 카테고리에 맡게 하단바의 이미지를 변경
$(document).ready(function () {
  $("#bottom_nav_search_image").attr(
    "src",
    "../image/bottom_nav_search_black.png"
  );
});

function getTokenFromSessionStorage() {
  return sessionStorage.getItem("jwtToken");
}

$(document).ready(function () {
  var searchInput = $("#search_input");
  var goBack = $("#goBack");
  var searchPerson = $("#searchPerson");
  var searchCompany = $("#searchCompany");
  var searchHashtag = $("#searchHashtag");
  var underline = $(".searchPage_nav_underline");
  var currentSearchTerm = ""; // 현재 검색어

  // 검색 개인,회사,해쉬태그, 해쉬태그 검색 목록 페이지 숨기기
  $(
    ".searchInner_nav, .person_container, .company_container, .hashtag_container, .grid_container_hashtag"
  ).hide("fast");

  // 디바운스 oninput 이벤트

  searchInput.on(
    "input",
    debounce(function () {
      var searchTerm = searchInput.val().toLowerCase();

      $(".person_search_list .person_item").each(function () {
        var personName = $(this).text().toLowerCase();
        if(personName.includes(searchTerm)){
          $(this).show();
        } else {
          $(this).hide();
        }
      });
  
      $(".company_search_list .company_item").each(function () {
        var companyName = $(this).text().toLowerCase();
        if (companyName.includes(searchTerm)){
          $(this).show();
        } else {
          $(this).hide();
        }
      });
  
      $(".hashtag_search_list .hashtag_item ").each(function () {
        var hashtagName = $(this).find(".hashtag_name").text().toLowerCase();
        if (hashtagName.includes(searchTerm)) {
          $(this).show();
          $(this).find(".posting_num").show();
        } else {
          $(this).hide();
          $(this).find(".posting_num").hide();
        }
      })
      

      currentSearchTerm = searchTerm;
      console.log(currentSearchTerm);

      var jwtToken = getTokenFromSessionStorage();

      // 먼저 기존 목록을 비워줌
      $(".person_search_list").empty();
      $(".company_search_list").empty();
      $(".hashtag_search_list").empty();

      $.ajax({
        url: `http://43.202.152.189/search?query=${currentSearchTerm}`,
        type: "GET",
        dataType: "json",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        success: function (data) {
          //console.log("sueccess: " + JSON.stringify(data));

          // 개인, 기업 검색
          $.each(data.user.items, function (index, item) {
            var imgSrc =
              item.thumbnail ||
              "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/680px-Default_pfp.svg.png?20220226140232";

            var accountType = item.account_type;
            if (accountType == 1) {
              var personItem = $("<a>")
                .prop({
                  class: "person_item",
                })
                .on("click", function () {
                  window.location.href = `./profile_per.html?userId=${item.id}`;
                });
              var imgElement = $("<img>").attr({
                src: imgSrc,
                //alt: item.name,
              });
              var personInfo = $("<div>").addClass("person_info");
              var personName = $("<div>")
                .addClass("person_name")
                .text(item.handle);
              var personHashtag = $("<div>")
                .addClass("person_hashtag")
                .text(item.name);

              personItem.append(imgElement);
              personInfo.append(personName, personHashtag);
              personItem.append(personInfo);

              $(".person_search_list").append(personItem);
            } else {
              var companyItem = $("<a>")
                .prop({
                  class: "company_item",
                })
                .on("click", function () {
                  window.location.href = `./profile_ent.html?userId=${item.id}`;
                });
              var imgElement = $("<img>").attr({
                src: imgSrc,
                //alt: item.name,
              });
              var companyInfo = $("<div>").addClass("company_info");
              var companyName = $("<div>")
                .addClass("company_name")
                .text(item.handle);
              var companyHashtag = $("<div>")
                .addClass("company_hashtag")
                .text(item.name);

              // 생성한 요소들을 조립하여 companyItem에 추가
              companyItem.append(imgElement);
              companyInfo.append(companyName, companyHashtag);
              companyItem.append(companyInfo);

              // 회사 목록을 .company_search_list에 추가
              $(".company_search_list").append(companyItem);
            }
          });

          // 해쉬태그 검색
          $.each(data.hashtag.items, function (index, item) {
            var hashtagItem = $("<a>").prop({
              class: "hashtag_item",
            })
            .on("click", function () {
              hashtagSearchDetail(item.name);
            });
            var imgElement = $("<img>").attr({
              src: "../image/hashtag.png",
              //alt: item.name,
            });
            var hashtagInfo = $("<div>").addClass("hashtag_info");
            var hashtagName = $("<div>")
              .addClass("hashtag_name")
              .text(`#${item.name}`);
            var postingNum = $("<div>")
              .addClass("posting_num")
              .text(`게시물 ${item.feed.count}개`);

            hashtagItem.append(imgElement);
            hashtagInfo.append(hashtagName, postingNum);
            hashtagItem.append(hashtagInfo);

            $(".hashtag_search_list").append(hashtagItem);
          });
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.error("Error:", jqXHR.status, errorThrown);
        },
      });
    }, 1000)
  );

  searchInput.on("input", function () {
    // 탐색 메인 페이지 숨기기
    $(
      ".grid_container_forYou, .searchMain_nav, .grid_container_person, .grid_container_company, .grid_container_hashtag"
    ).hide("fast");
    // 검색어 없으면 탐색 메인페이지 보이기
    if (searchInput.val() === "") {
      $(".searchMain_nav, .grid_container_forYou").fadeIn("fast");
      $(
        ".searchInner_nav, .person_container, .company_container, .hashtag_container"
      ).hide("fast");
    } else {
      // 초기 검색 개인 페이지 보이기
      $(".searchInner_nav").fadeIn("fast");
      $(".person_container").fadeIn("fast");

      underline.css("transform", "translateX(-110%)");
      searchPerson.addClass("selected");
      searchCompany.removeClass("selected");
      searchHashtag.removeClass("selected");
    }
  });

  // Person 클릭시 개인 검색만 보기
  searchPerson.on("click", function () {
    $(".person_container").fadeIn("fast");
    $(".company_container, .hashtag_container, .grid_container_hashtag").hide("fast");
    underline.css("transform", "translateX(-110%)");
    searchPerson.addClass("selected");
    searchCompany.removeClass("selected");
    searchHashtag.removeClass("selected");
  });
  // Company 클릭시 회사 검색만 보기
  searchCompany.on("click", function () {
    $(".company_container").fadeIn("fast");
    $(".hashtag_container, .person_container").hide("fast");
    underline.css("transform", "translateX(0%)");
    searchCompany.addClass("selected");
    searchHashtag.removeClass("selected");
    searchPerson.removeClass("selected");
  });
  // hashtag 클릭시 해시태그 검색만 보기
  searchHashtag.on("click", function () {
    $(".hashtag_container").fadeIn("fast");
    $(".person_container, .company_container").hide("fast");
    underline.css("transform", "translateX(110%)");
    searchHashtag.addClass("selected");
    searchCompany.removeClass("selected");
    searchPerson.removeClass("selected");
  });

  goBack.on("click", function () {
    // 뒤로가기 버튼 클릭시 검색 페이지 숨기기
    $(
      ".searchInner_nav, .person_container, .company_container, .hashtag_container"
    ).hide();

    // 탐색 메인 페이지 보이기
    $(".searchMain_nav, .grid_container_forYou").fadeIn();
    searchInput.val("");

    window.history.back();
  });
});

// 디바운스 함수
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

function hashtagSearchDetail(hashtagName) {
  var jwtToken = getTokenFromSessionStorage();
  $.ajax({
    url: `http://43.202.152.189/feed?hashtag=${hashtagName}`,  //입력한 값이 아니라 그 입력한 값의 전체
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
    success: function (data) {
      console.log("sueccess: " + JSON.stringify(data));

      $.each(data.items, function (index, item) {
        var hashtagImgItem = $("<a>")
          .addClass("img_item")
          .on("click", function () {
            window.location.href = `./single_feed.html?feedId=${item.id}`;
          });
        var hashtagImgElement = $("<img>").attr({
          src: item.image_urls,
          // alt: item.image_urls,
          width: "13rem",
          height: "13rem",
        });

        hashtagImgItem.append(hashtagImgElement);
        $(".grid_container_hashtag").append(hashtagImgItem);

        $(".grid_container_hashtag").show();
        $(".searchInner_nav").hide();
        $(".hashtag_container").hide();
      });

    }
  });
}