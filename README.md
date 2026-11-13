# Nico Andes | Developer Portfolio

A fast, dependency-free portfolio with three working demo projects. Plain HTML, CSS, and JavaScript. No build step.

## Structure

```
index.html                    Portfolio page
assets/css/style.css          Design tokens (top of file) and styles
assets/js/main.js             Mobile menu and active-link highlight
projects/shared.css|js        Styles and helpers used by every demo
projects/focus-timer/         Pomodoro timer with tasks
projects/budget-planner/      Expense log with a live donut chart
projects/markdown-notes/      Markdown editor with live preview
```

Each demo stores data in the browser with `localStorage`, so there is no backend.

## Before publishing: replace the placeholders

Set the real contact details (run from the repo root):

```bash
grep -rl "YOUR-GITHUB-USERNAME" . | xargs sed -i 's/YOUR-GITHUB-USERNAME/real-github-name/g'
grep -rl "YOUR-FACEBOOK-USERNAME" . | xargs sed -i 's/YOUR-FACEBOOK-USERNAME/real-facebook-name/g'
grep -rl "YOUR-EMAIL@example.com" . | xargs sed -i 's/YOUR-EMAIL@example.com/real@email.com/g'
```

Then search `index.html` for `[` and `20XX` and fill in the location, experience, education, and certificate. The tech stack list is also sample content. Edit it to match Nico's real skills.

The "Source code" buttons assume the repository is named `nico-andes-portfolio` with the default branch `main`.

## Run locally

```bash
python3 -m http.server 8000   # open http://localhost:8000
```

## Deploy

- **GitHub Pages:** Settings > Pages > Deploy from branch `main` / root. The Live demo links are relative, so they work as-is.
- **Netlify or Vercel:** import the repo, no build command, publish directory `.`
