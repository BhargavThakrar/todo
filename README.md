# Todo assignment (fullstack)

This acts like a monorepo that hosts both the api and frontend application. But, due to time constraints I've not configured any actual monorepo setup instead, its just a collection of apps embedded into one single repo.

## Tech stack
### Backend (REST API)
- Uses [nestjs](https://nestjs.com/) with express
- Sqlite for in-memory database
- Typeorm as ORM tool
- Openapi spec for api documentation

### Frontend (Client app)
- Uses reactjs configured with [vite](https://vitejs.dev/)
- TailwindCSS for styling
- Its a single page application with everything rendered on client side

The node version used is mentioned in .nvmrc (v20.*)

## Running locally
### Start the backend
- `cd apps/api/`
- `npm i`
- `npm run start:dev`
- Server is started on [http://localhost:3000/todos](http://localhost:3000/todos)

### Start the frontend
- `cd apps/client-app/`
- `npm i`
- `npm run dev`
- Apps is started on [http://localhost:5173/](http://localhost:5173/)

## Assumptions made
- There was a slight confusion on what kind of filtering was expected. Is it sorting or filtering or both? So I implemented both - sorting dueDate in ascending or descending order and filtering by completed status
- There was no mention of pagination hence, I didn't implement one as it would take even more time to implement it. But I was thinking more in the lines of implementing an infinite scroll
- Both backend and frontend apps run only locally, there is no extra care taken like creating Docker files and make them deployment ready. The code itself is production ready but the apps are not in a deployable state at the moment

## Backend
- It is designed to be a REST API
- Once you start the server, the api doc can be found here - [http://localhost:3000/api](http://localhost:3000/api)
- Security is taken care wherever I can specially with query params for filtering and sorting. You cannot sort by passing any other date column other than dueDate and any extra unsupported query param you send is stripped off. Also the [mapper class](apps/api/src/modules/todos/todos.mapper.ts) ensures that only the relevant fields are mapped to the internal model

### Structure
- [lib](apps/api/libs) contains all the vendor specific integrations and a shared config
- [src/bootstrap](apps/api/src/bootstrap) sets up the application like setting cors, seeding the database and generating the openapi spec
- [src/modules](apps/api/src/modules) contains the actual controller and service files. Each root level endpoint path gets mapped to each module. For example in this case `/todos` endpoint is mapped to `src/modules/todos`. Any code shared across the modules goes into `src/modules/shared`

### Authentication
The API does not implement any authentication layer in the interest of time. But we can build custom authentication and authorization guards and enforce them via [@UseGuards](https://docs.nestjs.com/guards) decorator. We can also build custom decorators to return the decoded contents from the auth token for clean code instead of decoding within every controller function.

The authentication should ideally be implemented as per OAuth flows that involves some authorization server that returns access token (JWT) by following one of the flows defined in [OAuth 2.0 spec](https://oauth.net/2/).

Once the access token is issued, client apps can pass this token as authorization header as a bearer token. The custom auth guard within the API will validate this token and check for the scopes passed in the token to allow the request to specific REST endpoints.

### Database
[Entity](apps/api/libs/database/src/entities/todo.entity.ts)

The API uses in-memory Sqlite database which is wrapped by the ORM tool - [typeorm](https://typeorm.io/). The database is setup as a separate lib under [libs/database](apps/api/libs/database) which hosts the typeorm repositories giving us better flexibility and maintainability. Also, the configuration for Sqlite database comes from another lib under [libs/shared-config](apps/api/libs/shared-config) which gives us an ability to use different database configurations within the same API.

The way the database layer is built allows us better adaptability and achieves loose coupling with the vendors used.

#### Seed
When you start the server, the database is already seeded with sample data which is controlled at the application bootstrap layer [here](apps/api/src/bootstrap/seed.ts). This is just for demo purpose, ideally this should be either run manually or if done programmatically then executing only on dev environment.

### DTO (Data Transfer Object)
Hosted here - [apps/api/src/modules/todos/todos.dto.ts](apps/api/src/modules/todos/todos.dto.ts)

The API uses the concept of a dto to map the data from the api contract to the internal model and vice versa. This dto is also used to generate the request/response schemas for the openapi spec. Additionally class validator is used to validate the incoming requests which makes it more maintainable and introduces less verbosity. The controller is left as thin as possible because of this implementation that just routes the requests to the service layer.

### Error handling
The API uses all the default error handling done by nestjs framework. There are customizations possible in this area like formatting an error in particular way, etc but have left them out for the scope of this assignment.

### Testing
Unit tests are already written for controller, service and mapper classes using jest. The [service](api/src/modules/todos/todos.service.spec.ts) layer is unit tested by spinning up an actual in memory database that makes a real call to repository functions.

## Frontend
- It does not use any routing to keep things simple
- There is no state management to avoid over engineering the solution and adding that extra complexity

### Structure
#### Components
All the component resides in the [components](apps/client-app/src/components) directory and its a bit flat due to simplicity reasons. The main component is [TodoList](apps/client-app/src/components/TodoList.tsx) which is responsible to render the initial todo list, refreshing the list based on actions like, filtering, adding, etc. and also controls the add and edit functionality for each todo.
- TodoList encapsulates following components
    - [TodoFilter](apps/client-app/src/components/TodoFilter.tsx) to just control the state and UI of the filtering functionality
    - [TodoItem](apps/client-app/src/components/TodoItem.tsx) to render each todo item and controls the toggling of completed attribute and handling the delete functionality
    - [TodoForm](apps/client-app/src/components/TodoForm.tsx) to render the form elements both in case of edit and add view and is also responsible to validate the form
    - [SlidingPanel](apps/client-app/src/components/SlidingPanel.tsx) is the helper component to slide a panel that renders the TodoForm component

#### Lib & Util
- There is only one lib i.e. [httpclient](apps/client-app/src/lib/httpclient.ts) that allows to make http calls in a more generic way agnostic to the library used to make an http call. Currently it uses the browsers fetch api but can have any library used without making any changes to the components making these network calls
- There is only a [date util](apps/client-app/src/util/date.util.ts) being used to perform manipulations with date object. No library like moment is used to keep things simple

### Testing
Unfortunately there are no tests for the frontend application as I was running out of the time.

When you load the app locally, it double renders the component so, you might see the fetch todos call is made twice in the browsers network tab. This is fine and only happens on dev mode when using React strict mode as mentioned [here](https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-double-rendering-in-development)
