# Sprint 3 Report  
Video Link: [Link to our video demo](https://youtu.be/IapbpoGkopo)

## What’s New (User Facing)
- **Feedback Management**: Dining hall staff can view student feedback and send replies to confirm receipt.
- **Menu Item Removal**: Staff can delete obsolete or unpopular menu items.
- **Feedback Submission**: Students can leave feedback to help the dining hall improve.
- **Role‑Based Access**: All users now see only the features appropriate to their role.
- **Meal Change Requests**: Students can request modifications to their orders (e.g., substitutions or dietary adjustments).
- **Account Deletion**: Administrators can remove student accounts when they leave campus.
- **Sales Dashboard**: Staff can view aggregate sales statistics to optimize menu offerings.
- **Balance Lookup**: Dining hall staff can check a student’s current balance before serving.
- **Detailed Reporting**: Admins can generate reports on meal‑plan usage and item popularity.
- **Nutrition Editing**: Staff can update the nutritional information for each menu item.

## Work Summary (Developer Facing)
In Sprint 3, we delivered both student and staff‑facing features across our project. We built:

- **Feedback workflow** (view/reply) end‑to‑end, including frontend forms, and API endpoints.  
- **Menu CRUD enhancements**, adding deletion capabilities for staff.  
- **Role‑aware routing** and guards so each user sees only their allowed screens.  
- **Order customization requests**, with backend support to queue and track change requests.  
- **Admin utilities** for bulk account deletion and detailed analytics dashboards.  
- **Balance and statistics views** for staff, integrating existing balance service.  
- **Nutrition editor**, complete with inline editing on the menu‑management page.

We held daily standups and leveraged bi‑weekly checkpoints to stay aligned. Aside from minor scheduling hiccups around finals week, there were no major technical blockers. Our switch to Django authentication proved to be the right choice.

## Unfinished Work
The following user stories were picked up but not completed this sprint:
- [#39](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=108096070&issue=ivnkwok%7CCPTS-451-Project%7C39) As a staff member, I want to update inventory levels so that I can track ingredient availability.  
- [#40](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=108096082&issue=ivnkwok%7CCPTS-451-Project%7C40) As an admin, I want to view inventory levels so that I know when to restock ingredients.  
- [#14](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103319119&issue=ivnkwok%7CCPTS-451-Project%7C14) As a student, I want my nutritional values to change as my item is customized so that my nutritional information is accurate.

## Completed Issues/User Stories
- [#36](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=108096042&issue=ivnkwok%7CCPTS-451-Project%7C36) Staff: view and reply to user feedback.  
- [#2](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102405083&issue=ivnkwok%7CCPTS-451-Project%7C2) Staff: delete menu items.  
- [#35](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=108096029&issue=ivnkwok%7CCPTS-451-Project%7C35) Student: submit feedback.  
- [#19](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322360&issue=ivnkwok%7CCPTS-451-Project%7C19) Role‑based feature access.  
- [#38](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=108096063&issue=ivnkwok%7CCPTS-451-Project%7C38) Student: request meal changes.  
- [#20](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322590&issue=ivnkwok%7CCPTS-451-Project%7C20) Admin: delete user accounts.  
- [#37](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=108096053&issue=ivnkwok%7CCPTS-451-Project%7C37) Staff: view sales statistics.  
- [#17](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322226&issue=ivnkwok%7CCPTS-451-Project%7C17) Staff: check student balance.  
- [#21](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=103322923&issue=ivnkwok%7CCPTS-451-Project%7C21) Admin: generate detailed reports.  
- [#4](https://github.com/users/ivnkwok/projects/1/views/1?pane=issue&itemId=102406548&issue=ivnkwok%7CCPTS-451-Project%7C4) Staff: edit nutritional info on menu items.

## Code Files for Review
Please review the following code files, which were actively developed during this sprint, for quality:
- [Menu.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/pages/menu/Menu.tsx)
- [Feedback.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/pages/feedback/Feedback.tsx)
- [AuthContext.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/context/AuthContext.tsx)
- [DeleteMenuItem.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/components/menu/DeleteMenuItem.tsx)
- [stats/index.tsx](https://github.com/ivnkwok/CPTS-451-Project/blob/main/client/src/routes/stats/index.tsx)

## Retrospective Summary
**What Went Well**  
- Smooth integration of new UI components with existing pages.  
- Clear API contracts between frontend and backend teams.  
- Successful deployment of analytics dashboard.

**What to Improve**  
- Communication.  
- Sprint planning could better account for academic schedules.
