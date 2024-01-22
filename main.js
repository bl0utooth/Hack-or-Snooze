"use strict";

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $storiesList = $(".stories-list");
const $favoriteStoriesList = $("#favorite-stories-list");
const $ownStoriesList = $("#own-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $newStoryForm = $("#new-story-form");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navSubmit = $("#nav-submit");
const $navFavorite = $("#nav-favorite");
const $navOwnStories = $("#nav-own-stories");

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $newStoryForm,
    $favoriteStoriesList,
    $ownStoriesList,
  ];
  components.forEach((c) => c.hide());
}

function navHideOnLogout() {
  const components = [
    $navUserProfile,
    $navLogOut,
    $navSubmit,
    $navFavorite,
    $navOwnStories,
  ];
  components.forEach((c) => c.hide());
}

async function start() {
  console.debug("start");
  $loginForm.hide();
  $signupForm.hide();
  $newStoryForm.hide();

  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  if (currentUser) updateUIOnUserLogin();
  if (!currentUser) navHideOnLogout();
}

console.warn(
  "HEY STUDENT: This program sends many debug messages to" +
    " the console. If you don't see the message 'start' below this, you're not" +
    " seeing those helpful debug messages. In your browser console, click on" +
    " menu 'Default Levels' and add Verbose"
);
$(start);
