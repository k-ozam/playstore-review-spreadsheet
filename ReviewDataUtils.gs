var ACCOUNT_ID = "0000000000000000000"; // Play Console のURLのクエリパラメータのaccountの値

function getVersionNumberString(apiLevel) {
  switch (apiLevel) {
    case 15:
      return "4.0.3";
    case 16:
      return "4.1";
    case 17:
      return "4.2";
    case 18:
      return "4.3";
    case 19:
      return "4.4";
    case 20:
      return "4.4W";
    case 21:
      return "5.0";
    case 22:
      return "5.1";
    case 23:
      return "6.0";
    case 24:
      return "7.0";
    case 25:
      return "7.1";
    case 26:
      return "8.0";
    case 27:
      return "8.1";
    case 28:
      return "9.0";
    default:
      return "API " + apiLevel;
  }
}

function getReviewUrl(reviewId) {
  return "https://play.google.com/apps/publish?account=" + ACCOUNT_ID + "#ReviewDetailsPlace:p=" + APP_ID + "&reviewid=" + reviewId;
}

function getFormattedDate(unixTimeStamp) {
  return Moment.moment.unix(unixTimeStamp).format("YYYY/MM/DD HH:mm:ss");
}
