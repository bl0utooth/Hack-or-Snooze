"use strict";

let storyList;

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const deleteButton = currentUser
    ? `<span class="delete-button"> <i class="far fa-trash-alt" data-story-id="${story.storyId}"></i> </span>`
    : "";

  return $(`
    <li id="${story.storyId}">
      ${deleteButton}
      ${currentUser ? verifyThumbUp(story) : ""}
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    </li>
  `);
}

$storiesList.on("click", ".delete-button", deleteStory);
function verifyTrash(story) {
  if (story.username === currentUser.username) {
    return `<span class="delete-button"> <i id='delete' class='far fa-trash-alt'> </i> </span>`;
  } else {
    return "";
  }
}

async function deleteStory(evt) {
  try {
    let $target = $(evt.target);
    let $storyId = $target.closest("i").data("story-id");
    let $story = storyList.stories.filter((story) => story.storyId === $storyId);

    await currentUser.removeFavorite(currentUser, $storyId, $story);
    await currentUser.removeStory(currentUser, $storyId, $story);

    updateUI("all-stories-list");
  } catch (error) {
    console.error("Error deleting story", error);
    // Handle the error as needed
  }
}

function updateUI(closestListId) {
  if (closestListId === "all-stories-list") {
    getAndShowStoriesOnStart();
  } else if (closestListId === "favorite-stories-list") {
    putFavoritesOnPage();
  } else if (closestListId === "own-stories-list") {
    putOwnStoriesOnPage();
  }
}

async function updateFavorite(evt) {
  let $target = $(evt.target);
  let $targetI = $target.closest("i");
  let $storyId = $target.closest("li").attr("id");
  let $story = storyList.stories.filter((story) => story.storyId === $storyId);
  let $closestListId = $target.closest("ol").attr("id");

  if ($target.hasClass("fas fa-thumbs-up")) {
    await currentUser.removeFavorite(currentUser, $storyId, $story);
    $targetI.toggleClass("fas far");
  } else {
    await currentUser.addFavorite(currentUser, $storyId, $story);
    $targetI.toggleClass("fas far");
  }

  updateUI($closestListId);
}

$storiesList.on("click", ".favoriteBtn", updateFavorite);

function verifyThumbUp(story) {
  let favoriteStatus = currentUser.favoriteCheck(story);
  if (favoriteStatus) {
    return `<span class="favoriteBtn"> <i id='favorite' class='fas fa-thumbs-up'> </i> </span>`;
  } else {
    return `<span class="favoriteBtn"> <i id='favorite' class='far fa-thumbs-up'> </i> </span> `;
  }
}

function putStoriesOnPage() {
  $allStoriesList.empty();

  for (let story of storyList.stories) {
    let $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putOwnStoriesOnPage() {
  $ownStoriesList.empty();

  for (let story of currentUser.ownStories) {
    let $story = generateStoryMarkup(story);
    $ownStoriesList.append($story);
  }

  $ownStoriesList.show();
}

function putFavoritesOnPage() {
  $favoriteStoriesList.empty();

  for (let story of currentUser.favorites) {
    let $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }

  $favoriteStoriesList.show();
}

async function addNewStory(evt) {
  evt.preventDefault();

  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();

  let storyData = { author, title, url };

  let newStory = await StoryList.addStory(currentUser, storyData);

  currentUser.addStory(newStory);

  $newStoryForm.trigger("reset");
  hidePageComponents();
  putOwnStoriesOnPage();
}

$newStoryForm.on("submit", addNewStory);
