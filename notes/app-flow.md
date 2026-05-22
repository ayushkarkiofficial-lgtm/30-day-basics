# App Flow Notes

Use this file to keep plain-English notes about how apps move data.

## Day 3 - Startup Automation Contact Form

### User Flow

1. User opens the website.
2. User fills in name, email, and one manual task.
3. User clicks `Send request`.
4. Frontend JavaScript checks the fields.
5. If something is missing or the email format is wrong, the page shows an error.
6. If the fields are valid, the page saves the submission in this browser using `localStorage`.
7. The page clears the form and shows a success message.

### Responsibility Map

Frontend:
- Shows the form and messages.
- Reads user input.
- Runs basic validation.
- Gives immediate feedback.

Backend/API:
- Not built in this static demo.
- In a real app, this would receive the submission, apply trusted validation, and decide what happens next.

Database/storage:
- Simulated with browser `localStorage`.
- In a real app, this would be a database table for leads or workflow review requests.

Environment variables:
- Not needed for this static demo.
- In a real app, secrets such as database URLs, API keys, email service keys, and webhook signing secrets belong on the server, not in public HTML, CSS, or browser JavaScript.

### Demo Limitation

`localStorage` is browser-only memory. It proves the app flow, but it is not a team inbox, CRM, or reliable database.

### JavaScript Built-Ins And Browser APIs Used

In a browser, JavaScript starts with many names already available. Some come from the JavaScript language itself, and some come from the browser environment. That is why this small static site can use things like `document`, `localStorage`, `Array`, and `Date` without importing them.

Language built-ins:
- `Object` - the base type for most JavaScript objects. Used when working with key/value data.
- `Object.values(...)` - returns an array of an object's values.
- `Object.keys(...)` - returns an array of an object's property names.
- `Object.entries(...)` - returns an array of `[key, value]` pairs.
- `Array` - the built-in list type.
- `.filter(...)` - array method that keeps only items that pass a test.
- `.sort(...)` - array method that orders items.
- `.forEach(...)` - array method that runs code once for each item.
- `JSON` - helper for converting between JavaScript data and text.
- `JSON.parse(...)` - turns saved JSON text back into JavaScript data.
- `JSON.stringify(...)` - turns JavaScript data into JSON text for storage.
- `Date` - built-in date/time object.
- `new Date()` - creates a date/time value.
- `.toISOString()` - turns a date into a standard text timestamp.
- `.getTime()` - returns a date as a number of milliseconds.
- `Number` - built-in number helper.
- `Number.isNaN(...)` - checks whether a value is the special invalid number value.
- `Intl.DateTimeFormat` - built-in international formatting helper.
- `.format(...)` - formats a date for display based on locale.

Browser APIs:
- `document` - the current HTML page as an object JavaScript can read and change.
- `document.querySelector(...)` - finds the first matching element in the page.
- `document.createElement(...)` - creates a new HTML element.
- `element.querySelector(...)` - finds a matching element inside another element.
- `element.textContent` - reads or changes visible text inside an element.
- `element.className` - reads or changes the element's class string.
- `element.classList.add(...)` - adds one CSS class.
- `element.append(...)` - adds children inside an element.
- `element.replaceChildren(...)` - clears/replaces child elements.
- `form.addEventListener(...)` - runs code when an event happens, such as submit.
- `event.preventDefault()` - stops the browser's default form submit behavior.
- `FormData` - browser helper for reading form fields.
- `formData.get(...)` - gets one field value by name.
- `form.reset()` - clears the form fields.
- `localStorage` - browser storage that persists in the same browser.
- `localStorage.getItem(...)` - reads a saved value by key.
- `localStorage.setItem(...)` - saves a value by key.

Mental model:
- In Python, you often write `import json` or `from datetime import datetime`.
- In browser JavaScript, the language and browser expose many common tools globally.
- A dot means "get a property or call a method from the thing on the left."
- Example: `submissions.filter(...)` calls the `filter` method on an array.
- Example: `submission.email` reads the `email` property from one object.
