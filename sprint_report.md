# Sprint x Report 
Video Link: [`Link to our video demo`](https://www.youtube.com/watch?v=YeU3pNqOFuk)

## What's New (User Facing)
 * View Dining Hall Menu: Users can now see a dining hall menu with a clear layout and navigation links.
 * Searchable Food Items List: Users can view a complete list of available food items with basic filtering by food category.
 * Add Menu Items: Admins and Staff can now add food items to the menu.

## Work Summary (Developer Facing)
This sprint our team successfully set up our tech stack and delivered three key user-facing features: the dining hall menu layout, the ability to view specific food items by category, and allow Admin and Staff users to add food items to the menu. We built the basic UI components using React, integrated them with Django API endpoints for data fetching, and ensured that the layout is clear and intuitive. Throughout the sprint, we encountered challenges with our Docker setup and container configurations, especially differences between operating systems, which temporarily stalled work on some admin and staff functionalities. These challenges provided valuable insights into our deployment process and highlighted areas for improvement in our container management.

## Unfinished Work
Due to issues with Docker and container setups across different OS environments, progress on the following features was stalled:
* [`Admin Price Update (#6)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406590&issue=ivnkwok%7CCPTS-451-Project%7C6): We began work on the secure API endpoint and React component for updating menu item prices, but container configuration issues halted further integration.
* [`Item Deletion by Staff (#2)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102405083&issue=ivnkwok%7CCPTS-451-Project%7C2): Initial work on the secure deletion mechanism was started; however, cross-OS container problems prevented a full implementation.
* [`Editing Nutritional Information (#4)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406548&issue=ivnkwok%7CCPTS-451-Project%7C4): Although we set up part of the editable form and API endpoint, unresolved Docker issues left this feature incomplete.
* Additionally, the user story to [`display detailed nutritional information (#5)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406574&issue=ivnkwok%7CCPTS-451-Project%7C5) was not picked up this sprint.

## Completed Issues/User Stories
Here are links to the issues that we completed in this sprint:

 * [`As a user, I want to be able to view the menu (#3)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406535&issue=ivnkwok%7CCPTS-451-Project%7C3)
 * [`As a dining hall staff member, I want to be able to add items to a menu (#1)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102404840&issue=ivnkwok%7CCPTS-451-Project%7C1)
 * [`As a user, I want to be able to view available food items (#11)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103234637&issue=ivnkwok%7CCPTS-451-Project%7C11)
 
 ## Incomplete Issues/User Stories
 Here are links to issues we worked on but did not complete in this sprint:
 
 * [`As an admin, I want to be able to set the price of menu items (#6)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406590&issue=ivnkwok%7CCPTS-451-Project%7C6) <<Progress was halted due to Docker/container setup issues impacting API integration.>>
 * [`As a dining hall staff member, I want to be able to delete items from the menu (#2)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102405083&issue=ivnkwok%7CCPTS-451-Project%7C2) <<Container configuration and cross-OS differences prevented us from finalizing the deletion functionality.>>
 * [`As a dining hall staff member, I want to be able to edit the nutritional information of an item (#4)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406548&issue=ivnkwok%7CCPTS-451-Project%7C4) <<Incomplete due to technical setup complications with our containers.>>
 * [`As a user, I want to be able to view the nutritional information of an item (#5)`](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406574&issue=ivnkwok%7CCPTS-451-Project%7C5) <<This issue was not picked up in the current sprint.>>

## Code Files for Review
Please review the following code files, which were actively developed during this sprint, for quality:
 * [Menu.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/pages/menu/Menu.tsx)
 * [AddMenuItem.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/components/menu/AddMenuItem.tsx)
 * [models.py](https://github.com/ivnkwok/CPTS-451-Project/blob/main/server/menu/models.py)
 * [views.py](https://github.com/ivnkwok/CPTS-451-Project/blob/main/server/menu/views.py)
 
## Retrospective Summary
Here's what went well:
 * Successfully setting up our tech stack and container environment.
 * Completing key user-facing features, enabling users to view the dining hall menu and available food items.
 * Effective collaboration and agile workflow, ensuring rapid progress on design and API integration.

Here's what we'd like to improve:
 * Enhance our Docker and container configurations to prevent cross-OS issues.
 * Increase early testing and integration efforts to identify deployment challenges sooner.
 * Improve communication during technical hurdles to better allocate resources and resolve issues quickly.

Here are changes we plan to implement in the next sprint:
 * Resolve Docker/container issues and improve environment consistency across OSs.
 * Complete the unfinished admin and staff functionalities (price update, deletion, and editing nutritional information).
 * Begin work on displaying detailed nutritional information for menu items, ensuring a smoother user experience.