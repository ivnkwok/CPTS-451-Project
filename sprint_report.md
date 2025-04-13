# Sprint x Report 
Video Link: [`Link to our video demo`]()

## What's New (User Facing)
 * View Nutritional Info: Users can now view the nutrition associated with each menu item.
 * View User Balance: Students can view their remaining balance amount.
 * Increase User Balance: Students can increase their balance amount.
 * Student Budget Filter: Students can now filter through menu items based on price range.
 * Student Dietary Restriction Filter: Students can now filter through menu items based on dietary restrictions.

## Work Summary (Developer Facing)
During Sprint 2, our team focused on enhancing user experience by implementing several key features including nutritional info display, budget tracking, balance top-ups, and menu filtering based on budget and dietary preferences. We completed five major user stories, integrating these features smoothly with the existing system using tools like React, Django, and PostgreSQL. However, Firebase authentication posed significant implementation challenges, leading to a team decision to switch to Django authentication. Communication remained strong, but time management and sprint workload distribution were areas of concern. To address this, we committed to dedicating more time per member per sprint and introduced bi-weekly check-ins to better align team efforts and meet project goals in the final sprint.

## Unfinished Work
Due to issues with integrating firebase into the application, progress on the following features was stalled:
 * [`As a dining hall staff member, I want to see the balance of a student I’m serving... (#17)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322226&issue=ivnkwok%7CCPTS-451-Project%7C17)
 * [`As a dining hall staff member, I want to refuse the service... (#18)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322283&issue=ivnkwok%7CCPTS-451-Project%7C18)
 * [`As a user, I want to have access to functions specified for my role... (#19)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322360&issue=ivnkwok%7CCPTS-451-Project%7C19)
 * [`As an admin, I want to be able to view detailed reports... (#21)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322923&issue=ivnkwok%7CCPTS-451-Project%7C21)
 * [`As a student, I want to be able to opt into notifications... (#22)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103323029&issue=ivnkwok%7CCPTS-451-Project%7C22)

Additionally, the following user stories were not picked up this sprint:
 * [`As a student, I want my nutritional values to change as my item is customized... (#14)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103319119&issue=ivnkwok%7CCPTS-451-Project%7C14)
 * [`As an admin, I want to be able to delete user accounts... (#20)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322590&issue=ivnkwok%7CCPTS-451-Project%7C20)

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:

 * [`As a student, I want to be able to view the nutritional information of an item on the menu... (#5)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406574&issue=ivnkwok%7CCPTS-451-Project%7C5)
 * [`As a student, I want to see my balance so I do not exceed my budget. (#15)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103319855&issue=ivnkwok%7CCPTS-451-Project%7C15)
 * [`As a student, I want to top up my balance so that I can continue to use the service worry-free. (#16)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103320359&issue=ivnkwok%7CCPTS-451-Project%7C16)
 * [`As a student, I want to be able to click a button that allows me to filter menu items based on budget. (#23)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103323114&issue=ivnkwok%7CCPTS-451-Project%7C23)
 * [`As a student, I want to be able to click a button that allows me to filter menu items based on dietary restrictions... (#24)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103323884&issue=ivnkwok%7CCPTS-451-Project%7C24)
 
 ## Incomplete Issues/User Stories
 The following issues were picked up and worked on however, firebase integration proved to be too difficult with the alloted time, causing the following features development to be stalled: 
 * [`As a dining hall staff member, I want to see the balance of a student I’m serving... (#17)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322226&issue=ivnkwok%7CCPTS-451-Project%7C17)
 * [`As a dining hall staff member, I want to refuse the service... (#18)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322283&issue=ivnkwok%7CCPTS-451-Project%7C18)
 * [`As a user, I want to have access to functions specified for my role... (#19)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322360&issue=ivnkwok%7CCPTS-451-Project%7C19)
 * [`As an admin, I want to be able to view detailed reports... (#21)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322923&issue=ivnkwok%7CCPTS-451-Project%7C21)
 * [`As a student, I want to be able to opt into notifications... (#22)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103323029&issue=ivnkwok%7CCPTS-451-Project%7C22)

Additionally, the following user stories were not picked up this sprint:
 * [`As a student, I want my nutritional values to change as my item is customized... (#14)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103319119&issue=ivnkwok%7CCPTS-451-Project%7C14)
 * [`As an admin, I want to be able to delete user accounts... (#20)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322590&issue=ivnkwok%7CCPTS-451-Project%7C20)

## Code Files for Review
Please review the following code files, which were actively developed during this sprint, for quality:
 * [Menu.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/pages/menu/Menu.tsx)
 * [AddMenuItem.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/components/menu/AddMenuItem.tsx)
 * [MenuItemCard.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/components/menu/MenuItemCard.tsx)
 * [BalanceDisplay.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/components/balance/BalanceDisplay.tsx)
 * [TopUpForm.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/components/balance/TopUpForm.tsx)

## Retrospective Summary
Here's what went well:
 * Communication - The team did a good job communicating with each other and keeping everyone informed about potential problems and issues encountered during the coding process.
 * Feature Implementation - The features that were completed worked seamlessly with each other and met all requirements for their use-case scenarios.

Here's what we'd like to improve:
 * Time Management - Unfortunately due to the timing of this sprint and the time constraints of work with other classes. The group had more difficulty than anticipated completing features.
 * Feature Implementation - The quantity of features implemented per sprint could use improvement.
 * Authentication - One of the major issues facing the team is integration of backend authentication with their assigned features. Firebase has proven to be more difficult to work with than anticipated.

Here are changes we plan to implement in the next sprint:
 * The team recognized the need to dedicate more time per member to each sprint to improve feature completion, addressing issues in time management, feature quantity, and backend authentication integration.
 * A switch from Firebase to Django for authentication was agreed upon, as Django was found to be easier to implement given the project's time constraints.
 * A bi-weekly team recap was established to track progress, identify roadblocks, and ensure individual contributions align toward a cohesive final product.