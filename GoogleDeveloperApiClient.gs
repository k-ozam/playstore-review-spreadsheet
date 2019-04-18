var APP_ID = "com.example.sampleapp";
var PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nXXXXXXX\n-----END PRIVATE KEY-----\n";
var EMAIL = "play-store-service-account@xxx.iam.gserviceaccount.com";

// 一回のAPI呼び出しで取得するレビュー件数
var REVIEWS_COUNT_PER_API_CALL = 10;

function getReviews() {
  // スプレッドシート上の最新レビューの時刻
  var lastReviewFormattedDateOnSpreadsheet = getLastReviewFormattedDate();

  var json = callApi(null);

  var reviews = getNewReviews(json.reviews, lastReviewFormattedDateOnSpreadsheet);

  // tokenPaginationがある(=次のページがある)場合は、それをつかって再度APIを呼び出す
  while (json.tokenPagination != undefined) {
    var nextPageToken = json.tokenPagination.nextPageToken;

    json = callApi(nextPageToken);

    if (json.reviews == undefined) {
      // APIの呼び出し回数制限などで取得できなかった場合
      break;
    }

    var newReviews = getNewReviews(json.reviews, lastReviewFormattedDateOnSpreadsheet);

    if (newReviews.length == 0) {
      break;
    }

    reviews = reviews.concat(newReviews);
  }

  return reviews;
}

function getNewReviews(reviews, lastReviewFormattedDateOnSpreadsheet) {
  var newReviews = [];

  for (var i = 0; i < reviews.length; i++) {
    if (!hasComment(reviews[i])) {
      continue;
    }

    if (!isNewReview(reviews[i], lastReviewFormattedDateOnSpreadsheet)) {
      break;
    }

    newReviews.push(reviews[i]);
  }

  return newReviews;
}

function isNewReview(review, lastReviewFormattedDateOnSpreadsheet) {
  var reviewUnixTimeStamp = review.comments[0].userComment.lastModified.seconds;
  var reviewFormattedDate = getFormattedDate(reviewUnixTimeStamp);

  return Moment.moment(reviewFormattedDate).isAfter(lastReviewFormattedDateOnSpreadsheet);
}

function hasComment(review) {
  return review.comments[0].userComment.text != undefined;
}

function callApi(nextPageToken) {
  var serverToken = new GSApp.init(PRIVATE_KEY, ["https://www.googleapis.com/auth/androidpublisher"], EMAIL);
  var token = serverToken.addUser(EMAIL).requestToken().getTokens()[EMAIL].token;
  var fetchOptions = {method:"GET",muteHttpExceptions:true, contentType:"application/json", headers:{Authorization:"Bearer " + token}};
  var url = "https://www.googleapis.com/androidpublisher/v2/applications/" + APP_ID
  + "/reviews?access_token=" + token
  + "&maxResults=" + REVIEWS_COUNT_PER_API_CALL;
  if (nextPageToken != null) {
    url += "&token=" + nextPageToken;
  }

  var response = UrlFetchApp.fetch(url, fetchOptions);

  return JSON.parse(response.getContentText());
}
