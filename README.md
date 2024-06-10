# GitHub Repository Search Application

## Overview

This application allows users to search for GitHub repositories by entering a GitHub username or organization. The application displays the repositories in a tabular format with pagination, sorting, and filtering capabilities.

## Features

- Search for repositories by GitHub username or organization.
- Display repositories in a tabular format.
- Pagination, sorting, and filtering of repositories.
- Clean and organized code with modern React and TypeScript.
- Automated tests to ensure reliability.

## Technical Choices

- **React**: For building the user interface.
- **TypeScript**: For type safety and better development experience.
- **Jest** and **Testing Library**: For unit and integration testing to ensure the application works as expected.

## 3rd Party Libraries

- **@octokit/rest**: A GitHub API client for JavaScript that simplifies the process of making requests to GitHub.
- **Jest** and **Testing Library**: Used for unit and integration testing to ensure the application works as expected.

## Running the Application

### Prerequisites

- Node.js (v20 or above)
- npm or yarn
- GitHub Personal Access Token for unlimited API calls

### Setting Up the GitHub Token

To avoid rate limiting issues with the GitHub API, you can use a personal access token. Follow these steps:

1. Generate a GitHub Personal Access Token by following [this guide](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).
2. Create a `.env` file in the root of your project directory.
3. Add the following line to the `.env` file, replacing `REACT_APP_GITHUB_TOKEN` with the token you generated:

### New Feature

Repository Details Page:

Description: Create a detailed view for each repository that includes additional information such as owner, contributors etc.
Benefit: Provides a more comprehensive overview of each repository, making it easier for users to find relevant information.