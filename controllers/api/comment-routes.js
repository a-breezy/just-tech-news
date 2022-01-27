const router = require("express").Router();
const { Comment, Post } = require("../../models");

router.get("/", (req, res) => {
	Post.findOne({
		where: {
			id: req.params.id,
		},
		attributes: ["id", "comment_text", "user_id", "post_id"],
		include: [
			{
				model: Comment,
				attributes: ["id"],
			},
		],
	})
		.then((dbCommentData) => {
			if (!dbCommentData) {
				res.status(404).json({ message: "No comment found with this id" });
				return;
			}
			res.json(dbCommentData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

router.post("/", (req, res) => {
	// check session
	if (req.session) {
		Comment.create({
			comment_text: req.body.comment_text,
			post_id: req.body.post_id,
			// use id from session
			user_id: req.session.user_id,
		})
			.then((dbCommentData) => res.json(dbCommentData))
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	}
});

router.delete("/:id", (req, res) => {
	Comment.destroy({
		where: {
			id: req.params.id,
		},
	})
		.then((dbCommentData) => {
			if (!dbCommentData) {
				res.status(404).json({ message: "No comment found with this id" });
				return;
			}
			res.json(dbCommentData);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

module.exports = router;
