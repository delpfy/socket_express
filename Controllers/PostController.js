import PostModel from "../Models/Post.js";

export const create = async (req, res) => {
  // Trying to create new post and if successful, save it to database.
  try {
    const post = await new PostModel({
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
      content: req.body.content,
    }).save();
    const posts = await PostModel.find();

    return res.status(200).json({
      success: true,
      posts: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // Finding all posts.
    const posts = await PostModel.find();

    res.status(200).json({
      success: true,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getOne = async (req, res) => {
  try {
    // Trying to find post by provided id.
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    } else {
      res.status(200).json({
        post
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const remove = async (req, res) => {
  try {
    // Trying to find post by provided id.
    const post = await PostModel.findOneAndDelete({
      _id: req.params.id,
    });

    if (post) {
      const posts = await PostModel.find();
      res.status(200).json({
        success: true,
        posts: posts,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const update = async (req, res) => {
  try {
    // Trying to find post by provided id.
    const post = await PostModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        content: req.body.content,
      },
      { new: true }
    );

    if (post) {
      const posts = await PostModel.find();
      res.status(200).json({
        success: true,
        posts: posts,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
