# Sosial Media App

This project was created using Vite, And React

## Initialize project

Before running this application, `npm install` to install the necessary dependencies.

## Development server

To start a development server, run `npm run dev`. Then, open a web browser and navigate to http://localhost:5173/. The application will automatically reload if you make any changes to the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/`

## Tech Stack:

- [x] React (JavaScript library for building user interfaces)
- [x] Axios (JavaScript library for making HTTP requests)

## Libraries Used:

- [x] React (JavaScript library for building user interfaces)
- [x] Axios (JavaScript library for making HTTP requests)
- [x] SweetAlert: JavaScript library for displaying beautiful and customizable alert modals.
- [x] react-infinite-scroll-component: React library for implementing infinite scroll functionality.
- [x] Tailwind CSS: Utility-first CSS framework for styling the components with pre-built classes.

## Assumptions:

- [x] The API endpoint for fetching posts is https://dummyjson.com/posts.
- [x] The API endpoint for adding a new comment is https://dummyjson.com/comments/add.
- [x] The user object contains a valid id property.
- [x] The comments state is an array initially populated with existing comments.
- [x] The posts and comments state are updated using the setPosts and setComments functions, respectively.
- [x] The handleShowComments function takes the userId and postId as parameters to retrieve the corresponding comments.
- [x] The handleAddComment function toggles the visibility of the comment form.
- [x] The handleSubmitComment function submits the new comment to the server and updates the comments state.
- [x] The comments state is an array initially populated with existing comments.
- [x] The LoadingSpinner component is a reusable component that shows a loading spinner.
