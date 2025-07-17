import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import fs from "fs";
// import { bodyparser } from "body-parser";

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/public/views");
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/blog", (req, res) => {
    res.render("blog_template.ejs");
});

app.post("/login", (req, res) => {
    const password = req.body.password;
    if (password === "admin_admin") {
        res.render("admin_panel.ejs");
    }
    else if (password === "reader_reader") {
        res.render("reader_page.ejs");
    }
    else {
        res.send("Incorrect password");
    }
});

app.get("/writer_panel.ejs", (req, res) => {
    res.render("writer_panel.ejs");
});

function readerLoad(req, res) {
      const blogsDir = path.join(__dirname, "public", "blogs");
      fs.readdir(blogsDir, (err, files) => {
    if (err) {
      console.error("Error reading blogs directory:", err);
      return res.status(500).send("Could not load blogs");
    }

    const blogFiles = files.filter(file => file.endsWith(".html"));
    const blogLinks = blogFiles.map(file => ({
        title: file.replace(".html", ""),
        path: `blogs/${file}`
    }));
    res.render("reader_page.ejs", { blogs: blogLinks }); })
}

app.get("/reader_page.ejs", readerLoad);

function PanelWrite(req, res, next) {
    const title = req.body.title;
    const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const content = req.body.blog_body;
    if (!title || !content) {
        return res.status(400).send("Title and content are required.");
        } 
     
        const htmlAppend =  
    `<!DOCTYPE html>
    <html>
        <head>
        <link rel="stylesheet" href="/styles/writer.css">
        <title>${title}</title>
        </head>
        <body>
        <h1>${title}</h1>
        <p>${content}</p>
        <a href="/reader_page.ejs">← Back to home</a>
        </body>
    </html>`;

        const filePath = `./public/blogs/${safeTitle}.html`;
        fs.writeFile(filePath, htmlAppend, (err) => {
        if (err) {
        console.error("Error writing blog file:", err);
        return res.status(500).send("Error saving blog. Please try another title.");
        };
        res.send(`Blog saved successfully! <a href="/blogs/${safeTitle}.html">`);
        });
    }

app.post("/write_to_panel", PanelWrite);

app.post("/delete-blog", (req, res) => {
    const blogTitle = req.body.blogName;
    const safeName = blogTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const filePath = path.join(__dirname, "public", "blogs", `${safeName}.html`);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("Error deleting blog file:", err);
            return res.status(500).send("Error deleting blog. Please check the name!");
        }
        res.send(`Blog ${blogTitle} deleted successfully!`);
        // res.render("admin_panel.ejs");
    });
});

app.listen(port, (req, res) => {
    console.log(`Server is running on http://localhost:${port}`);
})