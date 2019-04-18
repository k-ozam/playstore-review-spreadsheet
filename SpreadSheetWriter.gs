var sheet = SpreadsheetApp.getActive().getSheetByName('reviews'); // レビューを書き込みたいシートを指定
// シートの1行目をこれに一致させること
var COLUMN_NAMES = ["レビューID","投稿時刻","機種","OSのバージョン","アプリのバージョン","ユーザー名","評価","コメント","返信","Review Link"];
var FIRST_ROW_VALUES = sheet.getRange('1:1').getValues()[0];

function checkFirstRow() {
  for (var i = 0; i < COLUMN_NAMES.length; i++) {
    if (COLUMN_NAMES[i] !== FIRST_ROW_VALUES[i]) {
      throw new Error('COLUMN_NAMES is not correct');
    }
  }
}

function write(review) {
  var newRowValues = [];

  FIRST_ROW_VALUES.forEach(function(columnName) {
    var value = getWrittenValue(review, columnName);
    newRowValues.push(value);
  });

  sheet.appendRow(newRowValues)
}

function getWrittenValue(review, columnName) {
  switch (columnName) {
    case COLUMN_NAMES[0]: // レビューID
      return review.reviewId;
    case COLUMN_NAMES[1]: // 投稿時刻
      var unixTimeStamp = review.comments[0].userComment.lastModified.seconds;
      return getFormattedDate(unixTimeStamp);
    case COLUMN_NAMES[2]: // 機種
      return review.comments[0].userComment.deviceMetadata.productName;
    case COLUMN_NAMES[3]: // OSのバージョン
      var apiLevel = review.comments[0].userComment.androidOsVersion;
      return getVersionNumberString(apiLevel);
    case COLUMN_NAMES[4]: // アプリのバージョン
      return review.comments[0].userComment.appVersionName;
    case COLUMN_NAMES[5]: // ユーザー名
      return review.authorName;
    case COLUMN_NAMES[6]: // 評価
      return review.comments[0].userComment.starRating;
    case COLUMN_NAMES[7]: // コメント
      return review.comments[0].userComment.text;
    case COLUMN_NAMES[8]: // 返信
      if (review.comments.length >= 2) {
        // 前回の返信がある場合はそれを返す
        return review.comments[1].developerComment.text;
      } else {
        return "";
      }
    case COLUMN_NAMES[9]: // Review Link
      return getReviewUrl(review.reviewId);
    default:
      return "";
  }
}

function getLastReviewFormattedDate() {
  return sheet.getRange('B' + sheet.getDataRange().getLastRow()).getValue();
}
