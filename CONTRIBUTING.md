# Contributing Guide

### First Time Setup
Make sure you have cloned the repository to your computer. You can do this either through the terminal with `git clone https://github.com/Apexal/telestrations` or through a tool like GitHub Desktop.

Make sure you have NodeJS installed. You can test this by running `node -v` in a terminal. You should have a version 12 or higher.

Install dependencies with `npm install` in a terminal in the project folder.

### Contribution Cycle
> Note that all the git commands you see here can be done through GitHub Desktop or similar!
1. Make sure you are on the `main` branch
    - `git checkout main`
2. Pull any changes from GitHub to the main branch
    - `git pull origin main`
3. Make a new branch for the work you are about to do
    - `git checkout -b new_branch_name`
    - the name can be related to the work, or the number of the issue you are working on
4. Make changes to the code!
    - Make changes
    - `git add .`
    - `git commit -m "Descriptive message about the changes"`
5. Repeat step 4 until you are "done"
6. **Format your code and commit!**
    - `npm run fix`
    - `git add .`
    - `git commit -m "Formatted code"`
6. Push to GitHub
    - `git push origin new_branch_name`
    - be sure to use the right name of the branch
7. Open a PR to request to merge your changes in your branch back into the `main` branch!
    - You'll see a popup on GitHub for this
9. Let the team know you opened a PR and they will review it
10. Once someone has reviewed and approved it, go ahead and merge it
11. **Don't forget to switch back to the `main` branch when done!**
    - `git checkout main`
    - `git pull origin main`

### Running It
You'll probably want to be running the server as you code! Here are the steps:
1. Run the backend server
    - details are in the `telestrations-backend/CONTRIBUTING.md` file
    - should just be `npm start` in the project folder
1. Start dev server
    - `npm start`
    - this should automatically open your browser
    - if it doesn't simply open, http://localhost:3000/

---

Ask the team for assistance with any of these steps.