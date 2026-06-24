# Description 
- This projects aims to cover the caretaking and treatment of stray animals without necessarily adopting them and keeping them in their familiar place. 
- It is for animal advocates that want to care for stray animals but are unable to adopt them and provide continous caretaking due to distance or other reasons. 
- Community can keep track of stray animals wellbeing through status updates leveraging comfort and ease in caretaking 

# Scope
1. Must-have: 
- map where animals can be localized
- status info about the stray: presence of food, water, injuries, adopted? (then delete), secure shelter/environment (oil source, sharp material?), Last seen time
2. Nice-to-have:
- login requirement
- different roles: visitor (read), verified advocate (read/write/confirm status updates), trusted volunteer(confirm updates/read/write), admin (delete/read/write/manage/verify users)
- different type of updates: low risk, high risk (require photo evidence, approval by admin/volunteer, multiple independent confirmations)
- keep update history
- rate limits
- Account reputation score
- Temporary bans for repeated false reports
- Report button for suspicious updates
- Email verification
- Exact location visible only to trusted users.
- flag system for suspicious updates.
- multilingual
3. Out-of-scope:
- user interaction via chatbot or similar (app should be lightweight)

# Specification
1. Functional
- as a visitor i want to see the animal posts with status information on a map. User should see all posted animals as dots on the map and on clicking it should get all the status info on a separate modal
- as a visitor i want to sign up or sign in as a verified advocate and post/update information on animals. A login/sign up mask with basic email and password authentication and a profile page with name, public email and a verified advocate bage.
- as a verified advocate i want to post a new animal with following informations: location, presence of food, water, injuries, adopted? (then delete), secure shelter/environment (oil source, sharp material?), Last seen time. A button to create a new finding -> modal with input fields pop, new animal can be saved and pops in the map
- as a verified advocate i want  to update information on an animal. Animal should be clickable on the map and update button should be visible -> update modal pops up
- as a verified advocate i want to issue animals for deletion, which requires confirmation by admin. Delete request sends a email to admin -> admin can approve or dismis in email right away
2. Non-Functional
- As a user i want to swipe effortlessly over the map to get the best user experience. There should be no interruptions while swiping through the map. 
- As a developer i want the email confirmation to be secure. 
- As a developer i want the login and sign up process to be secure.
- As a developer i want the ui to include the diverse patterns of stray animals and look entertaining. Buttons and modals should include animalistic prints
- as a developer i want the application to be fast and real time. 
3. Constraints
- frontend: Next.js + React + TypeScript
- Map: MapLibre GL or Leaflet
- backend: Supabase
- Auth: Supabase Auth
- Realtime: Supabase Realtime
- Storage: Supabase Storage
- deployment platform: Vercel + Supabase
- dbms: PostgreSQL + PostGIS
- styling: Tailwind CSS
- Email: Resend or SendGrid

# MVP
- User can create animal sightings and they can be viewed in the map

# Sprints
- 1. 24.06 - 01.07
- create db-model and integrate to supabase
- collect inspo for design choices
- Create a design in figma
- init repo and create project boilerplate
2. 02.07 - 08.07
- implement frontend
3. 08.07 - 15.07
- implement backend
4. 15.07 - 22.07 
- test and deploy 
- draft an UML-diagramm and create an architecture sketch



