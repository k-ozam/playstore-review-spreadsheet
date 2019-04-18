function main() {
  checkFirstRow();

  var reviews = getReviews();

  // 新しい順になっているので、古い順にする
  reviews.reverse().forEach(function(review) {
    write(review)
  });
}
