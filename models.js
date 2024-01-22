"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  getHostName() {
    return "hostname.com";
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    const stories = response.data.stories.map((story) => new Story(story));

    return new StoryList(stories);
  }

  static async addStory(user, newStory) {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "POST",
      data: { token: user.loginToken, story: newStory },
    });
    return new Story(response.data.story);
  }
}

class User {
  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));

    this.loginToken = token;
  }

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  async addFavorite(user, storyId, story) {
    this.favorites.push(story[0]);

    await axios({
      url: `${BASE_URL}/users/${user.username}/favorites/${storyId}`,
      method: "POST",
      data: { token: user.loginToken },
    });
  }

  async removeFavorite(user, storyId, story) {
    this.favorites = this.favorites.filter(
      (s) => s.storyId !== story[0].storyId
    );

    await axios({
      url: `${BASE_URL}/users/${user.username}/favorites/${storyId}`,
      method: "DELETE",
      data: { token: user.loginToken },
    });
  }

  favoriteCheck(story) {
    return this.favorites.some((s) => s.storyId === story.storyId);
  }

  async removeStory(user, storyId, story) {
    try {
      // Filter out the story to be removed from the list of all stories
      storyList.stories = storyList.stories.filter((s) => s.storyId !== story[0].storyId);
  
      // Make the DELETE request to the server
      await axios({
        url: `${BASE_URL}/stories/${storyId}`,
        method: "DELETE",
        data: { token: user.loginToken },
      });
  
      // Remove the story from the user's favorites (if present)
      await currentUser.removeFavorite(currentUser, storyId, story);
  
      // Update the UI after successful deletion
      updateUI("all-stories-list");
    } catch (error) {
      console.error("Error deleting story", error);
      // Handle the error as needed
    }
  }
  
  addStory(story) {
    this.ownStories.push(story);
  }
}

