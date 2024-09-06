# The MovieVerse - Style Guide

## Introduction

This style guide outlines the coding conventions for the MovieVerse project. It's aimed to promote code readability and consistency across the project. All contributors are encouraged to follow this guide.

## JavaScript Style

- **Indentation**: Use 2 spaces for indentation.
- **Semicolons**: Always use semicolons at the end of a statement.
- **Quotes**: Prefer single quotes (`'`) for strings unless you are using template literals.
- **Variable Declarations**: Use `let` and `const` for variable declarations. Avoid `var`.
- **Arrow Functions**: Prefer arrow functions (`() => {}`) over traditional function expressions where appropriate.
- **Object and Array Literals**: Use object shorthand and array spread syntax.
- **Object Destructuring**: Use object destructuring where appropriate.

## React Component Style

- **Component Naming**: Use PascalCase for React component names.
- **Functional Components**: Use functional components with hooks.
- **File Naming**: File names should be the same as the component name (e.g., `MovieList.js`).
- **JSX Syntax**: Use self-closing tags if the element has no children.

## CSS/SASS Style

- **Naming Convention**: Use BEM (Block Element Modifier) naming convention.
- **Formatting**: Use a consistent formatting style, such as keeping properties in alphabetical order.
- **Units**: Prefer relative units (`em`, `rem`, `%`) over absolute units (`px`).

## File Structure

- **Organization**: Organize files into folders based on feature or functionality.
- **Separation of Concerns**: Keep your styles, components, and tests in separate files.
- **Naming Convention**: Use PascalCase for file names.
- **Imports**: Use absolute imports for files within the `src` folder.
- **Index Files**: Use index files to export multiple files from a folder.

## Code Quality

- **Linting**: Use ESLint to enforce code quality.
- **Formatting**: Use Prettier to format code.
- **Readability**: Write code that is easy to read and understand.
- **Comments**: Write meaningful comments where necessary, especially for complex logic.
- **Testing**: Aim for high test coverage and write meaningful test cases.

## Version Control

- **Branch Naming**: Use descriptive branch names (e.g., `feature/add-movie-search`).
- **Commits**: Write clear, concise commit messages. Include the context and purpose of the change.
- **Pull Requests**: Use pull requests for merging code into the main branch. Ensure PRs are reviewed before merging.
- **Merging**: Use the "Squash and Merge" option when merging pull requests.
- **Rebasing**: Use `git rebase` to keep your branch up to date with the main branch.
- **Commit History**: Keep your commit history clean and organized. Avoid unnecessary merge commits.

## Accessibility

- **Semantic HTML**: Use HTML elements according to their intended purpose.
- **ARIA Attributes**: Use ARIA attributes where necessary to enhance accessibility.
- **Color Contrast**: Ensure there is sufficient color contrast between text and background colors.
- **Keyboard Navigation**: Ensure all interactive elements are accessible via keyboard navigation.
- **Screen Readers**: Ensure all content is accessible to screen readers.
- **Focus**: Ensure focus is visible and consistent across the site.
- **Animations**: Ensure animations are not distracting and can be disabled.

## Performance

- **Optimization**: Prioritize performance optimizations, such as minimizing bundle size and reducing render times.

---
