"use strict";

function navAllStories(evt) {
  hidePageComponents();
  getAndShowStoriesOnStart();
}

$body.on("click", "#nav-all", navAllStories);

function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

function updateNavOnLogin() {
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorite.show();
  $navOwnStories.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(evt) {
  hidePageComponents();
  $newStoryForm.show();
}

$navSubmit.on("click", navSubmitClick);

function navFavoritesClick(evt) {
  hidePageComponents();
  putFavoritesOnPage();
}
$navFavorite.on("click", navFavoritesClick);

function navOwnStoriesClick(evt) {
  hidePageComponents();
  putOwnStoriesOnPage();
}
$navOwnStories.on("click", navOwnStoriesClick);
