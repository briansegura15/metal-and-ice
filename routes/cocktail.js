const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const cocktailController = require("../controllers/cocktail");
const {ensureAuth} = require("../middleware/auth");

//Post Routes
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id
router.get("/:id", ensureAuth, cocktailController.getCocktail);

//Enables user to create post w/ cloudinary for media uploads
router.post(
  "/createCocktail",
  upload.single("file"),
  cocktailController.createCocktail
);

router.post("/favoriteCocktail/:id", cocktailController.favoriteCocktail);

//Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likeCocktail/:id", cocktailController.likeCocktail);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deleteCocktail/:id", cocktailController.deleteCocktail);

module.exports = router;
