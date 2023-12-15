const express = require("express"),
    bodyParser = require("body-parser"),
    mysql = require("mysql"),
    cors = require("cors"),
    path = require("path"),
    app = express(),
    port = process.env.PORT  || 3000,
    db = mysql.createConnection({ host: "localhost", user: "root", password: "test", database: "contact" });
db.connect((s) => {
    if (s) {
        console.error("Error connecting to the database:", s);
        return;
    }
    console.log("Connected to MySQL database");
}),
    app.use(cors()),
    app.use(bodyParser.json()),
    app.post("/addTask", (s, e) => {
        let { taskName: r, description: t, dueDate: a } = s.body;
        if (!r) return e.status(400).json({ success: !1, error: "Le champ 'Nom de la t\xe2che' est obligatoire." });
        db.query("INSERT INTO Tasks (TaskName, Description, DueDate) VALUES (?, ?, ?)", [r, t, a], (s, r) =>
            s ? (console.error("Error inserting task:", s), e.status(500).json({ success: !1, error: "Erreur lors de l'ajout de la t\xe2che." })) : (console.log("Task added successfully"), e.json({ success: !0 }))
        );
    }),
    app.get("/getTasks", (s, e) => {
        db.query("SELECT * FROM Tasks", (s, r) => (s ? (console.error("Error retrieving tasks:", s), e.status(500).json({ success: !1, error: "Erreur lors de la r\xe9cup\xe9ration des t\xe2ches." })) : e.json({ success: !0, tasks: r })));
    }),
    app.delete("/deleteTask/:taskId", (s, e) => {
        let r = s.params.taskId;
        db.query("DELETE FROM Tasks WHERE ID = ?", [r], (s, r) =>
            s ? (console.error("Error deleting task:", s), e.status(500).json({ success: !1, error: "Erreur lors de la suppression de la t\xe2che." })) : (console.log("Task deleted successfully"), e.json({ success: !0 }))
        );
    }),
    app.get("/", (s, e) => {
        e.sendFile(path.join(__dirname, "app.html"));
    }),
    app.listen(3e3, () => {
        console.log(`Server is running on port ${port}`);
    });
