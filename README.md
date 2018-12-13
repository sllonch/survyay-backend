# Survyay
## Description
Webapp that allows you to create surveys for a group of users or/and express your opinion in a particular matter
## User Stories
-  **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault
-  **Signup:** As an anon I can sign up in the platform so that I can create or participate in surveys
-  **Login:** As a user I can login to the platform so that I can create or participate in surveys
-  **Logout:** As a user I can logout from the platform so that no one else can use it
-  **Survey list** As a user I want to see the list of surveys so that I can participate or see the results
-  **Create survey** As a user I want to create a survey so that I can invite users and ask them about anything
-  **Participate in survey** As a user I want to participate in a survey so that I can express my position
-  **See survey results** As a user I can see the current survey results so that I can know what option got more votes
## Backlog
- Public surveys
- Protected surveys only for participants
- Add my surveys section
- Add multiple choice questions
- Add profile section
# Client
## Routes
- `/`
  - HomePageComponent
  - public
  - just promotional copy
- `/auth/signup`
  - SignupPageComponent
  - anon only
  - signup form, link to login
  - navigate to homepage after signup
- `/auth/login`
  - LoginPageComponent
  - anon only
  - login form, link to signup
  - navigate to homepage after login
- `/survey` 
  - SurveyListComponent
  - user only
  - shows all surveys
- `/survey/new` 
  - NewSurveyComponent
  - user only
  - form to create the survey
- `/survey/:id` 
  - SurveyComponent
  - user only, userId in participants list
  - shows all the options and allows the user to vote in
  - BE validation that the user has not voted
- `/survey/:id/results` 
  - SurveyResultsComponent
  - user only
  - shows all results
- `**`
  - NotFoundPageComponent
## Components
- Login:
  - userFormComponent(title: string, button: string, onSubmit: function)
- Sign up:
  - userFormComponent(title: string, button: string, onSubmit: function)
- Survey list:
  - searchFormComponent
  - surveyListComponent (list: array)
  - surveyElementListComponent (surveyTitle: string, votes: number, participants: number, hasVoted: boolean )
  - newSurveyButtonComponent (onSubmit: function)
- New Survey:
  - newSurveyComponent (surveyTitle: string, answers: array, participants: array, hasVoted: boolean)
  - createSurveyButtonComponent (onSubmit: function)
- Survey:
  - SurveyComponent (surveyTitle: string, answers: array, hasVoted: boolean)
  - voteSurveyButtonComponent (onSubmit: function)
- Survey Results:
  - SurveyResultsComponent (surveyTitle: string, surveyChart, answers: array [ { answerTitle, votes } ])
## Services
- Auth Service
  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
- Survey Service
  - survey.list()
  - survey.detail(idSurvey)
  - survey.search( { user: string, text: string } )
  - survey.create( { surveyTitle: string, answers: array } )
  - survey.read(idSurvey)
  - survey.update({idSurvey, idAnswer})
  - survey.results(idSurvey)
# Server
## Models
User model
```javascript
{
  username: String // required
  email: String // required & unique
  password: String // required
}

```
Survey model
```javascript
{
  participants: Array {ObjectID ref: User, hasVoted: boolean}
  title: String
  answers: - Array { answerTitle: String, votes: Number }
  owner: - ObjectID ref: User
}
```
## API Endpoints (backend routes)
- GET /auth/me
  - 404 if no user in session
  - 200 with user object
- POST /auth/signup
  - 401 if user logged in
  - body:
    - username
    - email
    - password
  - validation
    - fields not empty (422)
    - user not exists (409)
  - create user with encrypted password
  - store user in session
  - 200 with user object
- POST /auth/login
  - 401 if user logged in
  - body:
    - username
    - password
  - validation
    - fields not empty (422)
    - user exists (404)
    - password matches (404)
  - store user in session
  - 200 with user object
- POST /auth/logout
  - body: (empty)
  - 204
- GET /survey
  - get list of surveys
- POST /survey
  - creates new survey  
  - body:
    - participants
    - title
    - answers
    - owner
  - validation
    - fields not empty (422)
- GET /survey/:id
  - get details from concrete survey
- PUT /survey/:id
  - edits detail (vote) in the survey
  - body:
    - participants.hastVoted = yes
    - answers.value++
- DELETE /survey/:id
  - delete a survey
- GET /survey/:id/results
  - get result details from concrete survey
## Links
- https://www.chartjs.org/docs/latest/
### Git
The urls to your repositories and to your deployed project:
- https://github.com/sllonch/survyay-frontend
- https://github.com/sllonch/survyay-backend
- [Deploy Link](https://survyay.firebaseapp.com)
### Slides
The url to your presentation slides
[Slides Link](TBC)

