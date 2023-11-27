const cloudinary = require("../middleware/cloudinary");
const Cocktail = require("../models/Cocktail");
const Favorite = require("../models/Favorite");

module.exports = {
  getProfile: async (req, res) => {
    console.log(req.user);
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const cocktail = await Cocktail.find({user: req.user.id});
      //Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", {cocktail: cocktail, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => {
    console.log(req.user);
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const cocktail = await Cocktail.find({user: req.user.id});
      //Sending post data from mongodb and user data to ejs template
      res.render("favorites.ejs", {cocktail: cocktail, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  getCocktail: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const cocktail = await Cocktail.findById(req.params.id);
      res.render("cocktail.ejs", {cocktail: cocktail, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createCocktail: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content
      await Cocktail.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  favoriteCocktail: async (req, res) => {
    try {
      await Favorite.create({
        user: req.user.id,
        recipe: req.params.id,
      });
      console.log("Cocktail Favorited!");
      res.redirect(`/cocktail/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likeCocktail: async (req, res) => {
    try {
      await Cocktail.findOneAndUpdate(
        {_id: req.params.id},
        {
          $inc: {likes: 1},
        }
      );
      console.log("Likes +1");
      res.redirect(`/cocktail/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deleteCocktail: async (req, res) => {
    try {
      // Find post by id
      let cocktail = await Cocktail.findById({_id: req.params.id});
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(cocktail.cloudinaryId);
      // Delete post from db
      await Cocktail.remove({_id: req.params.id});
      console.log("Deleted Cocktail");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
