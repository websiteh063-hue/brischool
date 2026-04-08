# B.R. International School Website

Modernized static school website for B.R. International School, rebuilt from the uploaded project files with a cleaner layout, improved responsiveness, optimized media usage, and GitHub Pages friendly structure.

## What changed

- Rebuilt the homepage with semantic HTML5 sections for hero, about, leadership, programs, facilities, campus life, trust highlights, and contact.
- Rebuilt the gallery as a lazy-loaded responsive media grid with lightbox support.
- Moved site media into `assets/images` and introduced lean custom assets in `assets/css` and `assets/js`.
- Added SEO basics such as descriptive meta tags, proper heading structure, alt text, and organization schema markup.
- Optimized the two large hero visuals by creating compressed JPEG versions for faster loading.

## Project structure

```text
www.brischool.in/
|-- assets/
|   |-- css/
|   |   `-- style.css
|   |-- js/
|   |   `-- main.js
|   `-- images/
|       |-- favicon/
|       |-- gallery/
|       `-- site/
|-- index.html
|-- gallery.html
`-- README.md
```

## Local preview

Because this is a static site, you can preview it by opening `index.html` directly in a browser.

For a cleaner local testing experience, run a simple static server from the project root if you have one available, then open:

- `index.html`
- `gallery.html`

## GitHub Pages deployment

1. Create a new GitHub repository.
2. Initialize git locally in the project folder if needed.
3. Commit the site files.
4. Push the default branch to GitHub.
5. In the repository settings, enable GitHub Pages from the root of the default branch.

Example commands:

```bash
git init
git add .
git commit -m "Rebuild B.R. International School website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Notes

- The enquiry form is currently static and ready to connect to a form backend later.
- Original gallery media is preserved and reused from the uploaded project.
